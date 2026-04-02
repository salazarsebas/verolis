"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Unlock, Lock, ExternalLink } from "lucide-react";
import { Paywall } from "./paywall";
import { PaymentRequirements } from "@/lib/x402/client";

type ResourceResponse = Record<string, unknown>;

interface ResourceAccessProps {
  endpoint: string;
  method: "GET" | "POST";
  requirements: PaymentRequirements;
  description: string;
  apiUrl: string;
  requestBody?: Record<string, unknown>;
}

export function ResourceAccess({ endpoint, method, requirements, description, apiUrl, requestBody }: ResourceAccessProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePaymentSuccess = (data: ResourceResponse) => {
    setIsUnlocked(true);
    console.log("Resource data:", data);
  };

  const handleTestRequest = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: method === "POST" ? JSON.stringify(requestBody || {}) : undefined,
      });
      const data = await response.json();
      console.log("Test request result:", data);
    } catch (error) {
      console.error("Test request failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isUnlocked ? (
              <Unlock className="h-5 w-5 text-green-600" />
            ) : (
              <Lock className="h-5 w-5 text-gray-400" />
            )}
            <Badge variant={isUnlocked ? "default" : "secondary"}>{method}</Badge>
            <CardTitle className="text-lg font-mono">{endpoint}</CardTitle>
          </div>
          {isUnlocked && (
            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Unlocked
            </Badge>
          )}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {!isUnlocked ? (
          <div className="flex justify-center">
            <Paywall
              requirements={requirements}
              resourceUrl={`${apiUrl}${endpoint}`}
              description={`Pay ${requirements.price} to access ${endpoint}`}
              onSuccess={handlePaymentSuccess}
              method={method}
              requestBody={requestBody}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-400">
                ✓ The last paid request succeeded. Use the test button to inspect the endpoint response shape.
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleTestRequest} disabled={isLoading} variant="outline">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Test Request
                  </>
                )}
              </Button>
              <Button onClick={() => setIsUnlocked(false)} variant="outline">
                Lock Again
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
