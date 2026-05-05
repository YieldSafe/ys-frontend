"use client";
import React from "react";
import { Tab } from "../ui/AppNavbar";
import { DepositIcon, WithdrawIcon, EarnIcon } from "../ui/Icons";

interface ActionTabsProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const ActionTabs = ({ activeTab, setActiveTab }: ActionTabsProps) => {
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "deposit", label: "Deposit", icon: <DepositIcon /> },
    { id: "withdraw", label: "Withdraw", icon: <WithdrawIcon /> },
    { id: "rewards", label: "Rewards", icon: <EarnIcon /> },
  ];

  return (
    <div className="flex p-1.5 bg-white/[0.02] border border-white/[0.05] rounded-[20px] mb-10 w-full sm:w-fit mx-auto">
      {tabs.map((t) => (
        <button
          key={t.id}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-10 py-3 rounded-[14px] text-xs font-black uppercase tracking-widest transition-all duration-300 ${
            activeTab === t.id
              ? "bg-teal text-black shadow-[0_0_20px_rgba(0,245,255,0.4)]"
              : "text-muted hover:text-primary hover:bg-white/[0.02]"
          }`}
          onClick={() => setActiveTab(t.id)}
        >
          {t.icon}
          <span className="hidden xs:inline">{t.label}</span>
        </button>
      ))}
    </div>
  );
};
