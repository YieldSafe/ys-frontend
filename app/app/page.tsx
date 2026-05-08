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
import { useRecentActivity } from "../../hooks/useRecentActivity";

// Components
import { AppNavbar } from "../../components/ui/AppNavbar";
import { Sidebar, Tab } from "../../components/ui/Sidebar";
import { Logo } from "../../components/ui/Icons";
import { Menu, ArrowUpRight, TrendingUp, Wallet, ArrowDownCircle } from "lucide-react";
import { DepositForm } from "../../components/Deposit/DepositForm";
import { WithdrawForm } from "../../components/Withdraw/WithdrawForm";

const USDC_DECIMALS = 6;

export default function AppPage() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [usdcBalance, setUsdcBalance] = useState<bigint | null>(null);
  const [userShares, setUserShares] = useState<bigint | null>(null);
  const [userBalance, setBalance] = useState<bigint | null>(null);
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
  const { activity, refetchActivity } = useRecentActivity();

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
    setBalance(ub);
    setUserDeposits(ud);
    setVaultBalance(vb);
    if (rateShares)
      setExchangeRate(parseFloat(formatUnits(rateShares, USDC_DECIMALS)));
    
    refetchActivity();
  }, [
    isConnected,
    refetchUsdcBalance,
    refetchUserShares,
    refetchUserBalance,
    refetchUserDeposits,
    refetchVaultBalance,
    previewByAssets,
    refetchActivity
  ]);

  const handleRefresh = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await refreshData();
  }, [refreshData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      refreshData();
    }, 0);
    return () => clearTimeout(timer);
  }, [refreshData]);

  const fmt = (val: bigint | null, precision = 2) =>
    val
      ? parseFloat(formatUnits(val, USDC_DECIMALS)).toLocaleString(undefined, {
          minimumFractionDigits: precision,
          maximumFractionDigits: precision,
        })
      : (0).toFixed(precision);

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

  const renderContent = () => {
    switch (tab) {
      case "dashboard":
        return (
          <div className="max-w-6xl mx-auto space-y-8 animate-fade-up">
            {/* Top Stats Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 premium-card flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Total Portfolio Balance
                    </p>
                    <div className="bg-success/10 text-success text-xs font-bold px-3 py-1 rounded-md flex items-center gap-1">
                      <span>3.35% - 3.45% APY</span>
                    </div>
                  </div>
                  <h2 className="text-5xl font-bold text-foreground">
                    ${fmt(userBalance)}
                  </h2>
                </div>
                <div className="mt-8 flex justify-between items-end">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Yield Earned</p>
                    <p className="text-2xl font-mono font-bold text-success">
                      ${totalYield !== null && totalYield > 0 ? fmt(totalYield, 6) : fmt(BigInt(0), 6)} USDC
                    </p>
                  </div>
                  <div className="w-1/2 h-16 flex items-end gap-1 opacity-80">
                    {[30, 45, 25, 60, 40, 75, 50, 90].map((h, i) => (
                      <div key={i} className="flex-1 bg-primary rounded-t-sm" style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="premium-card flex flex-col">
                <h3 className="text-lg font-bold text-foreground mb-6">Analytics Overview</h3>
                <div className="space-y-6 flex-1">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current APY</p>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-foreground">3.35% - 3.45%</p>
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
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="premium-card p-0 overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h3 className="text-lg font-bold">Deposit</h3>
                </div>
                <div className="p-6">
                  <DepositForm usdcBalance={usdcBalance} exchangeRate={exchangeRate} onSuccess={handleRefresh} isConnected={isConnected} />
                </div>
              </div>
              <div className="premium-card p-0 overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h3 className="text-lg font-bold">Withdraw</h3>
                </div>
                <div className="p-6">
                  <WithdrawForm userShares={userShares} userDeposits={userDeposits} onSuccess={handleRefresh} isConnected={isConnected} />
                </div>
              </div>
            </div>
          </div>
        );
      case "portfolio":
        return (
          <div className="max-w-6xl mx-auto space-y-8 animate-fade-up">
            <h2 className="text-3xl font-bold tracking-tight">Your Portfolio</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="premium-card flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold">Staked Balance</h3>
                    <p className="text-sm text-muted-foreground">Earning yield via Aave</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-4xl font-bold">${fmt(userBalance)}</p>
                  <p className="text-sm text-success font-medium flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" /> 
                    +{totalYield !== null && totalYield > 0 ? fmt(totalYield, 4) : "0.0000"} USDC Profit
                  </p>
                </div>
              </div>
              
              <div className="premium-card flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center text-success">
                    <ArrowDownCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold">Initial Principal</h3>
                    <p className="text-sm text-muted-foreground">Total amount deposited</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-4xl font-bold">${fmt(userDeposits)}</p>
                  <p className="text-sm text-muted-foreground">Original cost basis</p>
                </div>
              </div>
            </div>

            <div className="premium-card">
              <h3 className="text-xl font-bold mb-6">Asset Breakdown</h3>
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-left">
                  <thead className="bg-muted text-xs uppercase tracking-wider font-bold text-muted-foreground">
                    <tr>
                      <th className="px-6 py-4">Asset</th>
                      <th className="px-6 py-4">Balance</th>
                      <th className="px-6 py-4">Value (USD)</th>
                      <th className="px-6 py-4">APY</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">YS</div>
                        <span className="font-bold">YieldSave Vault (aUSDC)</span>
                      </td>
                      <td className="px-6 py-4 font-mono">{fmt(userShares, 4)} aUSDC</td>
                      <td className="px-6 py-4 font-bold">${fmt(userBalance)}</td>
                      <td className="px-6 py-4 text-success font-bold">3.35% - 3.45%</td>
                      <td className="px-6 py-4">
                        <button onClick={() => setTab("dashboard")} className="text-primary hover:underline flex items-center gap-1 font-semibold">
                          Manage <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case "activity":
        return (
          <div className="max-w-6xl mx-auto space-y-8 animate-fade-up">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold tracking-tight">Transaction History</h2>
              <button 
                onClick={refetchActivity}
                className="btn-outline !py-2 !px-4 !text-sm"
              >
                Refresh History
              </button>
            </div>
            
            <div className="premium-card p-0 overflow-hidden">
              <div className="space-y-px bg-border">
                {activity.length > 0 ? (
                  activity.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-6 bg-card hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          item.type === "deposit" ? "bg-success/20 text-success" : "bg-primary/20 text-primary"
                        }`}>
                          {item.type === "deposit" ? "↓" : "↑"}
                        </div>
                        <div>
                          <p className="font-bold text-lg capitalize">{item.type} USDC</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                            {item.status} • {item.timestamp}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-bold ${item.type === "deposit" ? "text-foreground" : "text-primary"}`}>
                          {item.type === "deposit" ? "+" : "-"}{parseFloat(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} USDC
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 font-mono">Confirmed on Base</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-card text-muted-foreground">
                    <p className="text-lg font-medium">No transactions found</p>
                    <p className="text-sm">New activity will appear here once you interact with the vault.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

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
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
