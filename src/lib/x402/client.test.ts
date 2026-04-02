/**
 * x402 Client Utilities Tests
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  parsePrice,
  createPaymentPayload,
  createPaymentHeaders,
  connectWallet,
  disconnectWallet,
} from "@/lib/x402/client";

// Mock Freighter API
vi.mock("@stellar/freighter-api", () => ({
  connect: vi.fn(() => Promise.resolve({ address: "GTEST123" })),
  isConnected: vi.fn(() => Promise.resolve(false)),
  disconnect: vi.fn(() => Promise.resolve()),
}));

describe("x402 Client", () => {
  describe("parsePrice", () => {
    it("should parse USD price to stroops", () => {
      expect(parsePrice("$0.001")).toBe("10000");
      expect(parsePrice("$0.01")).toBe("100000");
      expect(parsePrice("$1.00")).toBe("10000000");
      expect(parsePrice("$10.50")).toBe("105000000");
    });

    it("should handle prices without $ sign", () => {
      expect(parsePrice("0.001")).toBe("10000");
      expect(parsePrice("1.00")).toBe("10000000");
    });
  });

  describe("createPaymentPayload", () => {
    it("should create valid x402 v2 payment payload", () => {
      const requirements = {
        scheme: "exact",
        price: "$0.001",
        network: "stellar:testnet",
        payTo: "GTEST123",
      };

      const payload = createPaymentPayload(
        requirements,
        "/api/partners",
        "Institutional partner discovery"
      );

      expect(payload.x402Version).toBe(2);
      expect(payload.scheme).toBe("exact");
      expect(payload.network).toBe("stellar:testnet");
      expect(payload.payload.price).toBe("$0.001");
      expect(payload.payload.payTo).toBe("GTEST123");
      expect(payload.payload.resource).toBe("/api/partners");
    });
  });

  describe("createPaymentHeaders", () => {
    it("should create proper x402 headers", () => {
      const payment = {
        x402Version: 2,
        scheme: "exact",
        network: "stellar:testnet",
        payload: {
          price: "$0.001",
          payTo: "GTEST123",
          resource: "/api/partners",
          description: "Institutional partner discovery",
        },
        signature: "0xabc123",
      };

      const headers = createPaymentHeaders(payment);

      expect(headers["x402-version"]).toBe("2");
      expect(headers["x402-scheme"]).toBe("exact");
      expect(headers["x402-network"]).toBe("stellar:testnet");
      expect(headers["x402-payload"]).toBeDefined();
      expect(headers["x402-signature"]).toBe("0xabc123");
    });
  });

  describe("connectWallet", () => {
    it("should connect to Freighter wallet", async () => {
      const address = await connectWallet();
      expect(address).toBe("GTEST123");
    });
  });

  describe("disconnectWallet", () => {
    it("should disconnect from Freighter wallet", async () => {
      await disconnectWallet();
      expect(vi.mocked(await import("@stellar/freighter-api")).disconnect).toHaveBeenCalled();
    });
  });
});
