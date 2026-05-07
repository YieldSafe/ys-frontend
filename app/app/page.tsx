"use client";
import { useState, useEffect, useCallback } from "react";
import { useAppKitAccount, useAppKit } from "@reown/appkit/react";
import { formatUnits, parseUnits } from "ethers";
import { DashboardIcon, StatsIcon, EarnIcon } from "../../components/ui/Icons";

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
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("theme") ?? "dark";
    return "dark";
  });

  const [usdcBalance, setUsdcBalance] = useState<bigint | null>(null);
  const [userShares, setUserShares] = useState<bigint | null>(null);
  const [userBalance, setUserBalance] = useState<bigint | null>(null);
  const [userDeposits, setUserDeposits] = useState<bigint | null>(null);
  const [vaultBalance, setVaultBalance] = useState<bigint | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number>(0.9921);

  const { address, isConnected } = useAppKitAccount();
  const { open } = useAppKit();

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

  const handleRefresh = useCallback(async () => {
    // Add a small delay to allow the chain/indexer to catch up
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await refreshData();
  }, [refreshData]);

  useEffect(() => {
    const init = async () => {
      await refreshData();
    };
    init();
  }, [refreshData]);

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
      <div className="min-h-screen selection:bg-teal selection:text-black">
        <AppNavbar
          tab={tab}
          setTab={setTab}
          isConnected={isConnected}
          address={address}
          open={open}
          theme={theme}
          setTheme={setTheme}
        />
        <div className="fixed inset-0 mesh-bg z-0" />
        
        <div className="relative z-10 pt-32 flex items-center justify-center p-6 min-h-screen">
          <div className="glass-panel p-12 md:p-16 text-center max-w-xl w-full shadow-2xl">
            <div className="w-20 h-20 bg-teal/10 rounded-[32px] flex items-center justify-center text-teal mx-auto mb-10 border border-teal/20">
              <DashboardIcon />
            </div>
            <h1 className="text-4xl font-black mb-4 tracking-tight uppercase">Ready to Earn?</h1>
            <p className="text-secondary text-lg mb-10 font-medium">
              Securely connect your wallet to access your non-custodial yield dashboard.
            </p>
            <button
              className="btn-gradient w-full !text-lg !py-5"
              onClick={() => open()}
            >
              Connect Securely
            </button>
            <div className="mt-10 flex justify-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-micro">
              <span>Mainnet Security</span>
              <span>•</span>
              <span>Zero Fees</span>
              <span>•</span>
              <span>Instant Exit</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen selection:bg-teal selection:text-black">
      <AppNavbar
        tab={tab}
        setTab={setTab}
        isConnected={isConnected}
        address={address}
        open={open}
        theme={theme}
        setTheme={setTheme}
      />
      
      <div className="fixed inset-0 mesh-bg z-0" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
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
          <div className="space-y-12">
            <BalanceCards
              usdcBalance={usdcBalance}
              userBalance={userBalance}
              userShares={userShares}
              isLoadingUsdcBalance={isLoadingUsdcBalance}
              isLoadingUserBalance={isLoadingUserBalance}
              isLoadingUserShares={isLoadingUserShares}
            />

            <div className="grid lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-7">
                <div className="glass-panel p-10 border-white/[0.05]">
                  <ActionTabs activeTab={tab} setActiveTab={setTab} />
                  
                  <div className="mt-10">
                    {tab === "deposit" && (
                      <DepositForm
                        usdcBalance={usdcBalance}
                        exchangeRate={exchangeRate}
                        onSuccess={handleRefresh}
                        isConnected={isConnected}
                      />
                    )}
                    {tab === "withdraw" && (
                      <WithdrawForm
                        userShares={userShares}
                        userDeposits={userDeposits}
                        onSuccess={handleRefresh}
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
                </div>
              </div>

              <div className="lg:col-span-5 space-y-12">
                <div className="glass-panel p-10 border-teal/10">
                  <h3 className="text-xl font-black mb-6 uppercase tracking-widest flex items-center gap-3">
                    <StatsIcon /> Network Pulse
                  </h3>
                  <StatsGrid
                    vaultBalance={vaultBalance}
                    isLoadingVaultBalance={isLoadingVaultBalance}
                  />
                </div>
                
                <div className="glass-panel p-10 border-gold/10">
                  <h3 className="text-xl font-black mb-6 uppercase tracking-widest flex items-center gap-3">
                    <EarnIcon /> Protocol Status
                  </h3>
                  <div className="space-y-4 text-sm font-medium text-secondary">
                    <div className="flex justify-between items-center p-4 bg-white/[0.02] rounded-xl border border-white/[0.05]">
                      <span>Protocol Fee</span>
                      <span className="text-primary font-bold">5% (Yield Only)</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/[0.02] rounded-xl border border-white/[0.05]">
                      <span>Network</span>
                      <span className="text-teal font-bold">Base Sepolia</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/[0.02] rounded-xl border border-white/[0.05]">
                      <span>Exit Liquidity</span>
                      <span className="text-teal font-bold">Instant ✓</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
