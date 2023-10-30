import { Request, Response } from 'express';
import { createContract } from '../src/controllers';
import { Condition } from '../src/interface/interfaces';
import {
    connectDBForTesting,
    disconnectDBForTesting,
    createParticipant,
} from './utils/setup';
import { mockResponse } from './utils/mock';
import { Contract, Participant } from '../src/schemas/schemas';
import { Types } from 'mongoose';

beforeAll(async () => {
    await connectDBForTesting();
});

afterEach(async () => {
    await Participant.deleteMany();
    await Contract.deleteMany();
});

afterAll(async () => {
    await disconnectDBForTesting();
});

describe('POST createContract', () => {
    test('Should create a contract', async () => {
        const partA = await createParticipant('partA');
        const partB = await createParticipant('partB');
        const req: Partial<Request> = {
            query: {},
            body: {
                consumerId: partA!._id.toString(),
                providerId: partB!._id.toString(),
                conditions: [] as Condition[],
                target: 'test',
            },
        };
        const res = mockResponse();
        await createContract(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(201);
    });
    test('Should fail because one part is missing', async () => {
        const partA = await createParticipant('partA');
        const req: Partial<Request> = {
            query: {},
            body: {
                consumerId: partA!._id.toString(),
                providerId: new Types.ObjectId().toString(),
                conditions: [] as Condition[],
                target: 'test',
            },
        };
        const res = mockResponse();
        await createContract(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(
            'Missing one part or more to create a contract.'
        );
    });
    test('Should catch', async () => {
        const req: Partial<Request> = {};
        const res = mockResponse();
        await createContract(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith('Bad request');
    });
});
