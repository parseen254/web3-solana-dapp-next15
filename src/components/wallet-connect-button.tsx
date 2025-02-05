"use client";

import { Loader2, WalletIcon } from "lucide-react";

import { Button } from "./ui/button";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export function WalletConnectButton() {
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
