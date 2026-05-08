"use client";
import React from "react";
import { formatUnits } from "ethers";
import { useAaveApr } from "../../hooks/useAaveApr";

interface StatsGridProps {
  vaultBalance: bigint | null;
  isLoadingVaultBalance: boolean;
}

export const StatsGrid = ({
  vaultBalance,
  isLoadingVaultBalance,
}: StatsGridProps) => {
  const { apr, isLoading: isLoadingApr } = useAaveApr();

  const fmt = (val: bigint | null) =>
    val
      ? parseFloat(formatUnits(val, 6)).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 6,
        })
      : "0.00";

  const aprDisplay = isLoadingApr ? "…" : (apr ?? "—");

  return (
    <div className="space-y-4">
      {[
        {
          val: isLoadingVaultBalance ? "…" : `$${fmt(vaultBalance)}`,
          label: "Total Vault TVL",
          cls: "text-primary",
        },
        {
          val: aprDisplay,
          label: "Current Variable APR",
          cls: "text-teal",
        },
      ].map((stat, i) => (
        <div
          key={i}
          className="flex justify-between items-center p-5 bg-white/[0.01] border border-white/[0.03] rounded-2xl hover:bg-white/[0.03] transition-all"
        >
          <div className="text-[10px] uppercase tracking-[0.2em] font-black text-muted">
            {stat.label}
          </div>
          <div className={`text-xl font-black font-display uppercase tracking-tight ${stat.cls}`}>
            {stat.val} {stat.label.includes("TVL") ? "USDC" : ""}
          </div>
        </div>
      ))}
    </div>
  );
};