"use client";

import { Button } from "./ui/button";
import { Suspense } from "react";
import { WalletIcon } from "lucide-react";
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
          <Button className="font-semibold text-xl mx-4 my-2">
            Loading...
          </Button>
        }
      >
        <WalletIcon className="ml-2" />
        <WalletMultiButton />
      </Suspense>
    </div>
  );
}
