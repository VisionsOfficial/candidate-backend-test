import { Router, Request, Response } from 'express';
import { Contract, Participant } from '../schemas/schemas';
import {
    checkContractPostPayload,
    checkJWT,
    checkParamId,
    checkQueryFilter,
    checkContractPayload,
} from '../middlewares/';
import { logger } from '../utils/logger';
// import jwtCheck from '../middlewares/jwtCheck';

export const contractsRouter = Router();

contractsRouter.get(
    '/',
    checkQueryFilter.default,
    async (req: Request, res: Response) => {
        try {
            const { participantId, status, creation } = req.query;
            let options = {};
            if (participantId) {
                Object.assign(options, {
                    $or: [
                        { providerId: participantId },
                        { consumerId: participantId },
                    ],
                });
            }
            if (status) {
                Object.assign(options, { status });
            }
            if (creation) {
                Object.assign(options, { creation: { $gte: creation } });
            }
            const contracts = await Contract.find(options);
            logger.info(`${req.ip} GET /contracts ${new Date().toISOString()}`);
            res.status(200).json(contracts);
        } catch (error) {
            logger.error(error);
            res.status(400).end();
        }
    }
);

contractsRouter.get(
    '/:id',
    checkParamId.default,
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const contractFound = await Contract.findById(id);
            if (contractFound) {
                res.status(200).json(contractFound);
            } else {
                res.status(400).json('Contract not found');
            }
        } catch (error) {
            logger.error(error);
            res.status(400).json('Bad request');
        }
    }
);

contractsRouter.post(
    '/',
    // payload should be fine
    checkContractPostPayload.default,
    async (req: Request, res: Response) => {
        try {
            const { providerId, consumerId, conditions, target } = req.body;
            // checking if both parts exists in db
            const provider = await Participant.findById(providerId);
            const consumer = await Participant.findById(consumerId);
            if (!provider || !consumer) {
                return res
                    .status(404)
                    .json('Missing one party or more to create a contract.');
            }
            const newContract = new Contract({
                consumerId,
                providerId,
                conditions,
                target,
            });
            const saved = await newContract.save();
            logger.info(
                `${req.ip} POST /contracts ${new Date().toISOString()}`
            );
            return res.status(201).json(saved);
        } catch (error) {
            logger.error(error);
            return res.status(400).json('Bad request');
        }
    }
);

contractsRouter.put(
    '/:contractId/sign',
    checkJWT.default,
    checkContractPayload.checkParamContractIdAndBodyReqId,
    async (req: Request, res: Response) => {
        try {
            const { contractId } = req.params;
            const contractFound = await Contract.findById(contractId);
            if (!contractFound) {
                logger.error(
                    `${
                        req.ip
                    } PUT /contracts/:contractId/sign ${new Date().toISOString()}`,
                    { contractId, event: 'Not found' }
                );
                return res.status(404).json('Contract not found');
            }
            const statusNotSignedOrRevoked = new RegExp(`signed|revoked`);
            // if contract status signed or revoked, not updatable anymore
            if (statusNotSignedOrRevoked.test(contractFound.status)) {
                logger.error(
                    `${
                        req.ip
                    } PUT /contracts/:contractId/sign ${new Date().toISOString()}`,
                    {
                        contractId,
                        event: `Contract can't be modified. Status: ${contractFound.status}`,
                    }
                );
                return res
                    .status(400)
                    .json(
                        `Contract can't be modified. Status: ${contractFound.status}`
                    );
            }
            // TODO: Here should go a logic of checking if condition match
            // need more knowledge about ODRL
            const { requesterId } = req.body;
            if (contractFound.consumerId.toString() === requesterId) {
                contractFound.consumerSignature = true;
            } else if (contractFound.providerId.toString() === requesterId) {
                contractFound.providerSignature = true;
            } else {
                logger.error(
                    `${
                        req.ip
                    } PUT /contracts/:contractId/sign ${new Date().toISOString()}`,
                    {
                        contractId,
                        event: 'Participant is not part of the contract',
                    }
                );
                return res
                    .status(401)
                    .json('Participant is not part of the contract');
            }
            if (
                contractFound.providerSignature &&
                contractFound.consumerSignature
            ) {
                contractFound.status = 'signed';
            }
            await contractFound.save();
            logger.info(
                `${
                    req.ip
                } PUT /contracts/:contractId/sign ${new Date().toISOString()}`
            );
            return res.status(200).json(contractFound);
        } catch (error) {
            logger.error(error);
            return res.status(400).json('Bad request');
        }
    }
);

contractsRouter.delete(
    '/:contractId/revoke',
    checkContractPayload.checkParamContractIdAndBodyReqId,
    async (req: Request, res: Response) => {
        try {
            const { contractId } = req.params;
            const contractFound = await Contract.findById(contractId);
            if (!contractFound) {
                logger.error(
                    `${
                        req.ip
                    } DELETE /contracts/:contractId/revoke ${new Date().toISOString()}`,
                    {
                        contractId,
                        event: 'Contract not found',
                    }
                );
                return res.status(404).json('Contract not found');
            }
            if (contractFound.status === 'revoked') {
                logger.error(
                    `${
                        req.ip
                    } DELETE /contracts/:contractId/revoke ${new Date().toISOString()}`,
                    {
                        contractId,
                        event: 'Contract already revoked',
                    }
                );
                return res.status(400).json('Contract already revoked');
            }
            const { requesterId } = req.body;
            if (
                contractFound.consumerId.toString() !== requesterId &&
                contractFound.providerId.toString() !== requesterId
            ) {
                logger.error(
                    `${
                        req.ip
                    } DELETE /contracts/:contractId/revoke ${new Date().toISOString()}`,
                    {
                        contractId,
                        event: 'Participant id not part of the contract',
                    }
                );
                return res
                    .status(401)
                    .json('Participant id not part of the contract');
            }
            contractFound.status = 'revoked';
            await contractFound.save();
            logger.info(
                `${
                    req.ip
                } DELETE /contracts/:contractId/revoke ${new Date().toISOString()}`
            );
            return res
                .status(200)
                .json(`contract ${contractFound._id.toString()} is revoked`);
        } catch (error) {
            logger.error(error);
            return res.status(400).json('Bad request');
        }
    }
);
