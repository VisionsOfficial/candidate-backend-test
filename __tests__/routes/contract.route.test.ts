import request from "supertest";
// @ts-ignore
import app from '../../src';
import { ContractStatusEnum } from '../../src/enum/contract.enum';
import mongoose from 'mongoose';
import Logger from '../../src/logger';
import { SeedDb } from '../../src/seed';
import { loginResponse } from '../../src/responses/user.responses';

describe("Contracts routes integration testing", () => {

    mongoose.connect(`mongodb://localhost:27017/tests`, {
    }).then(
        async r => {
            Logger.info('Test DB Connected ');

            // DATA SEED
            await SeedDb();
        },
        error => Logger.error("Failed to connect to test DB", error)
    );

    test("Get all contracts", async () => {
        const res = await request(app).get("/contracts");
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("success");
        expect(res.body.content.total).toBeGreaterThan(0);
        expect(res.body.content.data.length).toBeGreaterThan(0);
    });

    test("Get one contracts by id", async () => {
        const res = await request(app).get("/contracts/653ada47b6de3307df0f560b");
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("success");
        expect(res.body.content.data._id).toBe("653ada47b6de3307df0f560b")
    });

    test("Create a new contract", async () => {
        const res = await request(app).post("/contracts")
            .send({
                dataConsumer: "653ab2966484ef549fa00700",
                dataProvider: "653a4f1d421a5f6dfe69c2b1",
                target: "http://company.com/dataset/1",
                termsAndConditions: [
                ]
            });
        expect(res.status).toBe(201);
        expect(res.body.status).toBe("success");
        expect(res.body.content.data._id.toString()).toBeDefined();
    });

    test("Sign a contract", async () => {
        const auth: any = await request(app).post("/login").send({
            "email": "john@doe.fr",
            "password": "00000000"
        })
        const res  = await request(app).put("/contracts/653ada47b6de3307df0f560b")
            .set('Authorization', `Bearer ${auth.body.content.data.token}`);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("success")
        expect(res.body.content.data.dataProviderSignature).toBe(true)
    });

    test("Sign a contract error, not authenticate", async () => {
        const res = await request(app).put("/contracts/653ada47b6de3307df0f560b");
        expect(res.status).toBe(401);
        expect(res.body.status).toBe("error")
        expect(res.body.message).toBe("Please authenticate")
    });

    test("Revoke a contract", async () => {
        const res = await request(app).delete("/contracts/653ada47b6de3307df0f560b");
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("success");
        expect(res.body.content.data._id).toBe("653ada47b6de3307df0f560b")
        expect(res.body.content.data.status).toBe(ContractStatusEnum.REVOKED)
    });
});