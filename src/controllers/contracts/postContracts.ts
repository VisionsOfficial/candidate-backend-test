import { Router, Request, Response } from 'express';
import { Contract, Participant } from '../../schemas/schemas';
import { logger } from '../../utils/logger';

export async function createContract(req: Request, res: Response) {
    try {
        const { providerId, consumerId, conditions, target } = req.body;
        // checking if both parts exists in db
        const provider = await Participant.findById(providerId);
        const consumer = await Participant.findById(consumerId);
        if (!provider || !consumer) {
            return res
                .status(404)
                .json('Missing one part or more to create a contract.');
        }
        const newContract = new Contract({
            consumerId,
            providerId,
            conditions,
            target,
        });
        const saved = await newContract.save();
        logger.info(`${req.ip} POST /contracts ${new Date().toISOString()}`);
        return res.status(201).json(saved);
    } catch (error) {
        logger.error(error);
        return res.status(400).json('Bad request');
    }
}
