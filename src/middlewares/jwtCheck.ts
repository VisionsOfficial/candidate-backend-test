import { NextFunction, Response, Request } from 'express';
import { verify } from 'jsonwebtoken';
import { config } from 'dotenv';
config();

const { SECRET } = process.env;

export default function (req: Request, res: Response, next: NextFunction) {
    if (!req.headers.token || typeof req.headers.token !== 'string') {
        return res.status(401).json('Unauthorized');
    }
    const { token } = req.headers;
    // TODO: Check token payload too
    try {
        verify(token, SECRET);
        next();
    } catch (error) {
        return res.status(401).json('Unauthorized');
    }
}
