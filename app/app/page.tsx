"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
);
const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
);

type Tab = "deposit" | "withdraw" | "rewards" | "stats";

export default function AppPage() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") ?? "dark";
    }
    return "dark";
  });
  const [connected, setConnected] = useState(false);
  const [tab, setTab] = useState<Tab>("deposit");
  const [depositAmt, setDepositAmt] = useState("");
  const [withdrawAmt, setWithdrawAmt] = useState("");
  const [approved, setApproved] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; type: string; msg: string }[]>([]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const addToast = (type: string, msg: string) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, type, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000);
  };

  const handleApprove = () => {
    addToast("pending", "Approving USDC...");
    setTimeout(() => { setApproved(true); addToast("success", "USDC Approved! ✓"); }, 2000);
  };
  const handleDeposit = () => {
    if (!depositAmt || !approved) return;
    addToast("pending", "Transaction submitted...");
    setTimeout(() => { addToast("success", "Deposit confirmed! ✓"); setDepositAmt(""); }, 2500);
  };
  const handleWithdraw = () => {
    if (!withdrawAmt) return;
    addToast("pending", "Transaction submitted...");
    setTimeout(() => { addToast("success", "Withdrawal confirmed! ✓"); setWithdrawAmt(""); }, 2500);
  };

  const Logo = () => (
    <svg width="26" height="26" viewBox="0 0 40 40"><path d="M20 4 L34 14 L34 30 Q34 36 20 38 Q6 36 6 30 L6 14 Z" fill="none" stroke="var(--accent-teal)" strokeWidth="2.5"/><path d="M16 26 L20 18 L24 26 M14 22 L20 14 L26 22" fill="none" stroke="var(--accent-teal)" strokeWidth="2" strokeLinecap="round"/></svg>
  );

  const renderContent = () => {
    if (!connected) {
      return (
        <div className="app-content">
          <div className="app-form-card" style={{ padding: "3rem 2rem", textAlign: "center", borderColor: "var(--accent-teal)", boxShadow: "0 0 40px var(--glow-teal)" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "1.25rem", animation: "glowPulse 3s ease-in-out infinite" }}>🛡️</div>
            <h2>Connect your wallet to begin</h2>
            <p className="sub" style={{ marginBottom: "1.5rem" }}>Non-custodial. Your keys, your funds.</p>
            <button className="app-full-btn primary" onClick={() => setConnected(true)}>Connect Wallet</button>
            <div className="wallet-logos"><span>MetaMask</span><span>Coinbase</span><span>WalletConnect</span></div>
          </div>
        </div>
      );
    }

    switch (tab) {
      case "deposit":
        return (
          <div className="app-content">
            <h2>Deposit USDC</h2>
            <p className="sub">Deposit USDC and earn yield automatically via Aave V3</p>
            <div className="app-form-card">
              <div className="app-input-wrap">
                <div className="icon"><svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/><text x="12" y="16" textAnchor="middle" fontSize="10" fill="currentColor" fontWeight="700">$</text></svg></div>
                <input type="number" placeholder="USDC amount" value={depositAmt} onChange={(e) => setDepositAmt(e.target.value)} />
                <button className="max-btn" onClick={() => setDepositAmt("1000")}>MAX</button>
              </div>
              {!approved ? (
                <button className="app-full-btn primary" onClick={handleApprove}>Approve USDC</button>
              ) : (
                <button className="app-full-btn primary" onClick={handleDeposit} disabled={!depositAmt}>Deposit →</button>
              )}
              <div className="app-info-rows">
                <div className="app-info-row"><span className="label">You will receive</span><span className="value">{depositAmt ? (parseFloat(depositAmt) * 0.9921).toFixed(2) : "0.00"} ysUSDC</span></div>
                <div className="app-info-row"><span className="label">Exchange rate</span><span className="value">1 USDC ≈ 0.9921 ysUSDC</span></div>
                <div className="app-info-row"><span className="label">Max transaction cost</span><span className="value">$0.12</span></div>
                <div className="app-info-row"><span className="label">Reward fee <span className="tooltip-icon">?</span></span><span className="value">5%</span></div>
              </div>
            </div>
          </div>
        );

      case "withdraw":
        return (
          <div className="app-content">
            <h2>Withdraw USDC</h2>
            <p className="sub">Redeem your ysUSDC shares for USDC + earned yield</p>
            <div className="app-form-card">
              <div className="app-input-wrap">
                <div className="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg></div>
                <input type="number" placeholder="ysUSDC amount" value={withdrawAmt} onChange={(e) => setWithdrawAmt(e.target.value)} />
                <button className="max-btn" onClick={() => setWithdrawAmt("204.82")}>MAX</button>
              </div>
              <button className="app-full-btn gold" onClick={handleWithdraw} disabled={!withdrawAmt}>Withdraw →</button>
              <div className="app-info-rows">
                <div className="app-info-row"><span className="label">You will receive</span><span className="value">{withdrawAmt ? parseFloat(withdrawAmt).toFixed(2) : "0.00"} USDC</span></div>
                <div className="app-info-row"><span className="label">Yield earned</span><span className="value text-teal">+{withdrawAmt ? (parseFloat(withdrawAmt) * 0.024).toFixed(2) : "0.00"} USDC</span></div>
                <div className="app-info-row"><span className="label">Fee (5% of yield)</span><span className="value text-danger">−{withdrawAmt ? (parseFloat(withdrawAmt) * 0.024 * 0.05).toFixed(2) : "0.00"} USDC</span></div>
                <div className="app-info-row"><span className="label">Max transaction cost</span><span className="value">$0.08</span></div>
              </div>
            </div>
          </div>
        );

      case "rewards":
        return (
          <div className="rewards-grid">
            <h2>Your Rewards</h2>
            <p className="sub">Track your yield earnings from the YieldSafe vault</p>
            <div className="reward-summary">
              <div className="card"><div className="val text-gold">$4.82</div><div className="lbl">Total Yield Earned</div></div>
              <div className="card"><div className="val text-teal">$4.58</div><div className="lbl">Net After Fee</div></div>
              <div className="card"><div className="val">4.8%</div><div className="lbl">Current APR</div></div>
            </div>
            <div className="card">
              <div style={{ padding: "0.5rem 0" }}>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Your YieldSafe Balance</div>
                <div className="balance-big" style={{ fontSize: "2rem" }}>204.82 USDC</div>
                <div style={{ marginTop: "1rem" }}>
                  <div className="breakdown-row"><span>Original Deposit:</span><span>200.00 USDC</span></div>
                  <div className="breakdown-row"><span>Yield Earned:</span><span className="text-teal">+ 4.82 USDC</span></div>
                  <div className="breakdown-row"><span>Protocol Fee (est):</span><span className="text-danger">− 0.24 USDC</span></div>
                  <div className="breakdown-row" style={{ fontWeight: 700 }}><span>Net Gain:</span><span className="text-teal">+ 4.58 USDC</span></div>
                </div>
                <div className="yield-bar"><div className="yield-bar-fill" /></div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-micro)", fontFamily: "var(--font-mono)" }}>Earning since block #21,400,000</div>
              </div>
            </div>
            <div className="card" style={{ marginTop: "1rem" }}>
              <div className="reward-history">
                <h3>Recent Activity</h3>
                <div className="reward-history-row"><span className="text-teal">+0.42 USDC yield</span><span className="date">Apr 30, 2025</span></div>
                <div className="reward-history-row"><span className="text-teal">+0.39 USDC yield</span><span className="date">Apr 29, 2025</span></div>
                <div className="reward-history-row"><span className="text-teal">+0.41 USDC yield</span><span className="date">Apr 28, 2025</span></div>
                <div className="reward-history-row"><span>Deposited 200 USDC</span><span className="date">Apr 20, 2025</span></div>
              </div>
            </div>
          </div>
        );

      case "stats":
        return (
          <div className="stats-page">
            <h2>Protocol Statistics</h2>
            <p className="sub">Live data from the YieldSafe vault on Ethereum</p>
            <div className="card" style={{ marginBottom: "1rem" }}>
              <div className="stats-header" style={{ paddingLeft: 0, paddingRight: 0 }}>
                <span style={{ fontWeight: 600 }}>Vault Overview</span>
                <a href="#" style={{ fontSize: "0.85rem" }}>↗ Etherscan</a>
              </div>
              <div className="stat-row" style={{ paddingLeft: 0, paddingRight: 0 }}><span className="stat-row-label">Annual Percentage Rate</span><span className="stat-row-val text-teal">4.8%</span></div>
              <div className="stat-row" style={{ paddingLeft: 0, paddingRight: 0 }}><span className="stat-row-label">Total USDC Deposited</span><span className="stat-row-val text-gold">$2,400,000</span></div>
              <div className="stat-row" style={{ paddingLeft: 0, paddingRight: 0 }}><span className="stat-row-label">Active Depositors</span><span className="stat-row-val">4,207</span></div>
              <div className="stat-row" style={{ paddingLeft: 0, paddingRight: 0 }}><span className="stat-row-label">Protocol Fee</span><span className="stat-row-val">5% on yield only</span></div>
              <div className="stat-row" style={{ paddingLeft: 0, paddingRight: 0, borderBottom: "none" }}><span className="stat-row-label">Vault Contract</span><span className="stat-row-val" style={{ fontSize: "0.8rem" }}>0x7a3f...8e2d</span></div>
            </div>
            <div className="card">
              <div style={{ fontWeight: 600, marginBottom: "0.75rem" }}>Your Position</div>
              <div className="stat-row" style={{ paddingLeft: 0, paddingRight: 0 }}><span className="stat-row-label">Deposited</span><span className="stat-row-val">200.00 USDC</span></div>
              <div className="stat-row" style={{ paddingLeft: 0, paddingRight: 0 }}><span className="stat-row-label">Current Value</span><span className="stat-row-val text-gold">204.82 USDC</span></div>
              <div className="stat-row" style={{ paddingLeft: 0, paddingRight: 0 }}><span className="stat-row-label">Share Balance</span><span className="stat-row-val">198.43 ysUSDC</span></div>
              <div className="stat-row" style={{ paddingLeft: 0, paddingRight: 0, borderBottom: "none" }}><span className="stat-row-label">% of Vault</span><span className="stat-row-val">0.0085%</span></div>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-micro)", textAlign: "center", marginTop: "1.5rem" }}>APR reflects current Aave V3 USDC supply rate. Rates fluctuate with market conditions.</p>
          </div>
        );
    }
  };

  return (
    <>
      <nav className="app-navbar">
        <Link href="/" className="navbar-logo" style={{ textDecoration: "none" }}><Logo /> YieldSafe</Link>
        <div className="app-nav-tabs">
          <button className={`app-nav-tab ${tab === "deposit" ? "active" : ""}`} onClick={() => setTab("deposit")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
            <span>Deposit</span>
          </button>
          <button className={`app-nav-tab ${tab === "withdraw" ? "active" : ""}`} onClick={() => setTab("withdraw")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
            <span>Withdraw</span>
          </button>
          <button className={`app-nav-tab ${tab === "rewards" ? "active" : ""}`} onClick={() => setTab("rewards")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M2 9h20M10 3v18"/></svg>
            <span>Rewards</span>
          </button>
          <div className="app-nav-sep" />
          <button className={`app-nav-tab ${tab === "stats" ? "active" : ""}`} onClick={() => setTab("stats")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            <span>Stats</span>
          </button>
        </div>
        <div className="app-navbar-right">
          {connected ? (
            <>
              <div className="addr-pill"><span className="green-dot" />0x4a3f...c9e2</div>
              <button className="btn btn-ghost" style={{ padding: "0.35rem 0.9rem", fontSize: "0.8rem" }} onClick={() => { setConnected(false); setApproved(false); setTab("deposit"); }}>Disconnect</button>
            </>
          ) : (
            <button className="btn btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem" }} onClick={() => setConnected(true)}>Connect Wallet</button>
          )}
          <button className="theme-toggle" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </nav>

      <div className="app-page">
        <div className="hero-bg" style={{ position: "fixed", inset: 0, zIndex: -1 }}>
          <div className="hero-blob1" /><div className="hero-blob2" /><div className="hero-noise" />
        </div>
        {renderContent()}
      </div>

      <div className="toast-container">
        {toasts.map((t) => (
          <div className="toast" key={t.id}>
            <span className={`toast-dot ${t.type === "pending" ? "pending" : t.type === "success" ? "success" : "error"}`} />
            {t.msg}
          </div>
        ))}
      </div>
    </>
  );
}
