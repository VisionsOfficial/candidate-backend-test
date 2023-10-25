import { Body, Delete, Get, Post, Put, Route } from 'tsoa';
import { Contract, IContract } from '../models/contract';
import { ContractEnum } from '../enum/contract.enum';

interface getAllContractResponse {
    contracts: IContract[];
}

interface getContractByIdResponse {
    contract: IContract | null;
}

interface newContractResponse {
    contract: IContract;
}

interface updateContractResponse {
    contract: IContract | null;
}

interface deleteContractResponse {
    contract: IContract | null;
}

@Route("contracts")
export default class ContractController {
    @Get("/")
    public async getAllContract(): Promise<getAllContractResponse> {
        const contracts = await Contract.find();
        return {
            contracts,
        };
    }

    @Get("/:id")
    public async getContractById(id: string): Promise<getContractByIdResponse> {
        const contract = await Contract.findById(id);
        return {
            contract: contract,
        };
    }

    @Post("/")
    public async newContract(@Body() contract: IContract): Promise<newContractResponse> {
        const newContract = await Contract.create(contract);
        return {
            contract: newContract,
        };
    }

    @Put("/:id")
    public async updateContract(id: string): Promise<updateContractResponse> {
        let contractToUpdate = await Contract.findById(id);
        if(contractToUpdate){
            contractToUpdate.status = ContractEnum.SIGNED;
            contractToUpdate = await Contract.findByIdAndUpdate(id, contractToUpdate);

        }
        return {
            contract: contractToUpdate,
        };
    }

    @Delete("/:id")
    public async deleteContract(id: string): Promise<deleteContractResponse> {
        let contract = await Contract.findById(id);
        if(contract){
            contract.status = ContractEnum.REVOKED;
            contract = await Contract.findByIdAndUpdate(id, contract);

        }

        return {
            contract: contract,
        };
    }
}

