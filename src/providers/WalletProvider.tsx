'use client';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import {
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";

export function AppWalletProvider({ children }: { children: React.ReactNode }) {
  // Set to 'mainnet-beta' for production
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Initialize wallets that you want to support
  const wallets = useMemo(
    () => [
      // new AlphaWalletAdapter(),
      // new BitpieWalletAdapter(),
      // new CloverWalletAdapter(),
      // new Coin98WalletAdapter(),
      // new CoinhubWalletAdapter(),
      // new HuobiWalletAdapter(),
      // new LedgerWalletAdapter(),
      // new MathWalletAdapter(),
      // new OntoWalletAdapter(),
      // new SolongWalletAdapter(),
      // new TokenPocketWalletAdapter(),
      // new TorusWalletAdapter(),
      // new SafePalWalletAdapter(),
      // new TrustWalletAdapter(),
      // new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      // new UnsafeBurnerWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
