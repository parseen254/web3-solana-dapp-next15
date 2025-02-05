"use client";

import { CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WalletConnectButton } from "@/components/wallet-connect-button";
import { cn } from "@/lib/utils";
import { useWallet } from "@solana/wallet-adapter-react";

function AuthDisplay() {
  const { data: session, status } = useSession();
  const { connected, publicKey, signMessage, disconnecting, wallet } =
    useWallet();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Handle wallet disconnection
  useEffect(() => {
    if (disconnecting && session) {
      signOut();
    }
  }, [wallet, session, disconnecting]);

  const handleAuth = async () => {
    if (!connected || !publicKey || !signMessage) return;

    try {
      setIsAuthenticating(true);

      // Create a fixed message format
      const message = `Authenticate ${publicKey.toString()} for web3-solana-dapp`;
      const messageBytes = new TextEncoder().encode(message);

      // Get signature
      const signature = await signMessage(messageBytes);

      // Sign in with proper encoding
      const result = await signIn("credentials", {
        publicKey: publicKey.toString(),
        message: message,
        signature: Buffer.from(signature).toString("base64"),
        redirect: false,
        callbackUrl: window.location.origin // Ensure redirect back to same page
      });

      if (result?.error) {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Authentication error:", error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <WalletConnectButton />
      </div>

      {connected && (
        <div className="flex flex-col gap-2">
          <span className="text-sm text-zinc-500">
            {session ? "Authenticated as" : "Wallet connected"}
          </span>
          <span className="text-sm font-medium truncate">
            {session?.user?.email || publicKey?.toString()}
          </span>
        </div>
      )}
      <div className="flex flex-col gap-2">
        {connected && !session && (
          <Button
            onClick={handleAuth}
            disabled={isAuthenticating}
            size="sm"
            className="ml-2"
          >
            {isAuthenticating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <KeyRound className="h-4 w-4" />
            )}
            <span className="ml-2">Authenticate</span>
          </Button>
        )}
        {session && (
          <Button
            onClick={() => signOut()}
            variant="outline"
            size="sm"
            className="ml-2"
          >
            Sign Out
          </Button>
        )}
      </div>
    </div>
  );
}

export default function AuthCard() {
  const { data: session } = useSession();

  return (
    <div
      className={cn(
        "flex-1 p-4 rounded-xl text-left transition-all relative",
        "border border-primary ring-2 ring-primary",
        session && "border-green-500 ring-green-500"
      )}
    >
      <div className="flex items-center justify-between mb-2 mt-2">
        <div className="flex flex-col content-between justify-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-md font-medium text-zinc-500">
              Authentication
            </span>
            {session && <CheckCircle2 className="h-4 w-4 text-green-500" />}
          </div>
          <AuthDisplay />
        </div>
      </div>
    </div>
  );
}
