import { Schema, model } from 'mongoose';

export const contract = model(
    'Contract',
    new Schema({
        providerId: Schema.Types.ObjectId,
        consumerId: Schema.Types.ObjectId,
        providerSignature: Schema.Types.Boolean,
        consumerSignature: Schema.Types.Boolean,
        target: Schema.Types.String,
        status: {
            type: Schema.Types.String,
            default: 'pending',
        },
        creation: Schema.Types.Date,
        update: Schema.Types.Date,
    })
);

export const participant = model(
    'Participant',
    new Schema({
        fullname: String,
        contracts: {
            ref: contract,
            type: Schema.ObjectId,
        },
    })
);
