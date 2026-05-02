"use client";
import { useState, useEffect, useCallback } from "react";
import { useAppKitAccount, useAppKit } from "@reown/appkit/react";
import { formatUnits, parseUnits } from "ethers";

// Hooks
import { useUsdcBalance } from "../../hooks/useUsdcBalance";
import { useUserShares } from "../../hooks/useUserShares";
import { useUserBalance } from "../../hooks/useUserBalance";
import { useUserDeposits } from "../../hooks/useUserDeposits";
import { useVaultBalance } from "../../hooks/useVaultBalance";
import { usePreviewDeposit } from "../../hooks/usePreviewDeposit";

// Components
import { AppNavbar, Tab } from "../../components/ui/AppNavbar";
import { BalanceCards } from "../../components/Dashboard/BalanceCards";
import { StatsGrid } from "../../components/Dashboard/StatsGrid";
import { ActionTabs } from "../../components/Dashboard/ActionTabs";
import { DepositForm } from "../../components/Deposit/DepositForm";
import { WithdrawForm } from "../../components/Withdraw/WithdrawForm";
import { RewardsTab } from "../../components/Dashboard/RewardsTab";
import { StatsTab } from "../../components/Dashboard/StatsTab";

const USDC_DECIMALS = 6;

export default function AppPage() {
  const [tab, setTab] = useState<Tab>("deposit");
  const [theme, setTheme] = useState("dark");

  const [usdcBalance, setUsdcBalance] = useState<bigint | null>(null);
  const [userShares, setUserShares] = useState<bigint | null>(null);
  const [userBalance, setUserBalance] = useState<bigint | null>(null);
  const [userDeposits, setUserDeposits] = useState<bigint | null>(null);
  const [vaultBalance, setVaultBalance] = useState<bigint | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number>(0.9921);

  // AppKit Hooks
  const { address, isConnected } = useAppKitAccount();
  const { open } = useAppKit();

  // Data Fetching Hooks
  const { refetchUsdcBalance, isLoadingUsdcBalance } = useUsdcBalance();
  const { refetchUserShares, isLoadingUserShares } = useUserShares();
  const { refetchUserBalance, isLoadingUserBalance } = useUserBalance();
  const { refetchUserDeposits } = useUserDeposits();
  const { refetchVaultBalance, isLoadingVaultBalance } = useVaultBalance();
  const { previewByAssets } = usePreviewDeposit();

  const refreshData = useCallback(async () => {
    if (!isConnected) return;
    const [bal, shares, ub, ud, vb, rateShares] = await Promise.all([
      refetchUsdcBalance(),
      refetchUserShares(),
      refetchUserBalance(),
      refetchUserDeposits(),
      refetchVaultBalance(),
      previewByAssets(parseUnits("1", USDC_DECIMALS)),
    ]);
    setUsdcBalance(bal);
    setUserShares(shares);
    setUserBalance(ub);
    setUserDeposits(ud);
    setVaultBalance(vb);
    if (rateShares)
      setExchangeRate(parseFloat(formatUnits(rateShares, USDC_DECIMALS)));
  }, [
    isConnected,
    refetchUsdcBalance,
    refetchUserShares,
    refetchUserBalance,
    refetchUserDeposits,
    refetchVaultBalance,
    previewByAssets,
  ]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setTheme(saved);
    else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const fmt = (val: bigint | null) =>
    val
      ? parseFloat(formatUnits(val, USDC_DECIMALS)).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 6,
        })
      : "0.00";

  if (!isConnected) {
    return (
      <>
        <AppNavbar
          tab={tab}
          setTab={setTab}
          isConnected={isConnected}
          address={address}
          open={open}
          theme={theme}
          setTheme={setTheme}
        />
        <div className="min-h-screen pt-[60px] flex items-center justify-center p-6 relative overflow-hidden">
          {/* Ambient background */}
          <div
            className="fixed inset-0 z-[-1]"
            style={{ background: "var(--hero-bg)" }}
          >
            <div
              className="absolute rounded-full filter blur-[80px] opacity-30 w-[500px] h-[500px] top-[10%] left-[15%] animate-blobFloat"
              style={{
                background:
                  "radial-gradient(circle, rgba(0,222,200,0.25), transparent 70%)",
              }}
            />
            <div
              className="absolute rounded-full filter blur-[80px] opacity-30 w-[400px] h-[400px] bottom-[15%] right-[10%] animate-blobFloatReverse"
              style={{
                background:
                  "radial-gradient(circle, rgba(12,16,24,0.8), transparent 70%)",
              }}
            />
            <div className="hero-noise" />
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-8 md:p-12 text-center max-w-[500px] w-full shadow-2xl relative z-10">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-[var(--glow-teal)] rounded-3xl flex items-center justify-center text-teal mx-auto mb-6 md:mb-8">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="w-8 h-8 md:w-10 md:h-10"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
              Connect your wallet to begin
            </h1>
            <p className="text-[var(--text-muted)] text-base md:text-lg mb-8 md:mb-10">
              Non-custodial. Your keys, your funds.
            </p>
            <button
              className="w-full py-3 md:py-4 rounded-xl bg-teal text-white font-bold text-lg md:text-xl cursor-pointer border-none transition-all hover:shadow-[0_0_30px_rgba(0,222,200,0.4)] hover:-translate-y-px"
              onClick={() => open()}
            >
              Connect Wallet
            </button>
            <div className="mt-8 flex justify-center gap-6 text-[var(--text-micro)] uppercase tracking-widest font-semibold opacity-50">
              <span>MetaMask</span>
              <span>Coinbase</span>
              <span>WalletConnect</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AppNavbar
        tab={tab}
        setTab={setTab}
        isConnected={isConnected}
        address={address}
        open={open}
        theme={theme}
        setTheme={setTheme}
      />

      <div className="min-h-screen pt-[60px] relative">
        {/* Ambient background */}
        <div
          className="fixed inset-0 z-[-1]"
          style={{ background: "var(--hero-bg)" }}
        >
          <div
            className="absolute rounded-full filter blur-[80px] opacity-30 w-[500px] h-[500px] top-[10%] left-[15%] animate-blobFloat"
            style={{
              background:
                "radial-gradient(circle, rgba(0,222,200,0.25), transparent 70%)",
            }}
          />
          <div
            className="absolute rounded-full filter blur-[80px] opacity-30 w-[400px] h-[400px] bottom-[15%] right-[10%] animate-blobFloatReverse"
            style={{
              background:
                "radial-gradient(circle, rgba(12,16,24,0.8), transparent 70%)",
            }}
          />
          <div className="hero-noise" />
        </div>

        <main className="max-w-[1000px] mx-auto px-4 md:px-6 py-8 md:py-12">
          {tab === "stats" ? (
            <StatsTab
              vaultBalance={vaultBalance}
              userBalance={userBalance}
              userShares={userShares}
              isLoadingVaultBalance={isLoadingVaultBalance}
              isLoadingUserBalance={isLoadingUserBalance}
              isLoadingUserShares={isLoadingUserShares}
              address={address}
              fmt={fmt}
            />
          ) : (
            <>
              <BalanceCards
                usdcBalance={usdcBalance}
                userBalance={userBalance}
                userShares={userShares}
                isLoadingUsdcBalance={isLoadingUsdcBalance}
                isLoadingUserBalance={isLoadingUserBalance}
                isLoadingUserShares={isLoadingUserShares}
              />

              <ActionTabs activeTab={tab} setActiveTab={setTab} />

              <div className="max-w-[500px] mx-auto mb-16">
                {tab === "deposit" && (
                  <DepositForm
                    usdcBalance={usdcBalance}
                    exchangeRate={exchangeRate}
                    onSuccess={refreshData}
                    isConnected={isConnected}
                  />
                )}
                {tab === "withdraw" && (
                  <WithdrawForm
                    userShares={userShares}
                    onSuccess={refreshData}
                    isConnected={isConnected}
                  />
                )}
                {tab === "rewards" && (
                  <RewardsTab
                    userShares={userShares}
                    userBalance={userBalance}
                    userDeposits={userDeposits}
                    isLoadingUserShares={isLoadingUserShares}
                    fmt={fmt}
                  />
                )}
              </div>

              <StatsGrid
                vaultBalance={vaultBalance}
                isLoadingVaultBalance={isLoadingVaultBalance}
              />
            </>
          )}
        </main>
      </div>
    </>
  );
}
