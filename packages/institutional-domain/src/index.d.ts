export type InstitutionalCategory = "wallet" | "card-network" | "remittance" | "asset-manager" | "bank" | "fintech";
export type InstitutionalAsset = "USDC" | "PYUSD" | "EURC" | "XLM" | "Tokenized Treasuries";
export interface InstitutionalPartner {
    slug: string;
    name: string;
    category: InstitutionalCategory;
    stellarRelationship: string;
    opportunity: string;
    readinessScore: number;
    primaryAsset: InstitutionalAsset;
    rails: string[];
    x402Services: string[];
    notes: string[];
}
export interface MonetizedCapability {
    name: string;
    description: string;
    endpoint: string;
    price: string;
}
export interface PaymentRequirement {
    accepts: Array<{
        scheme: "exact";
        price: string;
        network: "stellar:testnet";
    }>;
    description: string;
    mimeType: "application/json";
}
export declare const institutionalPartners: InstitutionalPartner[];
export declare const monetizedCapabilities: MonetizedCapability[];
export declare const paymentRequirements: Record<string, PaymentRequirement>;
export declare const institutionalCatalog: {
    slug: string;
    name: string;
    category: InstitutionalCategory;
    stellarRelationship: string;
    opportunity: string;
    readinessScore: number;
    primaryAsset: InstitutionalAsset;
    rails: string[];
    x402Services: string[];
}[];
