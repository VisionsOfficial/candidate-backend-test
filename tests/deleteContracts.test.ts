import { Request, Response } from 'express';
import { revokeContract } from '../src/controllers';
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

describe('revokeContract', () => {
    test('Should not find contract', async () => {
        const req: Partial<Request> = {
            params: {
                contractId: new Types.ObjectId().toString(),
            },
        };
        const res = mockResponse();
        await revokeContract(req as Request, res as Response);
        expect(res.json).toHaveBeenCalledWith('Contract not found');
        expect(res.status).toHaveBeenCalledWith(404);
    });
    test('Should return "contract already revoked"', async () => {
        const partA = await createParticipant('partA');
        const partB = await createParticipant('partB');
        const contract = await createTestContract({
            providerId: partA!._id.toString(),
            consumerId: partB!._id.toString(),
            status: 'revoked',
        });
        const req: Partial<Request> = {
            params: {
                contractId: contract!._id.toString(),
            },
        };
        const res = mockResponse();
        await revokeContract(req as Request, res as Response);
        expect(res.json).toHaveBeenCalledWith('Contract already revoked');
        expect(res.status).toHaveBeenCalledWith(400);
    });
    test('Should fail cause participant requester is not part of the contract', async () => {
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
        await revokeContract(req as Request, res as Response);
        expect(res.json).toHaveBeenCalledWith(
            'Participant id not part of the contract'
        );
        expect(res.status).toHaveBeenCalledWith(401);
    });
    test('Should revoke', async () => {
        const partA = await createParticipant('partA');
        const partB = await createParticipant('partB');
        const contract = await createTestContract({
            providerId: partA!._id.toString(),
            consumerId: partB!._id.toString(),
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
        await revokeContract(req as Request, res as Response);
        expect(res.json).toHaveBeenCalledWith(
            `contract ${contract!._id.toString()} is revoked`
        );
        expect(res.status).toHaveBeenCalledWith(200);
    });
    test('Should catch', async () => {
        const req: Partial<Request> = {};
        const res = mockResponse();
        await revokeContract(req as Request, res as Response);
        expect(res.json).toHaveBeenCalledWith('Bad request');
        expect(res.status).toHaveBeenCalledWith(400);
    });
});
