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
import { AppNavbar } from "../../components/ui/AppNavbar";
import { Sidebar, Tab } from "../../components/ui/Sidebar";
import { Logo } from "../../components/ui/Icons";
import { Menu } from "lucide-react";
import { DepositForm } from "../../components/Deposit/DepositForm";
import { WithdrawForm } from "../../components/Withdraw/WithdrawForm";

const USDC_DECIMALS = 6;

export default function AppPage() {
  const [tab, setTab] = useState<Tab>("deposit");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [usdcBalance, setUsdcBalance] = useState<bigint | null>(null);
  const [userShares, setUserShares] = useState<bigint | null>(null);
  const [userBalance, setUserBalance] = useState<bigint | null>(null);
  const [userDeposits, setUserDeposits] = useState<bigint | null>(null);
  const [vaultBalance, setVaultBalance] = useState<bigint | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number>(0.9921);

  const { address, isConnected } = useAppKitAccount();
  const { open } = useAppKit();

  const { refetchUsdcBalance } = useUsdcBalance();
  const { refetchUserShares } = useUserShares();
  const { refetchUserBalance } = useUserBalance();
  const { refetchUserDeposits } = useUserDeposits();
  const { refetchVaultBalance } = useVaultBalance();
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
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await refreshData();
  }, [refreshData]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshData();
  }, [refreshData]);

  const fmt = (val: bigint | null) =>
    val
      ? parseFloat(formatUnits(val, USDC_DECIMALS)).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "0.00";

  // Dummy analytics data based on Figma
  const totalYield = userBalance && userDeposits ? userBalance - userDeposits : null;

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavbar
          isConnected={isConnected}
          address={address}
          open={open}
        />
        <div className="pt-32 flex items-center justify-center p-6 min-h-screen relative overflow-hidden">
          <div className="fintech-grid" />
          <div className="premium-card text-center max-w-md w-full shadow-lg relative z-10">
            <h1 className="text-2xl font-bold mb-3">Ready to Earn?</h1>
            <p className="text-muted-foreground mb-8">
              Connect your wallet to access your non-custodial yield dashboard.
            </p>
            <button
              className="btn-primary w-full"
              onClick={() => open()}
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar tab={tab} setTab={(t) => { setTab(t); setIsSidebarOpen(false); }} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 overflow-y-auto relative flex flex-col">
        <div className="fintech-grid" />
        
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-40">
           <div className="flex items-center gap-3">
             <Logo />
             <span className="font-bold text-lg tracking-tight text-foreground">YieldSave</span>
           </div>
           <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-muted-foreground hover:text-foreground">
             <Menu className="w-6 h-6" />
           </button>
        </div>

        <div className="p-4 sm:p-8 lg:p-12 flex-1 relative z-10">
        {tab === "deposit" ? (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Top Stats Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Balance Card */}
              <div className="lg:col-span-2 premium-card flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Total Portfolio Balance
                    </p>
                    <div className="bg-success/10 text-success text-xs font-bold px-3 py-1 rounded-md flex items-center gap-1">
                      <span>+14.2% APY</span>
                    </div>
                  </div>
                  <h2 className="text-5xl font-bold text-foreground">
                    ${fmt(userBalance)}
                  </h2>
                </div>
                <div className="mt-8 flex justify-between items-end">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Yield Earned</p>
                    <p className="text-2xl font-bold text-success">
                      +${totalYield !== null && totalYield > 0 ? fmt(totalYield) : "0.00"}
                    </p>
                  </div>
                  {/* Mock Chart Area */}
                  <div className="w-1/2 h-16 flex items-end gap-1 opacity-80">
                    {[30, 45, 25, 60, 40, 75, 50, 90].map((h, i) => (
                      <div key={i} className="flex-1 bg-primary rounded-t-sm" style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Analytics Overview */}
              <div className="premium-card flex flex-col">
                <h3 className="text-lg font-bold text-foreground mb-6">Analytics Overview</h3>
                <div className="space-y-6 flex-1">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current APY</p>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-foreground">14.2%</p>
                      <div className="w-16 h-8 flex items-end gap-1">
                        <div className="flex-1 bg-success rounded-t-sm h-[40%]"></div>
                        <div className="flex-1 bg-success rounded-t-sm h-[70%]"></div>
                        <div className="flex-1 bg-success rounded-t-sm h-[100%]"></div>
                      </div>
                    </div>
                  </div>
                  <div className="h-px bg-border"></div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Vault TVL</p>
                    <p className="text-2xl font-bold text-foreground">${fmt(vaultBalance)}</p>
                  </div>
                  <div className="h-px bg-border"></div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Earnings This Month</p>
                    <p className="text-2xl font-bold text-success">+$0.00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Deposit & Withdraw Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="premium-card p-0 overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h3 className="text-lg font-bold">Deposit</h3>
                </div>
                <div className="p-6">
                  <DepositForm
                    usdcBalance={usdcBalance}
                    exchangeRate={exchangeRate}
                    onSuccess={handleRefresh}
                    isConnected={isConnected}
                  />
                </div>
              </div>
              <div className="premium-card p-0 overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h3 className="text-lg font-bold">Withdraw</h3>
                </div>
                <div className="p-6">
                  <WithdrawForm
                    userShares={userShares}
                    userDeposits={userDeposits}
                    onSuccess={handleRefresh}
                    isConnected={isConnected}
                  />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="premium-card">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Recent Activity</h3>
                <button className="text-primary text-sm font-semibold hover:underline">View All</button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-success/20 text-success flex items-center justify-center">
                      ↓
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Deposit to Vault</p>
                      <p className="text-xs text-muted-foreground">Today, 14:30</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">+50,000 USDC</p>
                    <p className="text-xs text-muted-foreground">Confirmed</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                      ◈
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Yield Distribution</p>
                      <p className="text-xs text-muted-foreground">Yesterday</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-success">+$142.50</p>
                    <p className="text-xs text-muted-foreground">Added</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p>Section Under Construction</p>
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
