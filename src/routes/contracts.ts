import { Router, Request, Response } from 'express';
import { Contract, Participant } from '../schemas/schemas';
import {
    checkContractPostPayload,
    checkJWT,
    checkParamId,
    checkQueryFilter,
    checkContractPayload,
} from '../middlewares/';
import {
    getContracts,
    getContractById,
    createContract,
    signContract,
    revokeContract,
} from '../controllers/';
import { logger } from '../utils/logger';

export const contractsRouter = Router();

contractsRouter.get('/', checkQueryFilter.default, getContracts);

contractsRouter.get('/:id', checkParamId.default, getContractById);

contractsRouter.post('/', checkContractPostPayload.default, createContract);

contractsRouter.put(
    '/:contractId/sign',
    checkJWT.default,
    checkContractPayload.checkParamContractIdAndBodyReqId,
    signContract
);

contractsRouter.delete(
    '/:contractId/revoke',
    checkContractPayload.checkParamContractIdAndBodyReqId,
    revokeContract
);
