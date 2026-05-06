"use client";
import React from "react";
import { formatUnits } from "ethers";
import { Wallet, Coins, TrendingUp } from "lucide-react";

interface BalanceCardsProps {
  usdcBalance: bigint | null;
  userBalance: bigint | null;
  userShares: bigint | null;
  isLoadingUsdcBalance: boolean;
  isLoadingUserBalance: boolean;
  isLoadingUserShares: boolean;
}

const USDC_DECIMALS = 6;

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
      ? parseFloat(formatUnits(val, USDC_DECIMALS)).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 4,
        })
      : "0.00";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        {
          label: "Wallet Balance",
          val: isLoadingUsdcBalance ? "..." : `$${fmt(usdcBalance)}`,
          icon: <Wallet className="w-6 h-6 text-teal" />,
          color: "border-teal/20",
          glow: "shadow-[0_10px_40px_-10px_rgba(0,245,255,0.15)]",
        },
        {
          label: "Vault Balance",
          val: isLoadingUserBalance ? "..." : `$${fmt(userBalance)}`,
          icon: <Coins className="w-6 h-6 text-gold" />,
          color: "border-gold/20",
          glow: "shadow-[0_10px_40px_-10px_rgba(255,215,0,0.1)]",
        },
        {
          label: "Vault Shares",
          val: isLoadingUserShares ? "..." : fmt(userShares),
          icon: <TrendingUp className="w-6 h-6 text-purple-400" />,
          color: "border-purple-400/20",
          glow: "shadow-[0_10px_40px_-10px_rgba(168,85,247,0.1)]",
        },
      ].map((card, i) => (
        <div
          key={i}
          className={`glass-panel p-8 flex items-center gap-6 border ${card.color} ${card.glow} hover:bg-white/[0.03] transition-all`}
        >
          <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center">
            {card.icon}
          </div>
          <div>
            <div className="text-3xl font-black mb-1 font-display tracking-tight uppercase flex items-baseline gap-2">
              {card.val}
              <span className="text-sm font-bold opacity-40">
                {card.label.includes("Shares") ? "aUSDC" : "USDC"}
              </span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-black text-muted">
              {card.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
