import { ContractStatusEnum } from '../enum/contract.enum';

export interface getAllContractValidations {
    dataProvider?: string;
    dataConsumer?: string;
    status?: ContractStatusEnum;
    createdAt?: Date;
    updatedAt?: Date;
}