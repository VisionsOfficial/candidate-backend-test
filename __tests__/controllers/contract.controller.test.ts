import request from "supertest";
// @ts-ignore
import app from '../../src';

describe("Contracts routes", () => {
    test("Get all contracts", async () => {
        const res = await request(app).get("/contracts");
        expect(res.body).toEqual({"message": "pong"});
    });
});