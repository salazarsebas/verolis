"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Wallet, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { connectWallet, disconnectWallet, makeX402Request, PaymentRequirements } from "@/lib/x402/client";

interface PaywallProps {
  requirements: PaymentRequirements;
  resourceUrl: string;
  description: string;
  onSuccess?: (data: any) => void;
  children?: React.ReactNode;
  method?: "GET" | "POST";
  requestBody?: Record<string, unknown>;
}

export function Paywall({
  requirements,
  resourceUrl,
  description,
  onSuccess,
  children,
  method = "GET",
  requestBody,
}: PaywallProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "paying" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resourceData, setResourceData] = useState<any>(null);

  const handleConnect = useCallback(async () => {
    try {
      const address = await connectWallet();
      setWalletAddress(address);
      setIsConnected(true);
    } catch (error) {
      setErrorMessage("Failed to connect wallet");
      console.error(error);
    }
  }, []);

  const handleDisconnect = useCallback(async () => {
    await disconnectWallet();
    setWalletAddress(null);
    setIsConnected(false);
    setPaymentStatus("idle");
    setResourceData(null);
  }, []);

  const handlePayment = useCallback(async () => {
    let activeWallet = walletAddress;
    if (!activeWallet) {
      try {
        activeWallet = await connectWallet();
        setWalletAddress(activeWallet);
        setIsConnected(true);
      } catch (error) {
        setErrorMessage("Failed to connect wallet");
        return;
      }
    }

    setIsPaying(true);
    setPaymentStatus("paying");
    setErrorMessage(null);

    try {
      const response = await makeX402Request(resourceUrl, requirements, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: method === "POST" ? JSON.stringify(requestBody || {}) : undefined,
      });

      if (response.ok) {
        const data = await response.json();
        setResourceData(data);
        setPaymentStatus("success");
        onSuccess?.(data);
      } else {
        throw new Error(`Payment failed: ${response.status}`);
      }
    } catch (error: any) {
      setPaymentStatus("error");
      setErrorMessage(error.message || "Payment failed. Please try again.");
      console.error(error);
    } finally {
      setIsPaying(false);
    }
  }, [method, onSuccess, requestBody, resourceUrl, requirements, walletAddress]);

  const formatAddress = (address: string | null) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (paymentStatus === "success" && resourceData) {
    return (
      <Card className="border-green-500 bg-green-50 dark:bg-green-950/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <CardTitle className="text-green-800 dark:text-green-400">Payment Successful</CardTitle>
          </div>
          <CardDescription className="text-green-700 dark:text-green-500">
            Resource unlocked successfully
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-white dark:bg-gray-900 p-4 border">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(resourceData, null, 2)}
            </pre>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm" onClick={handleDisconnect}>
            <Wallet className="h-4 w-4 mr-2" />
            Disconnect
          </Button>
          <Button variant="outline" size="sm" onClick={handlePayment}>
            Purchase Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Payment Required</CardTitle>
          <Badge variant="outline">{requirements.network}</Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Details */}
        <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Price</span>
            <span className="font-semibold text-lg">{requirements.price}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Network</span>
            <span className="text-sm font-medium">{requirements.network}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Payment To</span>
            <span className="text-sm font-mono">{formatAddress(requirements.payTo)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Scheme</span>
            <Badge variant="secondary">{requirements.scheme}</Badge>
          </div>
        </div>

        {/* Wallet Connection */}
        {isConnected ? (
          <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-400">
                {formatAddress(walletAddress)}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleDisconnect}>
              Disconnect
            </Button>
          </div>
        ) : (
          <Button onClick={handleConnect} className="w-full" variant="outline">
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </Button>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-800 dark:text-red-400">{errorMessage}</span>
          </div>
        )}

        {children}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handlePayment} 
          disabled={isPaying}
          className="w-full"
        >
          {isPaying ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              Pay {requirements.price}
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
