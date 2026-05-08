"use client";
import React from "react";
import Link from "next/link";
import { Logo } from "./Icons";
import { ThemeToggle } from "./ThemeToggle";

interface AppNavbarProps {
  isConnected: boolean;
  address?: string;
  open: () => void;
}

export const AppNavbar = ({
  isConnected,
  address,
  open,
}: AppNavbarProps) => {
  const shortAddr = (addr: string) => addr.slice(0, 6) + "..." + addr.slice(-4);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-background/80 backdrop-blur-xl border-b border-border h-20 px-6">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 group">
          <Logo />
          <span className="font-bold text-xl tracking-tight hidden sm:block text-foreground">
            YieldSave
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
          <Link href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</Link>
          <Link href="#markets" className="hover:text-foreground transition-colors">Markets</Link>
          <Link href="#governance" className="hover:text-foreground transition-colors">Governance</Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {isConnected && address ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-muted px-4 py-2 font-mono text-sm font-semibold rounded-lg border border-border">
                <div className="w-2 h-2 rounded-full bg-success shadow-sm" />
                <span className="text-foreground">{shortAddr(address)}</span>
              </div>
              <button
                onClick={() => open()}
                className="btn-outline !py-2 !px-4 !text-sm border-danger text-danger hover:bg-danger/10 hover:border-danger hover:text-danger"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={() => open()}
              className="btn-primary !py-2 !px-6 !text-sm"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
