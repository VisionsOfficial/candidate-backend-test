import { Schema, model, Document } from 'mongoose';
import { ContractEnum } from '../enum/contract.enum';


interface IContract extends Document{
    dataProvider: string;
    dataConsumer: string;
    dataProviderSignature: string;
    dataConsumerSignature: string;
    termsAndConditions?: string[];
    target: string;
    status: ContractEnum;
    createdAt: Date;
    updatedAt: Date;
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
        type: String,
        required: true
    },
    dataConsumerSignature: {
        type: String,
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
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    updatedAt: {
        type: Date,
        required: true
    },
})

const Contract = model('Contract', contractSchema);
export  { Contract, IContract };