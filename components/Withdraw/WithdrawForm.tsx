"use client";
import React, { useState, useEffect } from "react";
import { formatUnits, parseUnits } from "ethers";
import { usePreviewWithdraw } from "../../hooks/usePreviewWithdraw";
import { useWithdraw } from "../../hooks/useWithdraw";

const USDC_DECIMALS = 6;

interface WithdrawFormProps {
  userShares: bigint | null;
  userDeposits: bigint | null;
  onSuccess: () => void;
  isConnected: boolean;
}

export const WithdrawForm = ({
  userShares,
  userDeposits,
  onSuccess,
  isConnected,
}: WithdrawFormProps) => {
  const [withdrawAmt, setWithdrawAmt] = useState("");
  const [withdrawPreview, setWithdrawPreview] = useState<bigint | null>(null);

  const { previewByShares, isPreviewingWithdraw } = usePreviewWithdraw();
  const { submitWithdraw, isWithdrawing } = useWithdraw();

  useEffect(() => {
    if (!withdrawAmt || !isConnected) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (withdrawPreview !== null) setWithdrawPreview(null);
      return;
    }
    try {
      const shares = parseUnits(withdrawAmt, USDC_DECIMALS);
      previewByShares(shares).then(setWithdrawPreview);
    } catch (e) {
      // Handle invalid input gracefully
    }
  }, [withdrawAmt, isConnected, previewByShares, withdrawPreview]);

  const handleWithdraw = async () => {
    if (!withdrawAmt) return;
    const shares = parseUnits(withdrawAmt, USDC_DECIMALS);
    const success = await submitWithdraw(shares);
    if (success) {
      setWithdrawAmt("");
      onSuccess();
    }
  };

  const fmt = (val: bigint | null) =>
    val
      ? parseFloat(formatUnits(val, USDC_DECIMALS)).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 6,
        })
      : "0.00";

  // Calculate yield accurately based on principal proportion
  const getYieldInfo = () => {
    if (!withdrawPreview || !withdrawAmt || !userShares || !userDeposits) return { yield: 0, fee: 0 };
    
    const sharesToWithdraw = parseUnits(withdrawAmt, USDC_DECIMALS);
    const grossAssets = parseFloat(formatUnits(withdrawPreview, USDC_DECIMALS));
    
    // Proportional principal calculation
    // principalForShares = (sharesToWithdraw / totalShares) * totalDeposits
    const totalShares = parseFloat(formatUnits(userShares, USDC_DECIMALS));
    const totalDeposits = parseFloat(formatUnits(userDeposits, USDC_DECIMALS));
    
    const principalForShares = (parseFloat(withdrawAmt) / totalShares) * totalDeposits;
    const yieldAmount = Math.max(0, grossAssets - principalForShares);
    const feeAmount = yieldAmount * 0.05;
    
    return { yield: yieldAmount, fee: feeAmount };
  };

  const { yield: calcYield, fee: calcFee } = getYieldInfo();

  const labelCls = "text-[var(--text-muted)] text-sm";
  const valueCls = "font-mono font-bold text-sm text-[var(--text-primary)]";
  const infoRow = "flex justify-between items-center py-2";

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display text-xl font-bold">Withdraw Assets</h3>
        <div className="text-xs font-mono text-[var(--text-muted)] bg-[var(--bg-elevated)] px-2 py-1 rounded">
          Shares: {userShares ? formatUnits(userShares, USDC_DECIMALS) : "0"}
        </div>
      </div>

      <div className="relative mb-6">
        <input
          type="number"
          min="0"
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
          placeholder="0.00"
          className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-3 md:py-4 text-xl md:text-2xl font-mono focus:outline-none focus:border-gold transition-all pr-24"
          value={withdrawAmt}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "" || parseFloat(val) >= 0) setWithdrawAmt(val);
          }}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <button
            className="text-[0.65rem] font-bold uppercase tracking-wider text-gold bg-orange-500/10 px-2 py-1 rounded hover:brightness-110"
            onClick={() =>
              setWithdrawAmt(formatUnits(userShares || BigInt(0), USDC_DECIMALS))
            }
          >
            MAX
          </button>
          <span className="font-bold text-sm text-[var(--text-muted)]">
            aUSDC
          </span>
        </div>
      </div>

      <div className="bg-[var(--bg-elevated)] rounded-xl p-4 mb-6">
        <div className="mt-1">
          <div className={infoRow}>
            <span className={labelCls}>You will receive</span>
            <span className={valueCls}>
              {isPreviewingWithdraw
                ? "…"
                : withdrawPreview !== null
                ? fmt(withdrawPreview)
                : "—"}{" "}
              USDC
            </span>
          </div>
          <div className={infoRow}>
            <span className={labelCls}>Yield earned</span>
            <span className={`${valueCls} text-teal`}>
              {calcYield > 0
                ? `+${calcYield.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`
                : "—"}{" "}
              USDC
            </span>
          </div>
          <div className={infoRow}>
            <span className={labelCls}>Fee (5% of yield)</span>
            <span className={`${valueCls} text-danger`}>
              {calcFee > 0
                ? `−${calcFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`
                : "—"}{" "}
              USDC
            </span>
          </div>
          <div className={infoRow}>
            <span className={labelCls}>Network cost</span>
            <span className={valueCls}>$0.08</span>
          </div>
        </div>
      </div>

      <button
        className="w-full py-3 md:py-4 rounded-xl bg-transparent text-gold border-2 border-gold font-bold text-base md:text-lg cursor-pointer transition-all hover:bg-orange-500/5 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleWithdraw}
        disabled={isWithdrawing || !withdrawAmt || parseFloat(withdrawAmt) <= 0}
      >
        {isWithdrawing ? "Withdrawing..." : "Withdraw aUSDC"}
      </button>

      <p className="text-[var(--text-micro)] text-center mt-4 leading-relaxed">
        Withdrawals are processed instantly. Your shares will be burned and the
        underlying USDC + yield will be sent to your wallet.
      </p>
    </div>
  );
};
