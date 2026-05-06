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
  const { approve } = useApprove();
  const { submitDeposit } = useDeposit();
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


  const [flowStatus, setFlowStatus] = useState<"idle" | "approving" | "depositing">("idle");

  const handleDepositFlow = async () => {
    if (!depositAmt || parseFloat(depositAmt) <= 0) return;
    const assets = parseUnits(depositAmt, USDC_DECIMALS);
    
    try {
      // 1. Check Allowance
      const allowance = await refetchAllowance();
      if (allowance !== null && allowance < assets) {
        setFlowStatus("approving");
        const appSuccess = await approve(assets);
        if (!appSuccess) {
          setFlowStatus("idle");
          return;
        }
        await refetchAllowance();
      }
      
      // 2. Deposit
      setFlowStatus("depositing");
      const depSuccess = await submitDeposit(assets);
      if (depSuccess) {
        setDepositAmt("");
        onSuccess();
      }
    } catch (err) {
      console.error("Deposit flow failed", err);
    } finally {
      setFlowStatus("idle");
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
          min="0"
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
          placeholder="0.00"
          className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-3 md:py-4 text-xl md:text-2xl font-mono focus:outline-none focus:border-teal transition-all pr-20"
          value={depositAmt}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "" || parseFloat(val) >= 0) setDepositAmt(val);
          }}
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

      <button
        className="w-full py-3 md:py-4 rounded-xl bg-teal text-white font-bold text-base md:text-lg cursor-pointer border-none transition-all hover:shadow-[0_0_20px_rgba(0,245,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleDepositFlow}
        disabled={flowStatus !== "idle" || !depositAmt || parseFloat(depositAmt) <= 0}
      >
        {flowStatus === "approving" ? "1/2 Approving USDC..." : flowStatus === "depositing" ? "2/2 Depositing..." : "Deposit USDC"}
      </button>

      <p className="text-[var(--text-micro)] text-center mt-4 leading-relaxed">
        By depositing, you agree to the protocol terms. Your USDC will be
        deployed to Aave V3. You can withdraw anytime.
      </p>
    </div>
  );
};
