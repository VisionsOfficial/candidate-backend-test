import { Schema, model } from 'mongoose';

export const Contract = model(
    'contract',
    new Schema({
        providerId: Schema.Types.ObjectId,
        consumerId: Schema.Types.ObjectId,
        providerSignature: { type: Schema.Types.Boolean, default: false },
        consumerSignature: { type: Schema.Types.Boolean, default: false },
        target: Schema.Types.String,
        status: {
            type: Schema.Types.String,
            default: 'pending',
        },
        conditions: Schema.Types.Mixed,
        creation: { type: Schema.Types.Date, default: Date.now() },
        update: { type: Schema.Types.Date, default: Date.now() },
    })
);

export const Participant = model(
    'participant',
    new Schema({
        name: String,
    })
);
