"use client";
import React from "react";
import { Sun, Moon, ArrowUpRight, TrendingUp, Wallet, ArrowDownCircle, BarChart3, HelpCircle, LayoutDashboard, Landmark } from "lucide-react";
// logo component
export const Logo = () => (
  <div className="relative flex items-center justify-center text-primary">
    <Landmark className="w-8 h-8 stroke-[2]" />
  </div>
);

export const SunIcon = () => <Sun className="w-5 h-5" />;
export const MoonIcon = () => <Moon className="w-5 h-5" />;
export const EarnIcon = () => <TrendingUp className="w-5 h-5" />;
export const WithdrawIcon = () => <ArrowDownCircle className="w-5 h-5" />;
export const DepositIcon = () => <Wallet className="w-5 h-5" />;
export const StatsIcon = () => <BarChart3 className="w-5 h-5" />;
export const ExternalLinkIcon = () => <ArrowUpRight className="w-4 h-4" />;
export const QuestionIcon = () => <HelpCircle className="w-5 h-5" />;
export const DashboardIcon = () => <LayoutDashboard className="w-5 h-5" />;
