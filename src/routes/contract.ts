import express, { Router } from 'express';
import ContractController from '../controllers/contract';
import { getAllContractValidations } from '../validations/contracts.validations';
import { auth, getUser } from '../middleware/auth';
import { userTokenValidation } from '../validations/users.validation';
import { errorResponse } from '../responses/error.responses';
import {
    deleteContractResponse, getAllContractResponse,
    getContractByIdResponse, newContractResponse,
    updateContractResponse,
} from '../responses/contracts.responses';
import { successResponse } from '../responses/success.responses';

const contractRouter: Router = express.Router();

contractRouter.route('/contracts')
    .get(async (_req, res): Promise<any> => {
        const options: getAllContractValidations = _req.query;
        const controller: ContractController = new ContractController();
        const response: getAllContractResponse = await controller.getAllContract(options);
        return res.send(successResponse(response));
    })
    .post(async (_req, res): Promise<any> => {
        const controller: ContractController = new ContractController();
        const contract = { ..._req.body }
        const response: newContractResponse = await controller.newContract(contract);
        if (!response.data) {
            return res.status(404).json(errorResponse('Consumer or Provider not found'));
        }
        return res.send(successResponse(response));
    })

contractRouter.route('/contracts/:id')
    .get(async (_req, res): Promise<any> => {
        const controller: ContractController = new ContractController();
        const response: getContractByIdResponse = await controller.getContractById(_req.params.id);
        if (!response.data) {
            return res.status(404).json(errorResponse('Contract not found'));
        }
        return res.send(successResponse(response));
    })
    .put(auth, async (_req, res): Promise<any> => {
        const controller: ContractController = new ContractController();
        const user: userTokenValidation = await getUser(_req, res) as userTokenValidation;
        const response: updateContractResponse = await controller.updateContract(_req.params.id, user);
        if (!response.data) {
            return res.status(404).json(errorResponse('Contract not found'));
        }
        return res.send(successResponse(response));
    })
    .delete(async (_req, res): Promise<any> => {
        const controller: ContractController = new ContractController();
        const response: deleteContractResponse = await controller.deleteContract(_req.params.id);
        if (!response.data) {
            return res.status(404).json(errorResponse('Contract not found'));
        }
        return res.send(successResponse(response));
    });


export default contractRouter;
