import { Body, Delete, Example, Get, Post, Put, Queries, Path, Route, Tags, Security } from 'tsoa';
import { Contract, IContractCreate } from '../models/contract';
import { ContractStatusEnum } from '../enum/contract.enum';
import {
    deleteContractResponse,
    getAllContractResponse,
    getContractByIdResponse,
    newContractResponse,
    updateContractResponse,
} from '../responses/contracts.responses';
import { getAllContractValidations } from '../validations/contracts.validations';
import Logger from '../logger';
import { userTokenValidation } from '../validations/users.validation';
import { User } from '../models/users';

// Allow to change the options given by the user in more advanced and complex filters for mongoose
const getAllContractFilter = (options: getAllContractValidations) => {
    const filter: any = {
    };

    // retrieve all the contract created before the createdAt given
    if(options.createdAt){
        filter.createdAt = {
            $lte: options.createdAt
        }
    }

    // retrieve all the contract updated before the createdAt given
    if(options.updatedAt){
        filter.updatedAt = {
            $lte: options.updatedAt
        }
    }

    if(options.dataProvider){
        filter.dataProvider = options.dataProvider
    }

    if(options.dataConsumer){
        filter.dataConsumer = options.dataConsumer
    }

    if(options.status){
        filter.status = options.status
    }

    return filter;
}

@Route("contracts")
@Tags("Contracts")
export default class ContractController {
    @Get("/")
    public async getAllContract(@Queries() options?: getAllContractValidations): Promise<getAllContractResponse> {
        try{
            if(options) options = getAllContractFilter(options);
            const contracts = await Contract.find({ ...options });
            return {
                total: contracts.length,
                data: contracts,
            };
        } catch(err){
            Logger.error(err)
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
            Logger.error(err);
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
            // check if consumer and provider exists
            const consumer = await User.findById(contract.dataConsumer);
            const provider = await User.findById(contract.dataProvider);

            if(!consumer || !provider){
                return {
                    data: null,
                };
            }

            const contractData = {
                status: ContractStatusEnum.PENDING,
                createdAt: Date(),
                dataProviderSignature: false,
                dataConsumerSignature: false,
                ...contract
            };

            const newContract = await Contract.create(contractData);
            return {
                data: newContract,
            };
        } catch(err){
            Logger.error(err);
            throw err;
        }
    }

    @Security("Authorization")
    @Put("/:id")
    public async updateContract(
        @Path() id: string,
        @Body() userToken: userTokenValidation
    ): Promise<updateContractResponse> {
        try{
            // find the contract
            let contractToUpdate = await Contract.findById(id);

            if(contractToUpdate){
                //find the user who made the request
                const user = await User.findById(userToken._id)

                if(!user){
                    throw new Error("User doesn't exist")
                }

                //if is provider
                if(contractToUpdate.dataProvider === user._id.toString()) {
                    contractToUpdate.dataProviderSignature = true;
                }

                //if is consumer
                if(contractToUpdate.dataConsumer === user._id.toString()) {
                    contractToUpdate.dataConsumerSignature = true;
                }

                //if provider and consumer have signed change status of contract
                if(contractToUpdate.dataConsumerSignature && contractToUpdate.dataProviderSignature){
                    contractToUpdate.status = ContractStatusEnum.SIGNED;
                }

                contractToUpdate.updatedAt = new Date();

                await Contract.findByIdAndUpdate(id, contractToUpdate);
            } else {
                return {
                    data: null,
                };
            }

            const contract = await Contract.findById(id);
            return {
                data: contract,
            };
        } catch(err){
            Logger.error(err);
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
            } else {
                return {
                    data: null,
                };
            }

            const contract = await Contract.findById(id);
            return {
                data: contract,
            };
        } catch(err){
            Logger.error(err);
            throw err;
        }
    }
}

