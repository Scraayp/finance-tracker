import React, { useState, useEffect } from "react";
import { TOTP } from "otpauth";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff, Copy, Check } from "lucide-react";

interface TwoFactorSetupProps {
  onComplete: (secret: string) => void;
  onCancel: () => void;
}

export function TwoFactorSetup({ onComplete, onCancel }: TwoFactorSetupProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<"qr" | "verify">("qr");
  const [secret, setSecret] = useState<string>("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate TOTP secret on mount
    const totp = new TOTP({
      issuer: "Finance Tracker",
      label: user?.email || "User",
      algorithm: "SHA1",
      digits: 6,
      period: 30,
    });

    const secretString = totp.secret.base32;
    setSecret(secretString);

    // Generate QR code
    const otpauthUrl = totp.toString();
    QRCode.toDataURL(otpauthUrl, {
      errorCorrectionLevel: "H",
      type: "image/png",
      width: 200,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    }).then(setQrCodeUrl);
  }, [user?.email]);

  const handleVerify = async () => {
    if (!verificationCode.trim()) {
      toast.error("Please enter the verification code");
      return;
    }

    setIsLoading(true);
    try {
      // Create TOTP instance with the secret
      const totp = new TOTP({
        issuer: "Finance Tracker",
        label: user?.email || "User",
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: secret,
      });

      // Verify the code (with ±1 time window for some tolerance)
      const delta = totp.validate({
        token: verificationCode.replace(/\s/g, ""),
        window: 1,
      });

      if (delta === null) {
        toast.error("Invalid verification code. Please try again.");
        setVerificationCode("");
        setIsLoading(false);
        return;
      }

      // Save TOTP secret to user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          two_factor_secret: secret,
          two_factor_enabled: true,
        },
      });

      if (error) {
        toast.error(`Failed to save 2FA settings: ${error.message}`);
        setIsLoading(false);
        return;
      }

      // Also store in localStorage as backup
      localStorage.setItem(
        `totp_secret_${user?.id}`,
        JSON.stringify({
          secret,
          enabledAt: new Date().toISOString(),
        }),
      );

      toast.success("Two-factor authentication has been enabled!");
      onComplete(secret);
    } catch (error) {
      console.error("2FA setup error:", error);
      toast.error("Failed to verify code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement("a");
    link.download = "2fa-qr-code.png";
    link.href = qrCodeUrl;
    link.click();
  };

  if (step === "qr") {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Step 1: Scan QR Code with Authenticator App
          </p>
          <p className="text-xs text-muted-foreground">
            Use an authenticator app like Google Authenticator, Microsoft
            Authenticator, or Authy to scan this code.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
          {qrCodeUrl && (
            <img
              src={qrCodeUrl}
              alt="2FA QR Code"
              className="p-2 bg-white rounded"
            />
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={downloadQRCode}
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
          >
            Download QR Code
          </Button>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Or enter manually:</p>
          <div className="p-3 bg-muted rounded-lg border border-border">
            <div className="flex items-center justify-between gap-2">
              <code className="text-xs font-mono break-all flex-1">
                {showSecret ? secret : "•".repeat(secret.length)}
              </code>
              <button
                onClick={() => setShowSecret(!showSecret)}
                className="p-1 hover:bg-background rounded"
              >
                {showSecret ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={copyToClipboard}
                className="p-1 hover:bg-background rounded"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-lg">
          <p className="text-xs text-amber-800 dark:text-amber-200">
            💾 <strong>Save your code:</strong> Store this code in a safe place
            as a backup. You'll need it if you lose access to your authenticator
            app.
          </p>
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={onCancel} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={() => setStep("verify")}
            disabled={isLoading}
            className="flex-1"
          >
            Next: Verify Code
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">Step 2: Enter Verification Code</p>
        <p className="text-xs text-muted-foreground">
          Enter the 6-digit code from your authenticator app to verify the
          setup.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="verify-code" className="text-sm font-medium">
          Verification Code
        </Label>
        <Input
          id="verify-code"
          type="text"
          inputMode="numeric"
          placeholder="000000"
          value={verificationCode}
          onChange={(e) =>
            setVerificationCode(e.target.value.replace(/\D/g, ""))
          }
          maxLength="6"
          className="text-center text-lg tracking-widest font-mono"
        />
      </div>

      <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-lg">
        <p className="text-xs text-blue-800 dark:text-blue-200">
          ℹ️ <strong>Codes expire every 30 seconds</strong>. If a code doesn't
          work, wait a few seconds and try the next one.
        </p>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          onClick={() => setStep("qr")}
          variant="outline"
          className="flex-1"
          disabled={isLoading}
        >
          Back
        </Button>
        <Button
          onClick={handleVerify}
          disabled={isLoading || verificationCode.length !== 6}
          className="flex-1"
        >
          {isLoading ? "Verifying..." : "Verify & Enable 2FA"}
        </Button>
      </div>
    </div>
  );
}
