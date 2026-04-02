import { Networks } from "@stellar/stellar-sdk";
import type {
  InitializeMultiReleaseEscrowPayload,
  InstitutionalEscrowBlueprint,
  TrustlessWorkNetwork,
  TrustlessWorkRoleSet,
} from "./types";

export interface InstitutionalEscrowExecutionContext {
  signer: string;
  engagementId: string;
  title?: string;
  description?: string;
  platformFee?: number;
  trustlineAddress: string;
  trustlineSymbol?: string;
  roles: TrustlessWorkRoleSet;
}

export function createDefaultRoleSet(prefix = "ROLE"): TrustlessWorkRoleSet {
  return {
    approver: `${prefix}_APPROVER`,
    serviceProvider: `${prefix}_SERVICE_PROVIDER`,
    platformAddress: `${prefix}_PLATFORM`,
    releaseSigner: `${prefix}_RELEASE_SIGNER`,
    disputeResolver: `${prefix}_DISPUTE_RESOLVER`,
    receiver: `${prefix}_RECEIVER`,
  };
}

export function buildInitializeMultiReleaseEscrowPayload(
  blueprint: InstitutionalEscrowBlueprint,
  context: InstitutionalEscrowExecutionContext
): InitializeMultiReleaseEscrowPayload {
  return {
    signer: context.signer,
    engagementId: context.engagementId,
    title: context.title || blueprint.title,
    description: context.description || blueprint.description,
    amount: blueprint.totalAmount,
    platformFee: context.platformFee ?? 0,
    roles: context.roles,
    trustline: {
      address: context.trustlineAddress,
      symbol: context.trustlineSymbol || blueprint.settlementAsset,
    },
    milestones: blueprint.phases.map((phase) => ({
      description: phase.description,
      amount: phase.amount,
      receiver: context.roles.receiver,
    })),
  };
}

export function getNetworkPassphrase(network: TrustlessWorkNetwork) {
  return network === "mainnet" ? Networks.PUBLIC : Networks.TESTNET;
}
