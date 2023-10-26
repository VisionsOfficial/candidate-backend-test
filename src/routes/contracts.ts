import { Router, Request, Response } from 'express';
import { Contract, Participant } from '../schemas/schemas';
import {
    checkQueryFilter,
    checkMongoId,
    checkContractCreationPayload,
} from '../middlewares/middlewares';

export const contractsRouter = Router();

contractsRouter.get(
    '/',
    checkQueryFilter,
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
    checkMongoId,
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
    checkContractCreationPayload,
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
    // TODO: JWT check
    async (req: Request, res: Response) => {
        try {
            const { contractId } = req.params;
            const contractFound = await Contract.findById(contractId);
            if (!contractFound) {
                return res.status(404).json('Contract not found');
            }
            // TODO: Here should go a logic of checking if condition match
            // need more knowledge about ODRL
            const { requesterId } = req.body;
            if (contractFound.consumerId === requesterId) {
                contractFound.consumerSignature = true;
            }
            if (contractFound.providerId === requesterId) {
                contractFound.providerSignature = true;
            }
            if (
                contractFound.providerSignature &&
                contractFound.consumerSignature
            ) {
                contractFound.status = 'signed';
            }
            await contractFound.save();
            res.status(200).json(contractFound);
        } catch (error) {
            console.error(error);
            return res.status(400).json('Bad request');
        }
    }
);
