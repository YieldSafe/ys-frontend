"use client";
import React from "react";
import { Tab } from "../ui/AppNavbar";

interface ActionTabsProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const ActionTabs = ({ activeTab, setActiveTab }: ActionTabsProps) => {
  const tabs: { id: Tab; label: string }[] = [
    { id: "deposit", label: "Deposit" },
    { id: "withdraw", label: "Withdraw" },
    { id: "rewards", label: "Rewards" },
  ];

  return (
    <div className="flex gap-1 p-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl mb-8 w-fit mx-auto">
      {tabs.map((t) => (
        <button
          key={t.id}
          className={`px-4 sm:px-6 md:px-8 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all ${
            activeTab === t.id
              ? "bg-[var(--bg-surface)] text-teal shadow-sm"
              : "text-[var(--text-micro)] hover:text-[var(--text-muted)]"
          }`}
          onClick={() => setActiveTab(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
};
