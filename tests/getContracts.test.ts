import { Request, Response } from 'express';
import { getContracts } from '../src/controllers';
import {
    connectDBForTesting,
    disconnectDBForTesting,
    createContract,
    createParticipant,
} from './utils/setup';
import { mockResponse } from './utils/mock';
import { Contract, Participant } from '../src/schemas/schemas';

beforeAll(async () => {
    await connectDBForTesting();
});

afterAll(() => disconnectDBForTesting());

describe('getContracts', () => {
    test('expect to return all contracts', async () => {
        const partA = await createParticipant('partA');
        const partB = await createParticipant('partB');
        const contract = await createContract(
            partA!._id.toString(),
            partB!._id.toString()
        );
        const req: Partial<Request> = {
            query: {},
        };
        const res = mockResponse();
        await getContracts(req as Request, res as Response);
        expect(res.json).toHaveBeenCalledWith([contract]);
        expect(res.status).toHaveBeenCalledWith(200);
        await Participant.deleteMany();
        await Contract.deleteMany();
    });
    test('expect to return contracts depending on filter', async () => {
        const partA = await createParticipant('partA');
        const partB = await createParticipant('partB');
        const partC = await createParticipant('partC');
        const contract1 = await createContract(
            partA!._id.toString(),
            partB!._id.toString()
        );
        const contract2 = await createContract(
            partA!._id.toString(),
            partB!._id.toString(),
            'signed',
            // Jan 1st 2023
            new Date(2023, 0, 1).toISOString()
        );
        const contract3 = await createContract(
            partA!._id.toString(),
            partC!._id.toString(),
            'pending',
            // Jan 1st 2025
            new Date(2025, 0, 1).toISOString()
        );

        const req: Partial<Request> = {
            query: {
                status: 'pending',
                creation: new Date(2022, 0, 1).toISOString(),
                participantId: partB!._id.toString(),
            },
        };
        const res = mockResponse();
        await getContracts(req as Request, res as Response);
        expect(res.json).toHaveBeenCalledWith([contract1]);
        expect(res.status).toHaveBeenCalledWith(200);
        await Participant.deleteMany();
        await Contract.deleteMany();
    });
    test('expect to catch', async () => {
        // empty request to catch
        const req: Partial<Request> = {};
        const res = mockResponse();
        await getContracts(req as Request, res as Response);
        expect(res.end).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
    });
});
