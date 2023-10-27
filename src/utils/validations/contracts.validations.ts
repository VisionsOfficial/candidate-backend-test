import { ContractStatusEnum } from '../enums/contract.enum';
import { ODLR } from '../../models/contract';

export interface getAllContractValidations {
    dataProvider?: string;
    dataConsumer?: string;
    status?: ContractStatusEnum;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface newContractValidation{
    dataProvider: string;
    dataConsumer: string;
    termsAndConditions?: ODLR[];
    target: string;
}