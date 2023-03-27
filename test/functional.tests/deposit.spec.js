import { describe, expect, it } from '@jest/globals';
import request from "supertest";
import app from "../../src/index.js";
import getMockUser from "../stubs/user.js";
import * as userService from "../../src/services/user.service.js"
import db from '../../src/database/models/index.js'

const depositUrl = "/api/v1/transactions/deposit";

describe("Deposit Feature", () => {
  let newBuyer, newSeller;
  beforeAll(async () => {
    // reset the db
    await db.connection.sync({ force: true });

    const buyerStub = getMockUser("buyer");
    newBuyer = await userService.createAUser(buyerStub);

    const sellerStub = getMockUser("seller");
    newSeller = await userService.createAUser(sellerStub);
  })

  it("should run successfully with the right details.", async () => {
    const amount = 100;
    const response = await request(app)
      .post(depositUrl)
      .send({ amount })
      .set("authorization", `Bearer ${newBuyer.accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.message).toBe("Amount deposited successfully.");

    const savedUser = await userService.getOneUser(newBuyer.user.id, true);
    expect(savedUser.deposit).toBe(amount);

  });

  it("should be protected, responds with 401 error code.", async () => {
    const amount = 100;

    const response = await request(app)
      .post(depositUrl)
      .send({ amount });

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe("error");
    expect(response.body.message).toBe("User not authenticated.");
  });

  it("should only run for buyers, responds with 403 error code.", async () => {
    const amount = 100;

    const response = await request(app)
      .post(depositUrl)
      .send({ amount })
      .set("authorization", `Bearer ${newSeller.accessToken}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.status).toBe("error");
    expect(response.body.message).toBe("Forbidden route. Only a buyer can access this route.");
  });

  it("should only accept amount from these: 5, 10, 20, 50, 100.", async () => {
    const amount = 15;

    const response = await request(app)
      .post(depositUrl)
      .send({ amount })
      .set("authorization", `Bearer ${newBuyer.accessToken}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("error");
    expect(response.body).toMatchObject({
      status: 'error',
      message: 'Validation Error(s)',
      data: { amount: ['amount must be one of these: 100, 50, 20, 10, 5.'] }
    });
  });

  afterAll(async () => {
    await db.connection.close()
  })
});