import { NextFunction, Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';

export default function (req: Request, res: Response, next: NextFunction) {
    let { status, participantId, creation } = req.query;
    const rgStatus = new RegExp(`signed|pending|revoked`);
    if (status && typeof status === 'string' && !rgStatus.test(status)) {
        return res.status(406).json('Invalid query: status');
    }
    if (participantId && !isValidObjectId(participantId)) {
        return res.status(406).json('Invalid query: participantId');
    }
    if (
        creation &&
        (typeof creation !== 'string' ||
            // timestamp ISO string eg: 2023-10-26T16:31:42.464Z
            !new RegExp(
                /^[0-9]{4}-((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01])|(0[469]|11)-(0[1-9]|[12][0-9]|30)|(02)-(0[1-9]|[12][0-9]))T(0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[1-5][0-9]):(0[0-9]|[1-5][0-9])\.[0-9]{3}Z$/
            ).test(creation as string))
    ) {
        return res.status(406).json('Invalid query: creation');
    }
    next();
}
