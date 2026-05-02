"use client";
import React from "react";

interface RewardsTabProps {
  userShares: bigint | null;
  userBalance: bigint | null;
  userDeposits: bigint | null;
  isLoadingUserShares: boolean;
  fmt: (val: bigint | null) => string;
}

export const RewardsTab = ({
  userShares,
  userBalance,
  userDeposits,
  isLoadingUserShares,
  fmt,
}: RewardsTabProps) => {
  const accruedYield =
    userBalance !== null && userDeposits !== null
      ? userBalance > userDeposits
        ? userBalance - userDeposits
        : BigInt(0)
      : BigInt(0);

  return (
    <div className="max-w-[500px] mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5 md:p-8 text-center shadow-sm relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal opacity-5 rounded-full blur-2xl" />
        <div className="w-16 h-16 bg-[var(--glow-teal)] rounded-2xl flex items-center justify-center text-teal mx-auto mb-6">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
            <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
            <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
          </svg>
        </div>
        <h2 className="font-display text-2xl font-bold mb-2">Yield Rewards</h2>
        <p className="text-[var(--text-muted)] text-sm mb-8">
          Rewards are automatically compounded into your share balance.
        </p>
        <div className="bg-[var(--bg-elevated)] rounded-xl p-4 md:p-6 mb-6">
          <div className="text-[var(--text-micro)] uppercase tracking-wider font-semibold mb-2">
            Accrued Yield (Live)
          </div>
          <div className="font-display text-3xl md:text-4xl font-extrabold text-teal mb-1">
            {fmt(accruedYield)}{" "}
            <span className="text-lg font-body font-normal">USDC</span>
          </div>
          <div className="text-xs text-green-500 font-mono">
            All-time profit
          </div>
        </div>
        <div className="mt-4 space-y-1">
          <div className="flex justify-between font-mono text-sm text-[var(--text-primary)]">
            <span>Share Balance:</span>
            <span>{isLoadingUserShares ? "…" : fmt(userShares)} aUSDC</span>
          </div>
        </div>
        <div className="h-1 bg-[var(--border)] rounded mt-4 mb-2 overflow-hidden">
          <div
            className="h-full bg-teal transition-all duration-1000"
            style={{ width: accruedYield > BigInt(0) ? "100%" : "0%" }}
          />
        </div>
        <div className="text-xs text-[var(--text-micro)] font-mono text-[var(--text-muted)]">
          Live • Updates each block
        </div>
      </div>
    </div>
  );
};
