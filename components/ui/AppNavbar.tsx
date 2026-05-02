"use client";
import React from "react";
import Link from "next/link";
import { Logo, SunIcon, MoonIcon } from "./Icons";

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
      className={`app-nav-tab relative flex items-center gap-[0.4rem] px-[0.5rem] sm:px-[0.8rem] md:px-[1.1rem] h-full text-xs font-semibold uppercase tracking-[0.06em] cursor-pointer border-none bg-transparent font-body whitespace-nowrap transition-colors duration-200 ${
        tab === id
          ? "active text-[var(--text-primary)]"
          : "text-[var(--text-micro)] hover:text-[var(--text-primary)]"
      }`}
      onClick={() => setTab(id)}
    >
      <span className="[&_svg]:w-4 [&_svg]:h-4 [&_svg]:fill-current flex-shrink-0">
        {icon}
      </span>
      <span className="max-md:hidden">{label}</span>
    </button>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center px-4 md:px-8 h-[60px] bg-[var(--bg-nav-app)] backdrop-blur-[14px] border-b border-[var(--border)] gap-1 md:gap-0">
      <Link
        href="/"
        className="font-display font-extrabold text-xl text-[var(--text-primary)] flex items-center gap-2 no-underline mr-1 sm:mr-2 md:mr-8"
      >
        <Logo /> <span className="hidden sm:inline">YieldSafe</span>
      </Link>

      <div className="flex items-center gap-0 h-full flex-1 md:flex-none justify-center">
        {navTab(
          "deposit",
          "Deposit",
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>,
        )}
        {navTab(
          "withdraw",
          "Withdraw",
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>,
        )}
        {navTab(
          "rewards",
          "Rewards",
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <rect x="2" y="3" width="20" height="18" rx="2" />
            <path d="M2 9h20M10 3v18" />
          </svg>,
        )}
        <div className="w-px h-6 bg-[var(--border)] mx-1 md:mx-2" />
        {navTab(
          "stats",
          "Stats",
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>,
        )}
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-2 md:gap-3">
        {isConnected && address ? (
          <>
            <div className="flex items-center gap-1.5 md:gap-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-full px-2 md:px-3 py-[0.4rem] font-mono text-[10px] sm:text-xs md:text-sm text-[var(--text-primary)]">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500" />
              {shortAddr(address)}
            </div>
            <button
              className="hidden sm:inline-flex items-center gap-2 px-[0.9rem] py-[0.35rem] rounded-full bg-transparent text-teal border-[1.5px] border-teal text-xs font-semibold cursor-pointer transition-all hover:bg-[var(--glow-teal)]"
              onClick={() => open()}
            >
              Disconnect
            </button>
          </>
        ) : (
          <button
            className="inline-flex items-center gap-2 px-3 md:px-5 py-1.5 md:py-2 rounded-full bg-teal text-white font-semibold text-xs md:text-sm cursor-pointer border-none transition-all hover:shadow-[0_0_30px_rgba(0,222,200,0.4)]"
            onClick={() => open()}
          >
            Connect
          </button>
        )}
        <button
          className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-full w-8 h-8 md:w-9 md:h-9 cursor-pointer flex items-center justify-center text-[var(--text-muted)] transition-all hover:border-teal hover:text-teal p-0 [&_svg]:w-[16px] md:[&_svg]:w-[18px] [&_svg]:h-[16px] md:[&_svg]:h-[18px] [&_svg]:fill-current flex-shrink-0"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </nav>
  );
};
