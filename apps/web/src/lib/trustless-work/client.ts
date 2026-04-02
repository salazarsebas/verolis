import type {
  ApproveMilestonePayload,
  ChangeMilestoneStatusPayload,
  FundEscrowPayload,
  InitializeMultiReleaseEscrowPayload,
  ReleaseMilestoneFundsPayload,
  ResolveMilestoneDisputePayload,
  TrustlessWorkNetwork,
  TrustlessWorkUnsignedXdrResponse,
} from "./types";

const BASE_URLS: Record<TrustlessWorkNetwork, string> = {
  testnet: "https://api.dev.trustlesswork.com",
  mainnet: "https://api.trustlesswork.com",
};

export interface TrustlessWorkClientOptions {
  apiKey?: string;
  network?: TrustlessWorkNetwork;
  baseUrl?: string;
}

export class TrustlessWorkClient {
  private readonly apiKey?: string;
  private readonly baseUrl: string;

  constructor(options: TrustlessWorkClientOptions = {}) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl || BASE_URLS[options.network || "testnet"];
  }

  getConfig() {
    return {
      baseUrl: this.baseUrl,
      hasApiKey: Boolean(this.apiKey),
    };
  }

  async deployMultiReleaseEscrow(
    payload: InitializeMultiReleaseEscrowPayload
  ): Promise<TrustlessWorkUnsignedXdrResponse> {
    return this.request("/deployer/multi-release", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async fundEscrow(payload: FundEscrowPayload): Promise<TrustlessWorkUnsignedXdrResponse> {
    return this.request("/escrow/multi-release/fund-escrow", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async changeMilestoneStatus(
    payload: ChangeMilestoneStatusPayload
  ): Promise<TrustlessWorkUnsignedXdrResponse> {
    return this.request("/escrow/multi-release/change-milestone-status", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async approveMilestone(
    payload: ApproveMilestonePayload
  ): Promise<TrustlessWorkUnsignedXdrResponse> {
    return this.request("/escrow/multi-release/approve-milestone", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async releaseMilestoneFunds(
    payload: ReleaseMilestoneFundsPayload
  ): Promise<TrustlessWorkUnsignedXdrResponse> {
    return this.request("/escrow/multi-release/release-milestone-funds", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async resolveMilestoneDispute(
    payload: ResolveMilestoneDisputePayload
  ): Promise<TrustlessWorkUnsignedXdrResponse> {
    return this.request("/escrow/multi-release/resolve-milestone-dispute", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async getEscrowsByRole(role: string, address: string) {
    const params = new URLSearchParams({ role, address });
    return this.request(`/helper/get-escrows-by-role?${params.toString()}`, {
      method: "GET",
    });
  }

  async sendSignedTransaction(signedXdr: string) {
    return this.request("/helper/send-transaction", {
      method: "POST",
      body: JSON.stringify({ signedXdr }),
    });
  }

  private async request(path: string, init: RequestInit) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(this.apiKey ? { "x-api-key": this.apiKey } : {}),
        ...(init.headers || {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Trustless Work request failed: ${response.status}`);
    }

    return response.json();
  }
}
