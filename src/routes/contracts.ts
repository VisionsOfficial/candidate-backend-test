import { Router, Request, Response } from 'express';
import { Contract, Participant } from '../schemas/schemas';
import {
    checkMongoId,
    checkContractCreationPayload,
} from '../middlewares/middlewares';

export const contractsRouter = Router();

contractsRouter.get('/', async (_req: Request, res: Response) => {
    try {
        const contracts = await Contract.find();
        res.status(200).json(contracts);
    } catch (error) {
        res.status(400).end();
    }
});

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
            console.log(providerId, consumerId, conditions, target);
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
            // adding contract instance to both parts
            provider.contracts.push(newContract._id);
            consumer.contracts.push(newContract._id);
            await provider.save();
            await consumer.save();
            return res.status(201).json(saved);
        } catch (error) {
            console.error(error);
            return res.status(400).json('Bad request');
        }
    }
);
