import request from "supertest";
// @ts-ignore
import app from '../../src';

describe("User routes", () => {
    test("Get all users", async () => {
        const res = await request(app).get("/ping");
        expect(res.body).toEqual({"message": "pong"});
    });
});