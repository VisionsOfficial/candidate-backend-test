import { Schema, model } from 'mongoose';

export const condition = model(
    'condition',
    new Schema({
        '@context': Schema.Types.String,
        '@type': Schema.Types.String,
        permission: {
            action: Schema.Types.String,
            target: Schema.Types.String,
            constraint: [
                {
                    leftOperand: Schema.Types.String,
                    operator: Schema.Types.String,
                    rightOperand: {
                        '@value': Schema.Types.String,
                        '@type': Schema.Types.String,
                    },
                },
                {
                    leftOperand: Schema.Types.String,
                    operator: Schema.Types.String,
                    rightOperand: {
                        '@value': Schema.Types.String,
                        '@type': Schema.Types.String,
                    },
                },
            ],
        },
    })
);

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
        conditions: [Schema.Types.Mixed],
        creation: { type: Schema.Types.Date, default: Date.now() },
        update: { type: Schema.Types.Date, default: Date.now() },
    })
);

export const Participant = model(
    'participant',
    new Schema({
        fullname: String,
        contracts: [
            {
                ref: Contract,
                type: Schema.Types.Mixed,
            },
        ],
    })
);
