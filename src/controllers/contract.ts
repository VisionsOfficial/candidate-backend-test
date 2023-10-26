import { Body, Delete, Get, Post, Put, Queries, Query, Route, Tags } from 'tsoa';
import { Contract, IContract, IContractUpdate } from '../models/contract';
import { ContractStatusEnum } from '../enum/contract.enum';
import {
    deleteContractResponse,
    getAllContractResponse,
    getContractByIdResponse,
    newContractResponse,
    updateContractResponse,
} from '../responses/contracts.responses';
import { getAllContractValidations } from '../validations/contracts.validations';

const getAllContractFilter = (options: getAllContractValidations) => {
    return options;
}

@Route("contracts")
@Tags("Contracts")
export default class ContractController {
    @Get("/")
    public async getAllContract(@Queries() options?: getAllContractValidations): Promise<getAllContractResponse> {
        console.log("OPTIONS", options)
        if(options) getAllContractFilter(options);
        const contracts = await Contract.find({ ...options });
        return {
            data: contracts,
        };
    }

    @Get("/:id")
    public async getContractById(@Query() id: string): Promise<getContractByIdResponse> {
        const contract = await Contract.findById(id);
        return {
            data: contract,
        };
    }

    @Post("/")
    public async newContract(@Body() contract: IContract): Promise<newContractResponse> {
        contract.status = ContractStatusEnum.PENDING;
        contract.createdAt = new Date();
        contract.dataProviderSignature = false;
        contract.dataConsumerSignature = false;
        const newContract = await Contract.create(contract);
        return {
            data: newContract,
        };
    }

    @Put("/:id")
    public async updateContract(@Query() id: string, @Body() contractUpdate: IContractUpdate): Promise<updateContractResponse> {
        let contractToUpdate = await Contract.findById(id);
        if(contractToUpdate){
            if(contractUpdate.dataConsumerSignature && contractUpdate.dataProviderSignature){
                contractToUpdate.status = ContractStatusEnum.SIGNED;
            }
            contractToUpdate.dataProviderSignature = contractUpdate.dataProviderSignature;
            contractToUpdate.dataConsumerSignature = contractUpdate.dataConsumerSignature;

            contractToUpdate.updatedAt = new Date();
            await Contract.findByIdAndUpdate(id, contractToUpdate);
        }

        const contract = await Contract.findById(id);
        return {
            data: contract,
        };
    }

    @Delete("/:id")
    public async deleteContract(@Query() id: string): Promise<deleteContractResponse> {
        let contractToDelete = await Contract.findById(id);
        if(contractToDelete){
            contractToDelete.status = ContractStatusEnum.REVOKED;
            contractToDelete.updatedAt = new Date();
            await Contract.findByIdAndUpdate(id, contractToDelete);
        }

        const contract = await Contract.findById(id);
        return {
            data: contract,
        };
    }
}

