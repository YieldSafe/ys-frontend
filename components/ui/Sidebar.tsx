"use client";

import React from "react";
import Link from "next/link";
import { Logo, DashboardIcon, DepositIcon, EarnIcon, StatsIcon } from "./Icons";
import { ThemeToggle } from "./ThemeToggle";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { LogOut } from "lucide-react";

export type Tab = "deposit" | "withdraw" | "rewards" | "stats";

interface SidebarProps {
  tab: Tab;
  setTab: (tab: Tab) => void;
}

export const Sidebar = ({ tab, setTab }: SidebarProps) => {
  const { address, isConnected } = useAppKitAccount();
  const { open } = useAppKit();

  const shortAddr = (addr: string) => addr.slice(0, 6) + "..." + addr.slice(-4);

  const navItem = (id: Tab, label: string, icon: React.ReactNode) => (
    <button
      onClick={() => setTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-semibold ${
        tab === id
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="w-64 border-r border-border h-screen sticky top-0 bg-card flex flex-col hidden lg:flex">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3">
          <Logo />
          <span className="font-bold text-xl tracking-tight text-foreground">
            YieldSave
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItem("deposit", "Dashboard", <DashboardIcon />)}
        {navItem("withdraw", "Portfolio", <DepositIcon />)}
        {navItem("rewards", "Activity", <EarnIcon />)}
        {navItem("stats", "Settings", <StatsIcon />)}
      </nav>

      <div className="p-6 border-t border-border space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>

        {isConnected && address ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-success/50 flex-shrink-0" />
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-foreground truncate">
                  {shortAddr(address)}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-success" />
                  <span className="text-xs text-muted-foreground">Connected</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => open()}
              className="w-full flex items-center justify-center gap-2 py-2 mt-2 border border-border rounded-lg text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={() => open()}
            className="w-full btn-primary !py-2.5 !text-sm"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
};
