import { ContractStatusEnum } from '../enum/contract.enum';

export interface getAllContractValidations {
    provider?: string;
    consumer?: string;
    status?: ContractStatusEnum;
    createdAt?: Date;
}