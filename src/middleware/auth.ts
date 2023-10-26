import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../responses/error.responses';

export const SECRET_KEY: Secret = process.env.SECRET || 'visions';

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token: string | undefined = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error();
        }

        (req as CustomRequest).token = jwt.verify(token, SECRET_KEY);

        next();
    } catch (err) {
        res.status(401).send(errorResponse('Please authenticate'));
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error();
        }

        return jwt.verify(token, SECRET_KEY);

    } catch (err) {
        res.status(401).send(errorResponse('Please authenticate'));
    }
}
