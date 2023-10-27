import { Request, Response } from 'express';
import { Contract } from '../../schemas/schemas';
import { logger } from '../../utils/logger';

export async function getContracts(req: Request, res: Response) {
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

export async function getContractById(req: Request, res: Response) {
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
