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

  const labelCls = "text-muted-foreground text-sm";
  const valueCls = "font-mono font-bold text-sm text-foreground";
  const infoRow = "flex justify-between items-center py-2";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
          Shares: {userShares ? formatUnits(userShares, USDC_DECIMALS) : "0"}
        </div>
      </div>

      <div className="relative">
        <input
          type="number"
          min="0"
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
          placeholder="0.00"
          className="premium-input text-2xl pr-24 py-4 font-mono font-bold"
          value={withdrawAmt}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "" || parseFloat(val) >= 0) setWithdrawAmt(val);
          }}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <button
            className="text-[0.65rem] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded hover:bg-primary/20 transition-colors"
            onClick={() =>
              setWithdrawAmt(formatUnits(userShares || BigInt(0), USDC_DECIMALS))
            }
          >
            MAX
          </button>
          <span className="font-bold text-sm text-muted-foreground">
            aUSDC
          </span>
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-4">
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
            <span className={`${valueCls} text-success`}>
              {calcYield > 0
                ? `+${calcYield.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`
                : "—"}{" "}
              USDC
            </span>
          </div>
          <div className={infoRow}>
            <span className={labelCls}>Fee (5% of yield)</span>
            <span className={`${valueCls} text-red-500`}>
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
        className="btn-outline w-full !py-4 text-lg"
        onClick={handleWithdraw}
        disabled={isWithdrawing || !withdrawAmt || parseFloat(withdrawAmt) <= 0}
      >
        {isWithdrawing ? "Withdrawing..." : "Withdraw aUSDC"}
      </button>

      <p className="text-xs text-muted-foreground text-center leading-relaxed px-4">
        Withdrawals are processed instantly. Your shares will be burned and the
        underlying USDC + yield will be sent to your wallet.
      </p>
    </div>
  );
};
