import { NextFunction, Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';

export function checkMongoId(req: Request, res: Response, next: NextFunction) {
    const id = req.params?.id;
    if (!isValidObjectId(id)) {
        return res.status(406).json('Malformed param: id');
    }
    next();
}
