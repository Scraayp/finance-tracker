import React, { useState } from "react";
import { TOTP } from "otpauth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

interface TOTPVerificationProps {
  onVerify: (code: string) => Promise<boolean>;
  onCancel: () => void;
}

export function TOTPVerification({
  onVerify,
  onCancel,
}: TOTPVerificationProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      toast.error("Please enter the verification code");
      return;
    }

    if (code.length !== 6) {
      toast.error("Verification code must be 6 digits");
      return;
    }

    setIsLoading(true);
    try {
      const verified = await onVerify(code);
      if (verified) {
        toast.success("Verification successful!");
      } else {
        toast.error("Invalid verification code. Please try again.");
        setCode("");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Two-Factor Authentication</CardTitle>
        <CardDescription>
          Enter the 6-digit code from your authenticator app
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleVerify}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="2fa-code">Verification Code</Label>
            <Input
              id="2fa-code"
              type="text"
              inputMode="numeric"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              maxLength="6"
              className="text-center text-lg tracking-widest font-mono"
              disabled={isLoading}
            />
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-lg">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              ℹ️ <strong>Codes expire every 30 seconds</strong>. If a code
              doesn't work, wait a few seconds and try the next one.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
