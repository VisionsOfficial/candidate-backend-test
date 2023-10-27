import { Contract } from '../../models/contract';

interface getAllContractResponse {
    total: number;
    data: Contract[];
}

interface getContractByIdResponse {
    data: Contract | null;
}

interface newContractResponse {
    data: Contract | null;
}

interface updateContractResponse {
    data: Contract | null;
}

interface deleteContractResponse {
    data: Contract | null;
}

export {
    getAllContractResponse,
    getContractByIdResponse,
    newContractResponse,
    updateContractResponse,
    deleteContractResponse,
}