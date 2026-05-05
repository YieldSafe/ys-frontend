"use client";
import React from "react";
import Link from "next/link";
import { Logo, SunIcon, MoonIcon, DepositIcon, WithdrawIcon, EarnIcon, StatsIcon } from "./Icons";

export type Tab = "deposit" | "withdraw" | "rewards" | "stats";

interface AppNavbarProps {
  tab: Tab;
  setTab: (tab: Tab) => void;
  isConnected: boolean;
  address?: string;
  open: () => void;
  theme: string;
  setTheme: (theme: string) => void;
}

export const AppNavbar = ({
  tab,
  setTab,
  isConnected,
  address,
  open,
  theme,
  setTheme,
}: AppNavbarProps) => {
  const shortAddr = (addr: string) => addr.slice(0, 6) + "..." + addr.slice(-4);

  const navTab = (id: Tab, label: string, icon: React.ReactNode) => (
    <button
      className={`relative flex items-center gap-2 px-6 h-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
        tab === id
          ? "text-teal bg-white/[0.03]"
          : "text-muted hover:text-primary hover:bg-white/[0.01]"
      }`}
      onClick={() => setTab(id)}
    >
      {icon}
      <span className="hidden lg:inline">{label}</span>
      {tab === id && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-teal shadow-[0_0_15px_rgba(0,245,255,0.8)]" />
      )}
    </button>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] nav-glass h-20 px-6">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 group">
          <Logo />
          <span className="font-display font-black text-2xl tracking-tight hidden sm:block">
            YIELD<span className="text-teal">SAFE</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center h-full mx-8">
          {navTab("deposit", "Deposit", <DepositIcon />)}
          {navTab("withdraw", "Withdraw", <WithdrawIcon />)}
          {navTab("rewards", "Rewards", <EarnIcon />)}
          <div className="w-px h-8 bg-border mx-2" />
          {navTab("stats", "Analytics", <StatsIcon />)}
        </div>

        <div className="flex items-center gap-4">
          <button
            className="p-3 rounded-2xl bg-white/[0.02] border border-border hover:border-teal transition-all text-secondary"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          {isConnected && address ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 bg-white/[0.03] border border-border rounded-2xl px-5 py-2.5 font-mono text-sm">
                <div className="w-2 h-2 rounded-full bg-teal animate-pulse shadow-[0_0_10px_#00F5FF]" />
                <span className="text-primary">{shortAddr(address)}</span>
              </div>
              <button
                onClick={() => open()}
                className="hidden lg:flex btn-outline !py-2.5 !px-6 !text-xs border-danger/30 text-danger hover:bg-danger/10 hover:border-danger hover:text-danger"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={() => open()}
              className="btn-gradient !py-2.5 !px-8 !text-xs"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
