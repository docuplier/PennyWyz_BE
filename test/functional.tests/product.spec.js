import { afterAll, describe, expect, it } from '@jest/globals';
import request from "supertest";
import app from "../../src/index.js";
import getMockUser from "../stubs/user.js";
import getMockProduct from "../stubs/product.js";
import * as userService from "../../src/services/user.service.js"
import * as productService from "../../src/services/product.service.js"
import db from '../../src/database/models/index.js'

const productBaseUrl = "/api/v1/products";

describe("Product CRUD endpoints", () => {
  let buyer, seller;
  beforeAll(async () => {
    // reset the db
    await db.connection.sync({ force: true });

    const buyerStub = getMockUser("buyer");
    buyer = await userService.createAUser(buyerStub);

    const sellerStub = getMockUser("seller");
    seller = await userService.createAUser(sellerStub);
  });

  describe("POST /products", () => {
    it("should run successfully with the right details and user", async () => {
      const productStub = getMockProduct();
      const response = await request(app)
        .post(productBaseUrl)
        .send(productStub)
        .set("authorization", `Bearer ${seller.accessToken}`);

      expect(response.statusCode).toBe(201);
      expect(response.body.status).toBe("success");
      expect(response.body.message).toBe("Product record created successfully.");
      expect(response.body.data.sellerId).toBe(seller.user.id);
    })

    it("should be protected, responds with 401 error code.", async () => {
      const productStub = getMockProduct();

      const response = await request(app)
        .post(productBaseUrl)
        .send(productStub);

      expect(response.statusCode).toBe(401);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe("User not authenticated.");
    });

    it("should only run for sellers, responds with 403 error code", async () => {
      const productStub = getMockProduct();

      const response = await request(app)
        .post(productBaseUrl)
        .send(productStub)
        .set("authorization", `Bearer ${buyer.accessToken}`);

      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe("Forbidden route. Only a seller can access this route.");
    })

    it("should respond with 400 error code when there are missing required fields", async () => {
      const productStub = getMockProduct();

      const response = await request(app)
        .post(productBaseUrl)
        .send({ ...productStub, productName: '' })
        .set("authorization", `Bearer ${seller.accessToken}`);

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe("Validation Error(s)");
    })

    it("should respond with 409 error code when there's a duplicate productName", async () => {
      const productName = "duplicate"
      const productStub = getMockProduct(undefined, undefined, productName);
      const promise = await productService.createAProduct(productStub, seller.user.id);

      const response = await request(app)
        .post(productBaseUrl)
        .send(productStub)
        .set("authorization", `Bearer ${seller.accessToken}`);

      expect(response.statusCode).toBe(409);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe("Product, with productName: duplicate, already exists.");
    })
  })

  describe("PUT /products/:id", () => {
    const productUpdateUrl = (productId) => `${productBaseUrl}/${productId}`;

    it("should run successfully with the right details and user", async () => {
      const productStub = getMockProduct();
      const productName = "changeName";
      const product = await productService.createAProduct(productStub, seller.user.id);

      const response = await request(app)
        .put(productUpdateUrl(product.id))
        .send({ ...productStub, productName })
        .set("authorization", `Bearer ${seller.accessToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.message).toBe("Product record updated successfully.");

      const checkProduct = await productService.getOneProduct(product.id);
      expect(checkProduct.productName).toBe(productName);
    })

    it("should be protected, responds with 401 error code.", async () => {
      const productStub = getMockProduct();
      const product = await productService.createAProduct(productStub, seller.user.id);

      const response = await request(app)
        .put(productUpdateUrl(product.id))
        .send(productStub);

      expect(response.statusCode).toBe(401);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe("User not authenticated.");
    });

    it("should only run for sellers, responds with 403 error code", async () => {
      const productStub = getMockProduct();
      const product = await productService.createAProduct(productStub, seller.user.id);

      const response = await request(app)
        .put(productUpdateUrl(product.id))
        .send(productStub)
        .set("authorization", `Bearer ${buyer.accessToken}`);

      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe("Forbidden route. Only a seller can access this route.");
    })

    it("should respond with 400 error code when there are empty required fields", async () => {
      const productStub = getMockProduct();
      const product = await productService.createAProduct(productStub, seller.user.id);

      const response = await request(app)
        .put(productUpdateUrl(product.id))
        .send({ ...productStub, productName: '' })
        .set("authorization", `Bearer ${seller.accessToken}`);

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe("Validation Error(s)");
    })

    it("should respond with 404 error code when another seller tries to update", async () => {
      const productStub = getMockProduct();
      const product = await productService.createAProduct(productStub, seller.user.id);

      const anotherSellerStub = getMockUser("seller");
      const anotherSeller = await userService.createAUser(anotherSellerStub);

      const response = await request(app)
        .put(productUpdateUrl(product.id))
        .send(productStub)
        .set("authorization", `Bearer ${anotherSeller.accessToken}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe("Product record not found.");
    })

    it("should respond with 404 error code when product record is not found", async () => {
      const productStub = getMockProduct();

      const response = await request(app)
        .put(productUpdateUrl("a-wrong-prodt-id"))
        .send(productStub)
        .set("authorization", `Bearer ${seller.accessToken}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe("Product record not found.");
    })

    it("should responds with 409 error code when there's a duplicate productName", async () => {
      const productName = "update-duplicate"
      const productStub1 = getMockProduct(undefined, undefined, productName);
      const productStub2 = getMockProduct();
      const product = await productService.createAProduct(productStub2, seller.user.id);

      // Control record
      await productService.createAProduct(productStub1, seller.user.id);

      const response = await request(app)
        .put(productUpdateUrl(product.id))
        .send({ ...productStub2, productName })
        .set("authorization", `Bearer ${seller.accessToken}`);

      expect(response.statusCode).toBe(409);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe(`Product, with productName: ${productName}, already exists.`);
    })
  })

  describe("DELETE /products/:id", () => {
    const productDeleteUrl = (productId) => `${productBaseUrl}/${productId}`;

    it("should run successfully with the right details and user", async () => {
      const productStub = getMockProduct();
      const product = await productService.createAProduct(productStub, seller.user.id);

      const response = await request(app)
        .delete(productDeleteUrl(product.id))
        .set("authorization", `Bearer ${seller.accessToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.message).toBe("Product record deleted successfully.");
    })

    it("should be protected, responds with 401 error code.", async () => {
      const productStub = getMockProduct();
      const product = await productService.createAProduct(productStub, seller.user.id);

      const response = await request(app)
        .delete(productDeleteUrl(product.id));

      expect(response.statusCode).toBe(401);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe("User not authenticated.");
    });

    it("should only run for sellers, responds with 403 error code", async () => {
      const productStub = getMockProduct();
      const product = await productService.createAProduct(productStub, seller.user.id);

      const response = await request(app)
        .delete(productDeleteUrl(product.id))
        .set("authorization", `Bearer ${buyer.accessToken}`);

      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe("Forbidden route. Only a seller can access this route.");
    })

    it("should respond with 404 error code when another seller tries to delete", async () => {
      const productStub = getMockProduct();
      const product = await productService.createAProduct(productStub, seller.user.id);

      const anotherSellerStub = getMockUser("seller");
      const anotherSeller = await userService.createAUser(anotherSellerStub);

      const response = await request(app)
        .delete(productDeleteUrl(product.id))
        .set("authorization", `Bearer ${anotherSeller.accessToken}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe("Product record not found.");
    })

    it("should respond with 404 error code when product record is not found", async () => {

      const response = await request(app)
        .delete(productDeleteUrl("a-wrong-prodt-id"))
        .set("authorization", `Bearer ${seller.accessToken}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe("Product record not found.");
    })
  })

  describe("GET /products/:id", () => {
    const productGetUrl = (productId) => `${productBaseUrl}/${productId}`;

    it("should run successfully with the right details", async () => {
      const productStub = getMockProduct();
      const product = await productService.createAProduct(productStub, seller.user.id);

      const response = await request(app)
        .get(productGetUrl(product.id))
        .set("authorization", `Bearer ${seller.accessToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.message).toBe("Product details.");
      expect(response.body.data.productName).toBe(product.productName);
    })

    it("should be protected, responds with 401 error code.", async () => {
      const productStub = getMockProduct();
      const product = await productService.createAProduct(productStub, seller.user.id);

      const response = await request(app)
        .get(productGetUrl(product.id));

      expect(response.statusCode).toBe(401);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe("User not authenticated.");
    });

    it("should respond with 404 error code when product record is not found", async () => {

      const response = await request(app)
        .get(productGetUrl("a-wrong-prodt-id"))
        .set("authorization", `Bearer ${seller.accessToken}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe("Product record not found.");
    })
  })

  describe("GET /products", () => {
    it("should run successfully with the right details", async () => {
      const productStub = getMockProduct();
      const product = await productService.createAProduct(productStub, seller.user.id);

      const response = await request(app)
        .get(productBaseUrl)
        .set("authorization", `Bearer ${seller.accessToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.message).toBe("Product list.");
      expect(typeof response.body.data).toBe("object");
      expect(Array.isArray(response.body.data)).toBeTruthy();

      const found = response.body.data.find(x => x.productName == product.productName);
      expect(found).not.toBeNull();
    })

    it("should be protected, responds with 401 error code.", async () => {
      const productStub = getMockProduct();
      const product = await productService.createAProduct(productStub, seller.user.id);

      const response = await request(app)
        .get(productBaseUrl);

      expect(response.statusCode).toBe(401);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe("User not authenticated.");
    });

    describe("with the sellerId query param", () => {
      it("should get all products by the seller", async () => {
        const anotherSellerStub = getMockUser("seller");
        const anotherSeller = await userService.createAUser(anotherSellerStub);

        const productStub = getMockProduct();
        const product = await productService.createAProduct(productStub, anotherSeller.user.id);

        const response = await request(app)
          .get(productBaseUrl)
          .query({ sellerId: seller.user.id })
          .set("authorization", `Bearer ${anotherSeller.accessToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.message).toBe("Product list.");
        expect(typeof response.body.data).toBe("object");
        expect(Array.isArray(response.body.data)).toBeTruthy();

        const found = response.body.data.find(x => x.sellerId == anotherSeller.user.id);
        expect(found).toBeUndefined();

        const found1 = response.body.data.find(x => x.productName == product.productName);
        expect(found1).toBeUndefined();
      })

      it("should respond with 400 error code if sellerId query field is empty", async () => {
        const response = await request(app)
          .get(productBaseUrl)
          .query({ sellerId: '' })
          .set("authorization", `Bearer ${seller.accessToken}`);

        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe("error");
        expect(response.body.message).toBe("Validation Error(s)");
      })
    })

    describe("with the productName query param", () => {
      it("should get all products that contains the query param value", async () => {
        const productStub = getMockProduct();
        const product = await productService.createAProduct(productStub, seller.user.id);

        const response = await request(app)
          .get(productBaseUrl)
          .query({ productName: product.productName.substr(0, 3) })
          .set("authorization", `Bearer ${seller.accessToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.message).toBe("Product list.");
        expect(typeof response.body.data).toBe("object");
        expect(Array.isArray(response.body.data)).toBeTruthy();

        const found = response.body.data.find(x => x.productName == product.productName);
        expect(found).not.toBeUndefined();
      })

      it("should respond with 400 error code if productName query field is empty or value is less than 3 characters", async () => {
        const productStub = getMockProduct();
        const product = await productService.createAProduct(productStub, seller.user.id);

        const response = await request(app)
          .get(productBaseUrl)
          .query({ productName: product.productName.substr(0, 2) })
          .set("authorization", `Bearer ${seller.accessToken}`);

        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe("error");
        expect(response.body.message).toBe("Validation Error(s)");
      })
    })
  })

  afterAll(async () => {
    await db.connection.close()
  })
})