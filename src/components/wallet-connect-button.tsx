"use client";

import { WalletIcon } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export function WalletConnectButton() {
  return (
    <div className="relative items-center gap-2 inline-flex bg-primary text-primary-foreground rounded-xl">
      <WalletIcon  className="ml-2"/>
      <WalletMultiButton />
    </div>
  );
}
