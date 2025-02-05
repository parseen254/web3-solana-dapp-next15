import { useEffect, useState, useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getBalance, type BalanceData } from "@/app/actions/getBalance";

interface BalanceState {
  data: BalanceData | null;
  isLoading: boolean;
  error: Error | null;
  lastUpdated: number | null;
}

export function useBalance(pollingInterval = 10000) {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const [state, setState] = useState<BalanceState>({
    data: null,
    isLoading: false,
    error: null,
    lastUpdated: null,
  });

  const fetchBalance = useCallback(async () => {
    if (!connected || !publicKey) return;

    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const data = await getBalance(publicKey.toString(), connection.rpcEndpoint);
      setState({
        data,
        isLoading: false,
        error: null,
        lastUpdated: Date.now(),
      });
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err : new Error("Failed to fetch balance"),
        isLoading: false,
      }));
    }
  }, [connected, publicKey, connection]);

  useEffect(() => {
    fetchBalance();
    if (!connected || !publicKey) return;

    const interval = setInterval(fetchBalance, pollingInterval);
    return () => clearInterval(interval);
  }, [fetchBalance, connected, publicKey, pollingInterval]);

  return {
    ...state,
    refetch: fetchBalance
  };
}
