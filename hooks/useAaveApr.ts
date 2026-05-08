"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Aave V3 Pool on Base Sepolia
const AAVE_POOL_ADDRESS = "0xBfC91D59fdAA134A4ED45f7B584cAf96D7792Eff";

// Only the single method we need
const AAVE_POOL_ABI = [
  "function getReserveData(address asset) view returns (tuple(uint256 configuration, uint128 liquidityIndex, uint128 currentLiquidityRate, uint128 variableBorrowIndex, uint128 currentVariableBorrowRate, uint128 currentStableBorrowRate, uint40 lastUpdateTimestamp, uint16 id, address aTokenAddress, address stableDebtTokenAddress, address variableDebtTokenAddress, address interestRateStrategyAddress, uint128 accruedToTreasury, uint128 unbacked, uint128 isolationModeTotalDebt))",
];

// RAY = 1e27 — Aave stores rates as per-second in RAY units
const RAY = BigInt("1000000000000000000000000000"); // 1e27

/**
 * Returns the live Aave USDC supply APR as a percentage string (e.g. "4.83%")
 * Refreshes every 60 seconds.
 */
export const useAaveApr = () => {
  const [apr, setApr] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const usdcAddress =
    process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS ||
    "0x036CbD53842c5426634e7929541eC2318f3dCF7e"; // Aave-issued USDC on Base Sepolia fallback

  const rpcUrl =
    process.env.NEXT_PUBLIC_LISK_TESTNET_RPC_URL ||
    "https://sepolia.base.org";

  const fetchApr = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const pool = new ethers.Contract(
        AAVE_POOL_ADDRESS,
        AAVE_POOL_ABI,
        provider,
      );

      const reserveData = await pool.getReserveData(usdcAddress);
      // currentLiquidityRate is the per-second supply rate in RAY
      const liquidityRate: bigint = reserveData.currentLiquidityRate;

      // Convert RAY per-second rate to APR %
      // APR = rate / RAY * 100  (already annualised by Aave)
      const aprPercent =
        (Number(liquidityRate) / Number(RAY)) * 100;

      setApr(
        aprPercent.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + "%",
      );
    } catch (err) {
      console.error("Failed to fetch Aave APR:", err);
      setError("unavailable");
      setApr("—");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApr();

    // Refresh every 60 seconds — Aave rates update per block but UI refresh once/min is sufficient
    const interval = setInterval(fetchApr, 60_000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { apr, isLoading, error };
};
