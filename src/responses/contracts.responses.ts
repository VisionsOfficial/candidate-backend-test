import { IContract } from '../models/contract';

interface getAllContractResponse {
    total: number;
    data: IContract[];
}

interface getContractByIdResponse {
    data: IContract | null;
}

interface newContractResponse {
    data: IContract;
}

interface updateContractResponse {
    data: IContract | null;
}

interface deleteContractResponse {
    data: IContract | null;
}

export {
    getAllContractResponse,
    getContractByIdResponse,
    newContractResponse,
    updateContractResponse,
    deleteContractResponse,
}