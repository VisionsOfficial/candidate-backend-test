import mongoose from 'mongoose';
import { Contract, Participant } from '../../src/schemas/schemas';
import { Condition } from '../../src/interface/interfaces';
import { config } from 'dotenv';
config();

const { DATABASE_URL_TEST } = process.env;

export async function connectDBForTesting() {
    try {
        const dbUri = DATABASE_URL_TEST || 'mongodb://127.0.0.1:27017/test';
        await mongoose.connect(dbUri, {
            autoCreate: true,
        });
    } catch (error) {
        console.error('DB connect error');
    }
}

export async function disconnectDBForTesting() {
    try {
        await mongoose.connection.db.dropDatabase();
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

export async function createContract(
    providerId: string,
    consumerId: string,
    status?: string,
    creation?: string
) {
    let options = {
        conditions: [] as Condition[],
        consumerId,
        providerId,
        target: 'test-target',
    };
    if (status) {
        Object.assign(options, { status });
    }
    if (creation) {
        Object.assign(options, { creation });
    }
    const contract = await new Contract(options).save();
    return await Contract.findById(contract._id);
}
