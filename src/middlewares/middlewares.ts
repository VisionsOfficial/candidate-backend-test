import { NextFunction, Request, Response } from 'express';
import { isValidObjectId, Model } from 'mongoose';
import { condition } from '../schemas/schemas';

class CustomError {
    position = '';
    key = '';
    value = '';
    constructor(position: string, key: string, value: string) {
        this.position = position;
        this.key = key;
        this.value = value;
    }
}

export function checkMongoId(req: Request, res: Response, next: NextFunction) {
    const id = req.params?.id;
    if (!isValidObjectId(id)) {
        return res.status(406).json('Malformed param: id');
    }
    next();
}

export function checkContractCreationPayload(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { providerId, consumerId, conditions, target } = req.body;
    const errors = [];
    if (!isValidObjectId(providerId)) {
        const err = new CustomError('body', 'providerId', providerId);
        errors.push(err);
    }
    if (!isValidObjectId(consumerId)) {
        const err = new CustomError('body', 'consumerId', consumerId);
        errors.push(err);
    }
    if (Array.isArray(conditions) && conditions.length) {
        for (const condition of conditions) {
            conditionCheck(condition, errors);
        }
    }
    if (!target || typeof target !== 'string') {
        const err = new CustomError('body', 'target', target);
        errors.push(err);
    }
    if (errors.length) {
        return res.status(406).json(errors);
    }
    next();
}

function conditionCheck(obj: any, errors: CustomError[]) {
    console.log('obj instanceof condition: ', obj instanceof condition);

    if (!(obj instanceof condition)) {
        errors.push(new CustomError('body', 'condition', obj));
    }
}
