import request from "supertest";
// @ts-ignore
import app from '../../src';
import { ContractStatusEnum } from '../../src/enum/contract.enum';
import ContractController from '../../src/controllers/contract';
import {
    deleteContractResponse,
    getAllContractResponse,
    getContractByIdResponse,
    newContractResponse, updateContractResponse,
} from '../../src/responses/contracts.responses';
import mongoose from 'mongoose';
import Logger from '../../src/logger';
import { SeedDb } from '../../src/seed';

describe("Contracts Controller unit testing", () => {

    mongoose.connect(`mongodb://localhost:27017/tests`, {
    }).then(
        async r => {
            Logger.info('Test DB Connected ');

            // DATA SEED
            await SeedDb();
        },
        error => Logger.error("Failed to connect to test DB", error)
    );

    test("getAllContract with no options", async () => {
        const controller: ContractController = new ContractController();
        const options = {};
        const res: getAllContractResponse = await controller.getAllContract(options);
        expect(res.total).toBeGreaterThan(0);
        expect(res.data.length).toBeGreaterThan(0);
    });

    test("getAllContract with not found provider", async () => {
        const controller: ContractController = new ContractController();
        const options = {
            dataProvider: "1"
        };
        const res: getAllContractResponse = await controller.getAllContract(options);
        expect(res.total).toBe(0);
        expect(res.data.length).toBe(0);
    });

    test("getContractById", async () => {
        const controller: ContractController = new ContractController();
        const res: getContractByIdResponse = await controller.getContractById("653ada47b6de3307df0f560b");
        expect(res?.data?._id.toString()).toBe("653ada47b6de3307df0f560b");
    });

    test("getContractById is null", async () => {
        const controller: ContractController = new ContractController();
        const res: getContractByIdResponse = await controller.getContractById("653ada47b6de3307df0f560a");
        expect(res?.data).toBe(null);
    });

    test("newContract", async () => {
        const controller: ContractController = new ContractController();
        const res: newContractResponse = await controller.newContract({
            "dataConsumer": "653ab2966484ef549fa00700",
            "dataProvider": "653a4f1d421a5f6dfe69c2b1",
            "target": "http://company.com/dataset/1",
            "termsAndConditions": [
            ]
        });
        expect(res?.data?._id.toString()).toBeDefined();
    });

    test("newContract Provider not found", async () => {
        const controller: ContractController = new ContractController();
        const res: newContractResponse = await controller.newContract({
            "dataConsumer": "653ab2966484ef549fa00700",
            "dataProvider": "653a4f1d421a5f6dfe69c2b2",
            "target": "http://company.com/dataset/1",
            "termsAndConditions": [
            ]
        });
        expect(res?.data).toBe(null);
    });

    test("newContract Consumer not found", async () => {
        const controller: ContractController = new ContractController();
        const res: newContractResponse = await controller.newContract({
            "dataConsumer": "653ab2966484ef549fa00701",
            "dataProvider": "653a4f1d421a5f6dfe69c2b1",
            "target": "http://company.com/dataset/1",
            "termsAndConditions": [
            ]
        });
        expect(res?.data).toBe(null);
    });

    test("updateContract", async () => {
        const controller: ContractController = new ContractController();
        const res: updateContractResponse = await controller.updateContract('653ada47b6de3307df0f45b2', {
            _id: "653a4f1d421a5f6dfe69c2b1",
            email: "john@doe.fr"
        })
        expect(res?.data?._id.toString()).toBe("653ada47b6de3307df0f45b2");
        expect(res?.data?.dataProviderSignature).toBe(true);
    });

    test("updateContract contract not found", async () => {
        const controller: ContractController = new ContractController();
        const res: updateContractResponse = await controller.updateContract('653ada47b6de3307df0f45b1', {
            _id: "653a4f1d421a5f6dfe69c2b1",
            email: "john@doe.fr"
        })
        expect(res?.data).toBe(null);
    });

    test("updateContract user error", async () => {
        const controller: ContractController = new ContractController();
        const res: () => Promise<void> = async () => {
            await controller.updateContract('653ada47b6de3307df0f45b2', {
                _id: '653a4f1d421a5f6dfe69c2b2',
                email: 'john@doe.fr',
            });
        }
        await expect(res).rejects.toThrowError("User doesn't exist");
    });

    test("deleteContract", async () => {
        const controller: ContractController = new ContractController();
        const res: deleteContractResponse = await controller.deleteContract("653ada47b6de3307df0f45b2");
        expect(res?.data?._id.toString()).toBe("653ada47b6de3307df0f45b2");
        expect(res?.data?.status).toBe(ContractStatusEnum.REVOKED);
    });

    test("deleteContract not found", async () => {
        const controller: ContractController = new ContractController();
        const res: deleteContractResponse = await controller.deleteContract("653ada47b6de3307df0f45b5");
        expect(res?.data).toBe(null);
    });
});