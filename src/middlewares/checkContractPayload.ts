import { NextFunction, Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import CustomError from './customError';

export function checkParamContractIdAndBodyReqId(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const errors = [];
    if (!req.params.contractId || !isValidObjectId(req.params.contractId)) {
        errors.push(
            new CustomError('params', 'contractId', req.params.contractId)
        );
    }
    if (!req.body.requesterId || !isValidObjectId(req.body.requesterId)) {
        errors.push(
            new CustomError('body', 'requesterId', req.body.requesterId)
        );
    }
    if (errors.length) {
        return res.status(406).json(errors);
    }
    next();
}
