import { Request, Response } from 'express';
import { signContract } from '../src/controllers';
import {
    connectDBForTesting,
    disconnectDBForTesting,
    createParticipant,
    createTestContract,
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

afterAll(() => disconnectDBForTesting());

describe('signContract', () => {
    test('Should not find contract', async () => {
        const req: Partial<Request> = {
            params: {
                contractId: new Types.ObjectId().toString(),
            },
        };
        const res = mockResponse();
        await signContract(req as Request, res as Response);
        expect(res.json).toHaveBeenCalledWith('Contract not found');
        expect(res.status).toHaveBeenCalledWith(404);
    });
    test('Should not be updatable because signe or revoked', async () => {
        const partA = await createParticipant('partA');
        const partB = await createParticipant('partB');
        const contract = await createTestContract({
            providerId: partA!._id.toString(),
            consumerId: partB!._id.toString(),
            status: 'signed',
        });
        const req: Partial<Request> = {
            params: {
                contractId: contract!._id.toString(),
            },
        };
        const res = mockResponse();
        await signContract(req as Request, res as Response);
        expect(res.json).toHaveBeenCalledWith(
            `Contract can't be modified. Status: ${contract!.status}`
        );
        expect(res.status).toHaveBeenCalledWith(400);
    });
    test('Should return 401 because requester participant is not part of the contract', async () => {
        const partA = await createParticipant('partA');
        const partB = await createParticipant('partB');
        const partC = await createParticipant('partC');
        const contract = await createTestContract({
            providerId: partA!._id.toString(),
            consumerId: partB!._id.toString(),
        });
        const req: Partial<Request> = {
            params: {
                contractId: contract!._id.toString(),
            },
            body: {
                requesterId: partC!._id.toString(),
            },
        };
        const res = mockResponse();
        await signContract(req as Request, res as Response);
        expect(res.json).toHaveBeenCalledWith(
            'Participant is not part of the contract'
        );
        expect(res.status).toHaveBeenCalledWith(401);
    });
    test('Should sign a contract (provider sign)', async () => {
        const partA = await createParticipant('partA');
        const partB = await createParticipant('partB');
        const contract = await createTestContract({
            providerId: partA!._id.toString(),
            consumerId: partB!._id.toString(),
            consumerSign: true,
        });
        const req: Partial<Request> = {
            params: {
                contractId: contract!._id.toString(),
            },
            body: {
                requesterId: partA!._id.toString(),
            },
        };
        const res = mockResponse();
        await signContract(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(200);
    });
    test('Should sign a contract (consumer sign)', async () => {
        const partA = await createParticipant('partA');
        const partB = await createParticipant('partB');
        const contract = await createTestContract({
            providerId: partA!._id.toString(),
            consumerId: partB!._id.toString(),
            providerSign: true,
        });
        const req: Partial<Request> = {
            params: {
                contractId: contract!._id.toString(),
            },
            body: {
                requesterId: partB!._id.toString(),
            },
        };
        const res = mockResponse();
        await signContract(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(200);
    });
    test('Should catch', async () => {
        const req: Partial<Request> = {};
        const res = mockResponse();
        await signContract(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith('Bad request');
    });
});
