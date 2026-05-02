"use client";
import React, { useState, useEffect } from "react";
import { formatUnits, parseUnits } from "ethers";
import { usePreviewDeposit } from "../../hooks/usePreviewDeposit";
import { useApprove } from "../../hooks/useApprove";
import { useDeposit } from "../../hooks/useDeposit";
import { useAllowance } from "../../hooks/useAllowance";

const USDC_DECIMALS = 6;

interface DepositFormProps {
  usdcBalance: bigint | null;
  exchangeRate: number;
  onSuccess: () => void;
  isConnected: boolean;
}

export const DepositForm = ({
  usdcBalance,
  exchangeRate,
  onSuccess,
  isConnected,
}: DepositFormProps) => {
  const [depositAmt, setDepositAmt] = useState("");
  const [depositPreview, setDepositPreview] = useState<bigint | null>(null);
  const [currentAllowance, setCurrentAllowance] = useState<bigint | null>(null);

  const { previewByAssets, isPreviewingDeposit } = usePreviewDeposit();
  const { approve, isApproving } = useApprove();
  const { submitDeposit, isDepositing } = useDeposit();
  const { refetchAllowance } = useAllowance();

  useEffect(() => {
    if (!depositAmt || !isConnected) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (depositPreview !== null) setDepositPreview(null);
      return;
    }
    const assets = parseUnits(depositAmt, USDC_DECIMALS);
    previewByAssets(assets).then(setDepositPreview);
  }, [depositAmt, isConnected, previewByAssets, depositPreview]);

  useEffect(() => {
    if (isConnected) {
      refetchAllowance().then(setCurrentAllowance);
    }
  }, [isConnected, refetchAllowance]);

  const depositAmountBigInt = depositAmt
    ? parseUnits(depositAmt, USDC_DECIMALS)
    : BigInt(0);
  const needsApproval =
    currentAllowance !== null && depositAmt
      ? currentAllowance < depositAmountBigInt
      : true;

  const handleApprove = async () => {
    if (!depositAmt) return;
    const success = await approve(depositAmountBigInt);
    if (success) {
      const newAlw = await refetchAllowance();
      setCurrentAllowance(newAlw);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmt) return;
    const success = await submitDeposit(depositAmountBigInt);
    if (success) {
      setDepositAmt("");
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

  const labelCls = "text-[var(--text-muted)] text-sm";
  const valueCls = "font-mono font-bold text-sm text-[var(--text-primary)]";
  const infoRow = "flex justify-between items-center py-2";

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display text-xl font-bold">Deposit USDC</h3>
        <div className="text-xs font-mono text-[var(--text-muted)] bg-[var(--bg-elevated)] px-2 py-1 rounded">
          Balance: {usdcBalance ? parseFloat(formatUnits(usdcBalance, USDC_DECIMALS)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
        </div>
      </div>

      <div className="relative mb-6">
        <input
          type="number"
          placeholder="0.00"
          className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-3 md:py-4 text-xl md:text-2xl font-mono focus:outline-none focus:border-teal transition-all pr-20"
          value={depositAmt}
          onChange={(e) => setDepositAmt(e.target.value)}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <button
            className="text-[0.65rem] font-bold uppercase tracking-wider text-teal bg-[var(--glow-teal)] px-2 py-1 rounded hover:brightness-110"
            onClick={() =>
              setDepositAmt(formatUnits(usdcBalance || BigInt(0), USDC_DECIMALS))
            }
          >
            MAX
          </button>
          <span className="font-bold text-sm text-[var(--text-muted)]">
            USDC
          </span>
        </div>
      </div>

      <div className="bg-[var(--bg-elevated)] rounded-xl p-4 mb-6">
        <div className="mt-1">
          <div className={infoRow}>
            <span className={labelCls}>You will receive</span>
            <span className={valueCls}>
              {isPreviewingDeposit
                ? "…"
                : depositPreview !== null
                ? fmt(depositPreview)
                : depositAmt
                ? (parseFloat(depositAmt) * exchangeRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })
                : "—"}{" "}
              aUSDC
            </span>
          </div>
          <div className={infoRow}>
            <span className={labelCls}>Exchange rate</span>
            <span className={valueCls}>
              1 USDC ≈ {exchangeRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })} aUSDC
            </span>
          </div>
          <div className={infoRow}>
            <span className={labelCls}>Max transaction cost</span>
            <span className={valueCls}>$0.12</span>
          </div>
        </div>
      </div>

      {needsApproval ? (
        <button
          className="w-full py-3 md:py-4 rounded-xl bg-teal text-white font-bold text-base md:text-lg cursor-pointer border-none transition-all hover:shadow-[0_0_20px_rgba(0,222,200,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleApprove}
          disabled={isApproving || !depositAmt || parseFloat(depositAmt) <= 0}
        >
          {isApproving ? "Approving USDC..." : "Approve USDC"}
        </button>
      ) : (
        <button
          className="w-full py-3 md:py-4 rounded-xl bg-teal text-white font-bold text-base md:text-lg cursor-pointer border-none transition-all hover:shadow-[0_0_20px_rgba(0,222,200,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleDeposit}
          disabled={isDepositing || !depositAmt || parseFloat(depositAmt) <= 0}
        >
          {isDepositing ? "Depositing..." : "Deposit"}
        </button>
      )}

      <p className="text-[var(--text-micro)] text-center mt-4 leading-relaxed">
        By depositing, you agree to the protocol terms. Your USDC will be
        deployed to Aave V3. You can withdraw anytime.
      </p>
    </div>
  );
};
