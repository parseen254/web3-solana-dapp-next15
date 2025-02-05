"use client";

import { Loader2, WalletIcon } from "lucide-react";
import { Suspense, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";

import { Button } from "./ui/button";
import dynamic from "next/dynamic";
import { useWallet } from "@solana/wallet-adapter-react";

const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export function WalletConnectButton() {
  const { status } = useSession();
  const { connected, autoConnect, connecting, disconnecting } = useWallet();

  // Handle wallet disconnection
  useEffect(() => {
    if (disconnecting && status == "authenticated") {
      console.log("Disconnecting wallet... signout");
      signOut();
    } else if (
      !connected &&
      status == "authenticated" &&
      !connecting &&
      !autoConnect
    ) {
      signOut();
      console.log("Auto-connecting wallet... signout");
    }
  }, [status, disconnecting, connected, connecting, autoConnect]);
  return (
    <div className="relative items-center gap-2 inline-flex bg-primary text-primary-foreground rounded-xl">
      <Suspense
        fallback={
          <Button disabled className="font-semibold text-xl mx-4 my-2">
            <Loader2 className="ml-2 animate-spin" />
            Loading...
          </Button>
        }
      >
        <WalletMultiButton startIcon={<WalletIcon className="ml-2" />} />
      </Suspense>
    </div>
  );
}
