import { Router, Request, Response } from 'express';
import { contract } from '../schemas/schemas';

export const contractsRouter = Router();

contractsRouter.get('/', async (_req: Request, res: Response) => {
    try {
        const contracts = await contract.find();
        res.status(200).json(contracts);
    } catch (error) {
        res.status(400).end();
    }
});
