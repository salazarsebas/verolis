export type TrustlessWorkNetwork = "testnet" | "mainnet";

export interface TrustlessWorkRoleSet {
  approver: string;
  serviceProvider: string;
  platformAddress: string;
  releaseSigner: string;
  disputeResolver: string;
  receiver: string;
}

export interface TrustlessWorkTrustline {
  address: string;
  symbol: string;
}

export interface TrustlessWorkMultiReleaseMilestone {
  description: string;
  amount: number;
  receiver: string;
}

export interface InitializeMultiReleaseEscrowPayload {
  signer: string;
  engagementId: string;
  title: string;
  description: string;
  amount: number;
  platformFee: number;
  roles: TrustlessWorkRoleSet;
  trustline: TrustlessWorkTrustline;
  milestones: TrustlessWorkMultiReleaseMilestone[];
}

export interface FundEscrowPayload {
  amount: number;
  contractId: string;
  signer: string;
}

export interface ChangeMilestoneStatusPayload {
  contractId: string;
  milestoneIndex: string;
  newStatus: string;
  newEvidence?: string;
  serviceProvider: string;
}

export interface ApproveMilestonePayload {
  contractId: string;
  milestoneIndex: string;
  newEvidence?: string;
  approver: string;
}

export interface ReleaseMilestoneFundsPayload {
  contractId: string;
  releaseSigner: string;
  milestoneIndex: string;
}

export interface ResolveMilestoneDisputePayload {
  contractId: string;
  disputeResolver: string;
  milestoneIndex: string;
  distributions: Array<{
    address: string;
    amount: number;
  }>;
}

export interface TrustlessWorkUnsignedXdrResponse {
  xdr?: string;
  tx?: string;
  contractId?: string;
  [key: string]: unknown;
}

export interface InstitutionalEscrowBlueprint {
  partnerSlug: string;
  partnerName: string;
  title: string;
  description: string;
  totalAmount: number;
  settlementAsset: string;
  phases: TrustlessWorkMultiReleaseMilestone[];
  rationale: string[];
}
