import { Schema, model, Document } from 'mongoose';
import { ContractStatusEnum } from '../enum/contract.enum';


interface IContract extends Document{
    dataProvider: string;
    dataConsumer: string;
    dataProviderSignature?: boolean;
    dataConsumerSignature?: boolean;
    termsAndConditions?: string[];
    target: string;
    status: ContractStatusEnum;
    createdAt?: Date;
    updatedAt?: Date;
}

interface IContractCreate{
    dataProvider: string;
    dataConsumer: string;
    termsAndConditions?: string[];
    target: string;
}

const contractSchema = new Schema<IContract>({
    dataProvider: {
        type: String,
        required: true
    },
    dataConsumer: {
        type: String,
        required: true
    },
    dataProviderSignature: {
        type: Boolean,
        required: true
    },
    dataConsumerSignature: {
        type: Boolean,
        required: true
    },
    termsAndConditions: {
        type: [String],
    },
    target: {
        type: String,
        required: true
    },
    status: {
        type: String,
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
})

const Contract = model('Contract', contractSchema);
export  { Contract, IContract, IContractCreate };