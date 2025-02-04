"use server";

import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export type BalanceData = {
  sol: number;
  usd: number;
  change24h: number;
  timestamp: number;
};

export async function getBalance(
  publicKey: string,
  connectionUrl: string
): Promise<BalanceData> {
  const connection = new Connection(connectionUrl || "");
  const key = new PublicKey(publicKey);

  // Fetch SOL balance
  const solBalance = await connection.getBalance(key, "confirmed");
  const solAmount = solBalance / LAMPORTS_PER_SOL;

  // Fetch SOL price data from Jupiter
  const response = await fetch(
    "https://api.jup.ag/price/v2?ids=So11111111111111111111111111111111111111112&showExtraInfo=true"
  );
  const priceData = await response.json();
  const solPrice =
    priceData.data?.So11111111111111111111111111111111111111112?.price || 0;

  // Fetch 24h price change from CoinRanking
  const coinRankingResponse = await fetch(
    "https://api.coinranking.com/v2/coin/zNZHO_Sjf"
  );
  const coinRankingData = await coinRankingResponse.json();
  const priceChange = coinRankingData?.data?.coin?.change || 0;

  return {
    sol: solAmount,
    usd: solAmount * solPrice,
    change24h: priceChange / 100,
    timestamp: Date.now(),
  };
}
