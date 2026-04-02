import { signTransaction } from "@stellar/freighter-api";
import { TrustlessWorkClient } from "./client";
import { getNetworkPassphrase } from "./payloads";
import type { InitializeMultiReleaseEscrowPayload, TrustlessWorkNetwork } from "./types";

export interface ExecuteEscrowDeploymentOptions {
  network?: TrustlessWorkNetwork;
  client?: TrustlessWorkClient;
}

export async function signAndSendTrustlessWorkTransaction(
  unsignedXdr: string,
  signerAddress: string,
  options: ExecuteEscrowDeploymentOptions = {}
) {
  const network = options.network || "testnet";
  const client = options.client || new TrustlessWorkClient({ network });

  const signed = await signTransaction(unsignedXdr, {
    address: signerAddress,
    networkPassphrase: getNetworkPassphrase(network),
  });

  if (signed.error || !signed.signedTxXdr) {
    throw new Error(signed.error?.message || "Freighter could not sign the transaction");
  }

  return client.sendSignedTransaction(signed.signedTxXdr);
}

export async function deployInstitutionalEscrow(
  payload: InitializeMultiReleaseEscrowPayload,
  options: ExecuteEscrowDeploymentOptions = {}
) {
  const network = options.network || "testnet";
  const client = options.client || new TrustlessWorkClient({ network });
  const deployResponse = await client.deployMultiReleaseEscrow(payload);
  const unsignedXdr = String(deployResponse.xdr || deployResponse.tx || "");

  if (!unsignedXdr) {
    throw new Error("Trustless Work did not return an unsigned XDR for deployment");
  }

  const sendResponse = await signAndSendTrustlessWorkTransaction(unsignedXdr, payload.signer, {
    network,
    client,
  });

  return {
    deployResponse,
    sendResponse,
  };
}
