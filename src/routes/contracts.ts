import { Router, Request, Response } from 'express';
import { contract } from '../schemas/schemas';
import { checkMongoId } from '../middlewares/middlewares';

export const contractsRouter = Router();

contractsRouter.get('/', async (_req: Request, res: Response) => {
    try {
        const contracts = await contract.find();
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
            const contractFound = await contract.findById(id);
            if (contractFound) {
                res.status(200).json(contract);
            } else {
                res.status(400).json('Contract not found');
            }
        } catch (error) {
            res.status(400).end();
        }
    }
);
