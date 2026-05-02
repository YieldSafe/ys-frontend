"use client";
import React from "react";
import { formatUnits } from "ethers";

interface BalanceCardsProps {
  usdcBalance: bigint | null;
  userBalance: bigint | null;
  userShares: bigint | null;
  isLoadingUsdcBalance: boolean;
  isLoadingUserBalance: boolean;
  isLoadingUserShares: boolean;
}

export const BalanceCards = ({
  usdcBalance,
  userBalance,
  userShares,
  isLoadingUsdcBalance,
  isLoadingUserBalance,
  isLoadingUserShares,
}: BalanceCardsProps) => {
  const fmt = (val: bigint | null) =>
    val
      ? parseFloat(formatUnits(val, 6)).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 6,
        })
      : "0.00";

  const fmtWallet = (val: bigint | null) =>
    val
      ? parseFloat(formatUnits(val, 6)).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "0.00";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      {/* Wallet Balance */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-24 h-24 bg-teal opacity-5 rounded-bl-full pointer-events-none" />
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-[var(--text-micro)] uppercase tracking-wider font-semibold mb-1">
              Your Wallet
            </p>
            <h3 className="font-display text-[1.75rem] md:text-[2.25rem] font-extrabold flex items-baseline gap-2">
              {isLoadingUsdcBalance ? (
                <span className="animate-pulse">...</span>
              ) : (
                fmtWallet(usdcBalance)
              )}
              <span className="text-xs md:text-sm font-body font-normal text-[var(--text-muted)]">
                USDC
              </span>
            </h3>
          </div>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[var(--glow-teal)] flex items-center justify-center text-teal">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="w-5 h-5 md:w-6 md:h-6"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
        </div>
        <div className="flex gap-3 md:gap-4">
          <button className="flex-1 py-2 px-3 md:px-4 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[0.7rem] md:text-xs font-semibold hover:border-teal hover:text-teal transition-all">
            Buy USDC
          </button>
          <button className="flex-1 py-2 px-3 md:px-4 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[0.7rem] md:text-xs font-semibold hover:border-teal hover:text-teal transition-all">
            Send
          </button>
        </div>
      </div>

      {/* Vault Position */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5 md:p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gold opacity-5 rounded-bl-full pointer-events-none" />
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[var(--text-micro)] uppercase tracking-wider font-semibold mb-1">
              Your Savings
            </p>
            <h3 className="font-display text-[1.75rem] md:text-[2.25rem] font-extrabold flex items-baseline gap-2 text-gold">
              {isLoadingUserBalance ? (
                <span className="animate-pulse">...</span>
              ) : (
                fmt(userBalance)
              )}
              <span className="text-xs md:text-sm font-body font-normal text-[var(--text-muted)]">
                USDC
              </span>
            </h3>
          </div>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-gold">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="w-5 h-5 md:w-6 md:h-6"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between font-mono text-xs text-[var(--text-muted)]">
            <span>Share Balance:</span>
            <span>
              {isLoadingUserShares ? "…" : fmt(userShares)} aUSDC
            </span>
          </div>
          <div className="h-1 bg-[var(--border)] rounded mt-2 mb-2 overflow-hidden">
            <div
              className="h-full bg-gold transition-all duration-1000"
              style={{ width: userBalance && userBalance > BigInt(0) ? "65%" : "0%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
