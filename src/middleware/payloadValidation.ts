import { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../utils/responses/error.responses';
import mongoose from 'mongoose';

const isObjectIdValid = (str: string) => {
    return mongoose.Types.ObjectId.isValid(str);
}

const isEmailValid = (email: string) => {
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailPattern.test(email);
}

function isPasswordValid(str: string) {
    return str.length >= 8;
}
export const payloadValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.params.id && !isObjectIdValid(req.params.id)) {
            throw new Error("Invalid id");
        }

        if (req.body.dataProvider && !isObjectIdValid(req.body.dataProvider)) {
            throw new Error("Invalid dataProvider id");
        }

        if (req.body.dataConsumer && !isObjectIdValid(req.body.dataConsumer)) {
            throw new Error("Invalid dataConsumer id");
        }

        if (req.body.email && !isEmailValid(req.body.email)) {
            throw new Error("Invalid email");
        }

        if (req.body.password && !isPasswordValid(req.body.password)) {
            throw new Error("Password must be at least 8 characters");
        }

        next();
    } catch (err: any) {
        res.status(400).send(errorResponse(err?.message));
    }
};