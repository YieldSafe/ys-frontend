"use client";
import React from "react";
import { Shield, Sun, Moon, ArrowUpRight, TrendingUp, Wallet, ArrowDownCircle, BarChart3, HelpCircle, LayoutDashboard } from "lucide-react";

export const Logo = () => (
  <div className="relative flex items-center justify-center group">
    <div className="absolute inset-0 bg-teal/20 blur-xl group-hover:bg-teal/40 transition-all rounded-full" />
    <div className="relative w-10 h-10 bg-gradient-to-br from-teal to-blue-500 rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform">
      <Shield className="w-6 h-6 text-black stroke-[2.5]" />
    </div>
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
