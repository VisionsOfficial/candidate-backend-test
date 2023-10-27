import { Router, Request, Response } from 'express';
import { Contract, Participant } from '../schemas/schemas';
import {
    checkContractPostPayload,
    checkJWT,
    checkParamId,
    checkQueryFilter,
    checkCrontractPUTPayload,
} from '../middlewares/';
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
            res.status(200).json(contracts);
        } catch (error) {
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
            return res.status(201).json(saved);
        } catch (error) {
            console.error(error);
            return res.status(400).json('Bad request');
        }
    }
);

contractsRouter.put(
    '/:contractId',
    checkJWT.default,
    checkCrontractPUTPayload.default,
    async (req: Request, res: Response) => {
        try {
            const { contractId } = req.params;
            const contractFound = await Contract.findById(contractId);
            if (!contractFound) {
                return res.status(404).json('Contract not found');
            }
            const statusNotSignedOrRevoked = new RegExp(`signed|revoked`);
            // if contract status signed or revoked, not updatable anymore
            if (statusNotSignedOrRevoked.test(contractFound.status)) {
                return res.status(400).json("Contract can't be modified");
            }
            // TODO: Here should go a logic of checking if condition match
            // need more knowledge about ODRL
            const { requesterId } = req.body;
            if (contractFound.consumerId.toString() === requesterId) {
                contractFound.consumerSignature = true;
            } else if (contractFound.providerId.toString() === requesterId) {
                contractFound.providerSignature = true;
            } else {
                return res
                    .status(401)
                    .json('Participant not part of the contract');
            }
            if (
                contractFound.providerSignature &&
                contractFound.consumerSignature
            ) {
                contractFound.status = 'signed';
            }
            await contractFound.save();
            return res.status(200).json(contractFound);
        } catch (error) {
            console.error(error);
            return res.status(400).json('Bad request');
        }
    }
);