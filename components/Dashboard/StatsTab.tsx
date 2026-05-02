"use client";
import React from "react";

interface StatsTabProps {
  vaultBalance: bigint | null;
  userBalance: bigint | null;
  userShares: bigint | null;
  isLoadingVaultBalance: boolean;
  isLoadingUserBalance: boolean;
  isLoadingUserShares: boolean;
  address?: string;
  fmt: (val: bigint | null) => string;
}

export const StatsTab = ({
  vaultBalance,
  userBalance,
  userShares,
  isLoadingVaultBalance,
  isLoadingUserBalance,
  isLoadingUserShares,
  address,
  fmt,
}: StatsTabProps) => {
  const shortAddr = (addr: string) => addr.slice(0, 6) + "..." + addr.slice(-4);

  return (
    <div className="max-w-[700px] mx-auto px-4 md:px-6 py-8 md:py-12">
      <h2 className="font-display text-[1.75rem] text-center mb-2 text-[var(--text-primary)]">
        Protocol Statistics
      </h2>
      <p className="text-[var(--text-muted)] text-center mb-8">
        Live data from the YieldSafe vault on Base Sepolia
      </p>
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl mb-4 overflow-hidden shadow-sm">
        <div className="flex justify-between items-center px-4 md:px-6 py-4 border-b border-[var(--border)]">
          <span className="font-semibold text-[var(--text-primary)]">Vault Overview</span>
          <a
            href={`https://sepolia.basescan.org/address/${process.env.NEXT_PUBLIC_YIELD_SAVE_CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-teal no-underline hover:underline"
          >
            ↗ BaseScan
          </a>
        </div>
        {[
          { label: "Annual Percentage Rate", val: "4.8%", cls: "text-teal" },
          {
            label: "Total USDC Deposited",
            val: isLoadingVaultBalance ? "…" : `$${fmt(vaultBalance)}`,
            cls: "text-gold",
          },
          { label: "Active Depositors", val: "4,207", cls: "" },
          { label: "Protocol Fee", val: "5% on yield only", cls: "" },
        ].map((row, i, arr) => (
          <div
            key={i}
            className={`flex justify-between items-center px-4 md:px-6 py-4 ${
              i < arr.length - 1 ? "border-b border-[var(--border)]" : ""
            }`}
          >
            <span className="text-[var(--text-muted)] text-sm">{row.label}</span>
            <span className={`font-mono font-bold ${row.cls}`}>{row.val}</span>
          </div>
        ))}
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl overflow-hidden shadow-sm">
        <div className="px-4 md:px-6 py-4 border-b border-[var(--border)] font-semibold text-[var(--text-primary)]">
          Your Position
        </div>
        {[
          {
            label: "Current Value",
            val: isLoadingUserBalance ? "…" : `${fmt(userBalance)} USDC`,
            cls: "text-gold",
          },
          {
            label: "Share Balance",
            val: isLoadingUserShares ? "…" : `${fmt(userShares)} aUSDC`,
            cls: "",
          },
          {
            label: "Wallet Address",
            val: address ? shortAddr(address) : "—",
            cls: "text-[0.8rem] text-[var(--text-primary)]",
          },
        ].map((row, i, arr) => (
          <div
            key={i}
            className={`flex justify-between items-center px-4 md:px-6 py-4 ${
              i < arr.length - 1 ? "border-b border-[var(--border)]" : ""
            }`}
          >
            <span className="text-[var(--text-muted)] text-sm">{row.label}</span>
            <span className={`font-mono font-bold ${row.cls}`}>{row.val}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-[var(--text-micro)] text-center mt-6 text-[var(--text-muted)]">
        APR reflects current Aave V3 USDC supply rate. Rates fluctuate with
        market conditions.
      </p>
    </div>
  );
};
