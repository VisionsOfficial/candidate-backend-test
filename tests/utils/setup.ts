import mongoose from 'mongoose';
import { Contract, Participant } from '../../src/schemas/schemas';
import { Condition } from '../../src/interface/interfaces';

const { DATABASE_URL_TEST } = process.env;

export async function connectDBForTesting() {
    try {
        const dbUri = 'mongodb://127.0.0.1:27017/test';
        await mongoose.connect(dbUri, {
            autoCreate: true,
        });
    } catch (error) {
        console.error('DB connect error');
    }
}

export async function disconnectDBForTesting() {
    try {
        await mongoose.connection.db.dropDatabase({
            dbName: 'test',
        });
        await mongoose.connection.close();
    } catch (error) {
        console.error('DB disconnect error');
    }
}

export async function createParticipant(name: string) {
    const prt = await new Participant({
        name,
    }).save();
    return await Participant.findById(prt._id);
}

export async function createTestContract(args: {
    providerId: string;
    consumerId: string;
    status?: string;
    creation?: string;
    providerSign?: boolean;
    consumerSign?: boolean;
}) {
    let options = {
        conditions: [] as Condition[],
        consumerId: args.consumerId,
        providerId: args.providerId,
        target: 'test-target',
    };
    if (args.status) {
        Object.assign(options, { status: args.status });
    }
    if (args.creation) {
        Object.assign(options, { creation: args.creation });
    }
    if (args.providerSign) {
        Object.assign(options, { providerSignature: args.providerSign });
    }
    if (args.consumerSign) {
        Object.assign(options, { consumerSignature: args.consumerSign });
    }
    if (args.creation) {
        Object.assign(options, { creation: args.creation });
    }
    const contract = await new Contract(options).save();
    return await Contract.findById(contract._id);
}
