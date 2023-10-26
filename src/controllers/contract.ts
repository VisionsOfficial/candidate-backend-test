import { Body, Delete, Example, Get, Post, Put, Queries, Path, Route, Tags } from 'tsoa';
import { Contract, IContract, IContractCreate, IContractUpdate } from '../models/contract';
import { ContractStatusEnum } from '../enum/contract.enum';
import {
    deleteContractResponse,
    getAllContractResponse,
    getContractByIdResponse,
    newContractResponse,
    updateContractResponse,
} from '../responses/contracts.responses';
import { getAllContractValidations } from '../validations/contracts.validations';
import logger from '../logger';

const getAllContractFilter = (options: getAllContractValidations) => {
    return options;
}

@Route("contracts")
@Tags("Contracts")
export default class ContractController {
    @Get("/")
    public async getAllContract(@Queries() options?: getAllContractValidations): Promise<getAllContractResponse> {
        try{
            if(options) getAllContractFilter(options);
            const contracts = await Contract.find({ ...options });
            return {
                total: contracts.length,
                data: contracts,
            };
        } catch(err){
            logger.error(err)
            throw err;
        }
    }

    @Get("/:id")
    public async getContractById(@Path() id: string): Promise<getContractByIdResponse> {
        try{
            const contract = await Contract.findById(id);
            return {
                data: contract,
            };
        } catch(err){
            logger.error(err);
            throw err;
        }


    }

    @Example<IContractCreate>({
        dataProvider: "A",
        dataConsumer: "B",
        termsAndConditions: [],
        target: "https://company.com/dataset/1",
    })
    @Post("/")
    public async newContract(@Body() contract: IContractCreate): Promise<newContractResponse> {
        try{
            const c = {
                status: ContractStatusEnum.PENDING,
                createdAt: Date(),
                dataProviderSignature: false,
                dataConsumerSignature: false,
            }

            contract = {...c, ...contract};

            const newContract = await Contract.create(contract);
            return {
                data: newContract,
            };
        } catch(err){
            logger.error(err);
            throw err;
        }
    }

    @Put("/:id")
    public async updateContract(@Path() id: string, @Body() contractUpdate: IContractUpdate): Promise<updateContractResponse> {
        try{
            let contractToUpdate = await Contract.findById(id);
            if(contractToUpdate){
                /*
                The status of the contract change only if the consumer and the provider have signed the contract
                 */
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
        } catch(err){
            logger.error(err);
            throw err;
        }
    }

    @Delete("/:id")
    public async deleteContract(@Path() id: string): Promise<deleteContractResponse> {
        try{
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
        } catch(err){
            logger.error(err);
            throw err;
        }
    }
}

