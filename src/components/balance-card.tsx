"use client";

import NumberFlow from "@number-flow/react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useBalance } from "@/hooks/useBalance";
import { useWallet } from "@solana/wallet-adapter-react";

function BalanceValue({ amount, className }: { amount: number; className?: string }) {
  return (
    <NumberFlow
      format={{
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }}
      value={amount}
      className={className}
    />
  );
}

function SolValue({ amount }: { amount: number }) {
  return (
    <div className="flex items-baseline gap-1">
      <NumberFlow
        format={{ minimumFractionDigits: 4, maximumFractionDigits: 4 }}
        value={amount}
        className="text-sm text-zinc-500"
      />
      <span className="text-xs text-zinc-400">SOL</span>
    </div>
  );
}

function PriceChangeIndicator({ change }: { change: number }) {
  return (
    <div
      className={cn(
        "text-xs px-2 py-0.5 rounded-full",
        change >= 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
      )}
    >
      <NumberFlow
        value={change}
        format={{
          style: "percent",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
          signDisplay: "always",
        }}
      />
    </div>
  );
}

function BalanceDisplay() {
  const { connected } = useWallet();
  const { data, isLoading, error } = useBalance();

  if (!connected) {
    return <span className="text-sm text-zinc-500">Connect wallet to view balance</span>;
  }

  if (error) {
    return <span className="text-sm text-red-500">{error.message}</span>;
  }

  if (isLoading && !data) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    );
  }

  return data ? (
    <div className="space-y-1">
      <BalanceValue amount={data.usd} className="text-2xl font-bold" />
      <SolValue amount={data.sol} />
    </div>
  ) : null;
}

export default function BalanceCard() {
  const { data } = useBalance();

  return (
    <div
      className={cn(
        "flex-1 p-4 rounded-xl text-left transition-all relative",
        "border border-zinc-200 dark:border-zinc-800",
        "ring-2 ring-blue-500 dark:ring-blue-400"
      )}
    >
      <div className="flex items-center justify-between mb-2 mt-2">
        <span className="text-sm font-medium">Balance</span>
        {data && <PriceChangeIndicator change={data.change24h} />}
      </div>
      <BalanceDisplay />
    </div>
  );
}
