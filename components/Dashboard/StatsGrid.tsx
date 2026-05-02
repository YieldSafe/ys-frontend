"use client";
import React from "react";
import { formatUnits } from "ethers";

interface StatsGridProps {
  vaultBalance: bigint | null;
  isLoadingVaultBalance: boolean;
}

export const StatsGrid = ({
  vaultBalance,
  isLoadingVaultBalance,
}: StatsGridProps) => {
  const fmt = (val: bigint | null) =>
    val
      ? parseFloat(formatUnits(val, 6)).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 6,
        })
      : "0.00";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        {
          val: isLoadingVaultBalance ? "…" : `$${fmt(vaultBalance)}`,
          label: "Total Vault TVL",
          cls: "",
        },
        { val: "4.8%", label: "Current APR", cls: "text-teal" },
        { val: "4,207", label: "Active Users", cls: "" },
        { val: "No Lockup", label: "Withdrawals", cls: "text-gold" },
      ].map((stat, i) => (
        <div
          key={i}
          className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-4 shadow-sm"
        >
          <div
            className={`font-display text-lg md:text-xl font-extrabold mb-1 ${stat.cls}`}
          >
            {stat.val}
          </div>
          <div className="text-[var(--text-micro)] uppercase tracking-wider font-semibold">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};
