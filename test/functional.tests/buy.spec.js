import { describe, expect, it } from '@jest/globals';
import request from "supertest";
import app from "../../src/index.js";
import getMockUser from "../stubs/user.js";
import getMockProduct from "../stubs/product.js";
import * as transactionService from "../../src/services/transaction.service.js"
import * as userService from "../../src/services/user.service.js"
import * as  productService from "../../src/services/product.service.js"
import db from '../../src/database/models/index.js'

const buyUrl = "/api/v1/transactions/buy";

const getFinancedBuyer = async (amount) => {
  const buyerStub = getMockUser("buyer");
  const newBuyer = await userService.createAUser(buyerStub);
  await transactionService.deposit(newBuyer.user.id, amount);

  return newBuyer;
};

const getNewProduct = async (cost = 20, amountAvailable = undefined) => {
  const sellerStub = getMockUser("seller");
  const newSeller = await userService.createAUser(sellerStub);

  const productStub = getMockProduct(cost, amountAvailable);
  return productService.createAProduct(productStub, newSeller.user.id);
};

describe("Buy Feature", () => {
  let buyer, product;
  beforeAll(async () => {
    // reset the db
    await db.connection.sync({ force: true });

    buyer = await getFinancedBuyer(100);
    product = await getNewProduct();
  })

  describe("with the right details", () => {
    it("should respond with success.", async () => {
      const buyPayload = { productId: product.id, quantity: 3 }
      const response = await request(app)
        .post(buyUrl)
        .send(buyPayload)
        .set("authorization", `Bearer ${buyer.accessToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.message).toBe("Purchase done successfully.");
      expect(Object.keys(response.body.data)).toEqual(["totalAmount", "depositLeft", "product"]);
    });

    it("should deduct the amount spent from the buyer's deposit.", async () => {
      const cost = 20;
      const initialDeposit = 100;
      const newProduct = await getNewProduct(cost);
      const newBuyer = await getFinancedBuyer(initialDeposit);

      const buyPayload = { productId: newProduct.id, quantity: 3 }
      await request(app)
        .post(buyUrl)
        .send(buyPayload)
        .set("authorization", `Bearer ${newBuyer.accessToken}`);

      const savedUser = await userService.getOneUser(newBuyer.user.id, true);
      const depositLeft = initialDeposit - (cost * buyPayload.quantity);
      expect(savedUser.deposit).toBe(depositLeft);

    });

    it("should deduct the quantiy spent from the product's amountAvailable.", async () => {
      const cost = 20;
      const initialDeposit = 100;
      const newProduct = await getNewProduct(cost);
      const newBuyer = await getFinancedBuyer(initialDeposit);

      const buyPayload = { productId: newProduct.id, quantity: 3 }
      const response = await request(app)
        .post(buyUrl)
        .send(buyPayload)
        .set("authorization", `Bearer ${newBuyer.accessToken}`);

      expect(response.statusCode).toBe(200);

      const newProductQty = response.body.data.product.amountAvailable;
      const calculatedProductQty = newProduct.amountAvailable - buyPayload.quantity;
      expect(newProductQty).toBe(calculatedProductQty);

    });
  })

  it("should respond with 422 error code if the input quantity is more than the product amountAvailable.", async () => {
    const cost = 20;
    const amountAvailable = 2;
    const initialDeposit = 100;
    const newProduct = await getNewProduct(cost, amountAvailable);
    const newBuyer = await getFinancedBuyer(initialDeposit);

    const buyPayload = { productId: newProduct.id, quantity: 3 }
    const response = await request(app)
      .post(buyUrl)
      .send(buyPayload)
      .set("authorization", `Bearer ${newBuyer.accessToken}`);

    expect(response.statusCode).toBe(422);
    expect(response.body.status).toBe("error");
    expect(response.body.message).toBe("Not enough product quantity available.");
  });

  it("should respond with 422 error code if the user deposit is less than the total amount spent.", async () => {
    const cost = 20;
    const amountAvailable = 10;
    const initialDeposit = 100;
    const newProduct = await getNewProduct(cost, amountAvailable);
    const newBuyer = await getFinancedBuyer(initialDeposit);

    const buyPayload = { productId: newProduct.id, quantity: 6 }
    const response = await request(app)
      .post(buyUrl)
      .send(buyPayload)
      .set("authorization", `Bearer ${newBuyer.accessToken}`);

    expect(response.statusCode).toBe(422);
    expect(response.body.status).toBe("error");
    expect(response.body.message).toBe("User deposit is too Low.");
  });

  it("should respond with 400 error code for missing fields.", async () => {
    const buyPayload = {}
    const response = await request(app)
      .post(buyUrl)
      .send(buyPayload)
      .set("authorization", `Bearer ${buyer.accessToken}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("error");
    expect(response.body.message).toBe("Validation Error(s)");
  });

  it("should be protected, responds with 401 error code.", async () => {
    const buyPayload = { productId: product.id, quantity: 3 }
    const response = await request(app)
      .post(buyUrl)
      .send(buyPayload)

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe("error");
    expect(response.body.message).toBe("User not authenticated.");
  });

  it("should only run for buyers, responds with 403 error code.", async () => {
    const sellerStub = getMockUser("seller");
    const newSeller = await userService.createAUser(sellerStub);

    const buyPayload = { productId: product.id, quantity: 3 }
    const response = await request(app)
      .post(buyUrl)
      .send(buyPayload)
      .set("authorization", `Bearer ${newSeller.accessToken}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.status).toBe("error");
    expect(response.body.message).toBe("Forbidden route. Only a buyer can access this route.");
  });

  afterAll(async () => {
    await db.connection.close()
  })

});