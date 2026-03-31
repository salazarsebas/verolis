/**
 * API Server Tests
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";

const API_URL = process.env.TEST_API_URL || "http://localhost:4021";

describe("API Server", () => {
  describe("Health Check", () => {
    it("should return healthy status", async () => {
      const response = await request(API_URL)
        .get("/health")
        .expect(200);

      expect(response.body.status).toBe("healthy");
      expect(response.body.service).toBe("stellar-x402-api");
    });
  });

  describe("Supported Payment Methods", () => {
    it("should return supported payment methods", async () => {
      const response = await request(API_URL)
        .get("/api/supported")
        .expect(200);

      expect(response.body.network).toBe("stellar:testnet");
      expect(response.body.scheme).toBe("exact");
      expect(response.body.endpoints).toBeDefined();
      expect(Array.isArray(response.body.endpoints)).toBe(true);
    });
  });

  describe("Protected Endpoints", () => {
    it("should return 402 for weather endpoint without payment", async () => {
      const response = await request(API_URL)
        .get("/api/weather")
        .expect(402);

      expect(response.body.error).toBeDefined();
    });

    it("should return 402 for market-data endpoint without payment", async () => {
      const response = await request(API_URL)
        .get("/api/market-data")
        .expect(402);

      expect(response.body.error).toBeDefined();
    });

    it("should return 402 for kyc-verify endpoint without payment", async () => {
      const response = await request(API_URL)
        .get("/api/kyc-verify")
        .expect(402);

      expect(response.body.error).toBeDefined();
    });
  });
});
