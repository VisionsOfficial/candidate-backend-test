import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { getContracts, getContractById } from '../src/controllers';
import {
    connectDBForTesting,
    disconnectDBForTesting,
    createTestContract,
    createParticipant,
} from './utils/setup';
import { mockResponse } from './utils/mock';
import { Contract, Participant } from '../src/schemas/schemas';

beforeAll(async () => {
    await connectDBForTesting();
});

afterEach(async () => {
    await Participant.deleteMany();
    await Contract.deleteMany();
});

afterAll(() => disconnectDBForTesting());

describe('getContracts', () => {
    test('expect to return all contracts', async () => {
        const partA = await createParticipant('partA');
        const partB = await createParticipant('partB');
        const contract = await createTestContract({
            providerId: partA!._id.toString(),
            consumerId: partB!._id.toString(),
        });
        const req: Partial<Request> = {
            query: {},
        };
        const res = mockResponse();
        await getContracts(req as Request, res as Response);
        expect(res.json).toHaveBeenCalledWith([contract]);
        expect(res.status).toHaveBeenCalledWith(200);
    });
    test('expect to return contracts depending on filter', async () => {
        const partA = await createParticipant('partA');
        const partB = await createParticipant('partB');
        const partC = await createParticipant('partC');
        const contract1 = await createTestContract({
            providerId: partA!._id.toString(),
            consumerId: partB!._id.toString(),
        });
        const contract2 = await createTestContract({
            providerId: partA!._id.toString(),
            consumerId: partB!._id.toString(),
            status: 'signed',
            // Jan 1st 2023
            creation: new Date(2023, 0, 1).toISOString(),
        });
        const contract3 = await createTestContract({
            providerId: partA!._id.toString(),
            consumerId: partC!._id.toString(),
            status: 'pending',
            // Jan 1st 2025
            creation: new Date(2025, 0, 1).toISOString(),
        });

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

describe('getContractById', () => {
    test('Should return the requested contract', async () => {
        const partA = await createParticipant('partA');
        const contract = await createTestContract({
            providerId: partA!._id.toString(),
            consumerId: partA!._id.toString(),
        });
        const req: Partial<Request> = {
            params: {
                id: contract!._id.toString(),
            },
        };
        const res = mockResponse();
        await getContractById(req as Request, res as Response);
        expect(res.json).toHaveBeenCalledWith(contract);
        expect(res.status).toHaveBeenCalledWith(200);
    });
    test('Should not find contract', async () => {
        const req: Partial<Request> = {
            params: {
                id: new Types.ObjectId().toString(),
            },
        };
        const res = mockResponse();
        await getContractById(req as Request, res as Response);
        expect(res.json).toHaveBeenCalledWith('Contract not found');
        expect(res.status).toHaveBeenCalledWith(404);
    });
    test('Should catch', async () => {
        const req: Partial<Request> = {};
        const res = mockResponse();
        await getContractById(req as Request, res as Response);
        expect(res.json).toHaveBeenCalledWith('Bad request');
        expect(res.status).toHaveBeenCalledWith(400);
    });
});
