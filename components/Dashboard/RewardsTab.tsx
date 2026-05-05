"use client";
import React from "react";
import { EarnIcon } from "../ui/Icons";

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
    <div className="py-6">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-teal/10 rounded-2xl flex items-center justify-center text-teal mx-auto mb-6 border border-teal/20">
          <EarnIcon />
        </div>
        <h2 className="text-3xl font-black mb-2 uppercase tracking-tight">Yield Rewards</h2>
        <p className="text-secondary text-sm font-medium">
          Rewards are automatically compounded into your vault balance every block.
        </p>
      </div>

      <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 mb-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
          <EarnIcon />
        </div>
        
        <div className="text-[10px] uppercase tracking-[0.3em] font-black text-muted mb-4">
          Accrued Yield (Live Profit)
        </div>
        <div className="text-5xl font-black text-teal mb-2 font-display tracking-tight">
          ${fmt(accruedYield)}
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-wider">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Increasing
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center p-5 bg-white/[0.01] border border-white/[0.03] rounded-2xl">
          <span className="text-xs uppercase tracking-widest font-black text-muted">Share Balance</span>
          <span className="text-lg font-black font-display tracking-tight text-primary">
            {isLoadingUserShares ? "…" : fmt(userShares)} <span className="text-xs text-muted">aUSDC</span>
          </span>
        </div>
        <div className="p-4 text-center">
          <p className="text-[10px] text-muted tracking-widest uppercase font-bold">
            Live compounding via Aave V3 Liquidity Pool
          </p>
        </div>
      </div>
    </div>
  );
};
