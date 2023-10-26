import { NextFunction, Request, Response } from 'express';
import { isValidObjectId, Model } from 'mongoose';
import { Condition } from '../interface/interfaces';

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
    // checking every expected field and their type
    // package like express validator are doing all this way better
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
    if (typeof conditions === 'object' && !Array.isArray(conditions)) {
        isInstanceOfCondition(conditions, errors);
    } else {
        errors.push(new CustomError('body', 'conditions', conditions));
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

function isInstanceOfCondition(
    object: any,
    errors: CustomError[]
): object is Condition {
    if (
        !('context' in object) ||
        !('type' in object) ||
        !('permission' in object) ||
        typeof object.context !== 'string' ||
        typeof object.type !== 'string' ||
        typeof object.permission !== 'object'
    ) {
        errors.push(
            new CustomError(
                'body',
                'condition',
                'missing fields or invalid value.'
            )
        );
        return false;
    }
    const perm = object.permission;
    if (
        !('action' in perm) ||
        !('target' in perm) ||
        !('constraint' in perm) ||
        typeof perm.action !== 'string' ||
        typeof perm.target !== 'string' ||
        !Array.isArray(perm.constraint)
    ) {
        errors.push(
            new CustomError(
                'body',
                'condition.permission',
                'missing fields or invalid value.'
            )
        );
        return false;
    }
    const constraint = perm.constraint;
    if (constraint.length) {
        for (const i in constraint) {
            if (
                !('leftOperand' in constraint[i]) ||
                !('operator' in constraint[i]) ||
                !('rightOperand' in constraint[i]) ||
                typeof constraint[i].leftOperand !== 'string' ||
                typeof constraint[i].operator !== 'string' ||
                typeof constraint[i].rightOperand !== 'object'
            ) {
                errors.push(
                    new CustomError(
                        'body',
                        'condition.permission',
                        'missing fields or invalid value.'
                    )
                );
                return false;
            } else {
                const rightOp = constraint[i].rightOperand;
                if (
                    !('value' in rightOp) ||
                    !('type' in rightOp) ||
                    typeof rightOp.value !== 'string' ||
                    typeof rightOp.type !== 'string'
                ) {
                    errors.push(
                        new CustomError(
                            'body',
                            `condition.permission[${i}]`,
                            'invalid value.'
                        )
                    );
                    return false;
                }
            }
        }
    }
    return true;
}
