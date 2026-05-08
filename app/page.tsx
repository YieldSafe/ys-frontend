"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useVaultBalance } from "../hooks/useVaultBalance";
import { formatUnits } from "ethers";
import { 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Globe, 
  BarChart3,
  ExternalLink,
  ChevronDown,
  Coins,
  TrendingUp,
  Wallet
} from "lucide-react";
import { Logo } from "../components/ui/Icons";
import { AppNavbar } from "../components/ui/AppNavbar";

const Github = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
);

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("opacity-100", "translate-y-0"); el.classList.remove("opacity-0", "translate-y-8"); obs.unobserve(el); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

export default function HomePage() {
  const { isConnected, address } = useAppKitAccount();
  const { open } = useAppKit();

  const r1 = useReveal(), r2 = useReveal(), r3 = useReveal();

  return (
    <div className="min-h-screen selection:bg-primary selection:text-white bg-background text-foreground overflow-hidden">
      <AppNavbar isConnected={isConnected} address={address} open={open} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="max-w-xl transition-all duration-1000 opacity-0 translate-y-8 text-center lg:text-left mx-auto lg:mx-0" ref={r1}>
            <div className="inline-flex items-center justify-center lg:justify-start gap-2 px-3 py-1 rounded-lg bg-success/10 text-success text-xs font-bold uppercase tracking-widest mb-8">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Live on Base Mainnet
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight text-foreground">
              Your USDC should <span className="text-primary">never sit idle.</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-muted-foreground mb-10 leading-relaxed font-medium">
              Institutional-grade DeFi yields made accessible. Deposit USDC and earn predictable returns powered by battle-tested smart contracts and automated strategies.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => { if(!isConnected) open(); else window.location.href="/app"; }}
                className="btn-primary !px-8 !py-4 text-base group shadow-lg shadow-primary/25"
              >
                Start Saving
              </button>
              <a href="#how" className="w-full sm:w-auto">
                <button className="btn-outline !px-8 !py-4 text-base w-full">
                  How it Works
                </button>
              </a>
            </div>
          </div>

          {/* Right Side Visuals */}
          <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:h-[600px] flex items-center justify-center mt-12 lg:mt-0">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square bg-gradient-to-br from-success/20 to-primary/20 blur-[100px] rounded-full pointer-events-none -z-10" />
            
            {/* Main Mockup Card */}
            <div className="premium-card p-8 w-full max-w-md shadow-2xl relative z-10 animate-[float_6s_ease-in-out_infinite] rotate-3 lg:rotate-6">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Balance</div>
                  <div className="text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">$124,500.00</div>
                </div>
                <div className="bg-primary text-white text-sm font-bold px-3 py-1 rounded-md">
                  +4.2% APY
                </div>
              </div>

              <div className="h-40 w-full relative mb-8">
                <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path 
                    d="M0 80 Q 25 70, 50 50 T 100 20" 
                    fill="none" 
                    stroke="var(--primary)" 
                    strokeWidth="3"
                  />
                  <path 
                    d="M0 80 Q 25 70, 50 50 T 100 20 L 100 100 L 0 100 Z" 
                    fill="url(#gradientFill)" 
                  />
                  <defs>
                    <linearGradient id="gradientFill" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-xs text-muted-foreground mb-1">30D Yield</div>
                  <div className="text-success font-bold text-lg">+$486.23</div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-xs text-muted-foreground mb-1">Projected 1Y</div>
                  <div className="text-foreground font-bold text-lg">+$5,474.00</div>
                </div>
              </div>
            </div>
            
            {/* Small accent circle */}
            <div className="absolute bottom-10 left-10 w-12 h-12 bg-success rounded-full blur-md opacity-60 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 border-y border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-8">
            Trusted by institutions, built for everyone
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="premium-card !p-6 flex items-center justify-center gap-4 hover:border-primary transition-colors cursor-default">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-bold text-foreground">Powered by Aave V3</p>
                <p className="text-xs text-muted-foreground">Deep liquidity for lending.</p>
              </div>
            </div>
            <div className="premium-card !p-6 flex items-center justify-center gap-4 hover:border-primary transition-colors cursor-default">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Lock className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-bold text-foreground">Non-Custodial</p>
                <p className="text-xs text-muted-foreground">You control your keys.</p>
              </div>
            </div>
            <div className="premium-card !p-6 flex items-center justify-center gap-4 hover:border-primary transition-colors cursor-default">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Globe className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-bold text-foreground">Audited Contracts</p>
                <p className="text-xs text-muted-foreground">Open-source & verified.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="how-it-works" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20 transition-all duration-1000 opacity-0 translate-y-8" ref={r2}>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Simple, automated yield.</h2>
            <p className="text-lg text-muted-foreground font-medium">Skip the complex DeFi strategies. We automate the routing and compounding so you can focus on the returns.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 transition-all duration-1000 opacity-0 translate-y-8" ref={r3}>
            <div className="premium-card !p-10 flex flex-col justify-between bg-gradient-to-br from-card to-primary/5 text-center sm:text-left">
              <div className="flex flex-col items-center sm:items-start">
                <div className="w-12 h-12 rounded-lg bg-white border border-border shadow-sm flex items-center justify-center text-primary mb-6">
                  <Wallet className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Deposit USDC</h3>
                <p className="text-muted-foreground leading-relaxed">Connect your wallet and deposit USDC in one click. No lock-ups, no minimums.</p>
              </div>
            </div>
            
            <div className="premium-card !p-10 flex flex-col justify-between bg-gradient-to-br from-card to-success/5 text-center sm:text-left">
              <div className="flex flex-col items-center sm:items-start">
                <div className="w-12 h-12 rounded-lg bg-white border border-border shadow-sm flex items-center justify-center text-success mb-6">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Earn Automatically</h3>
                <p className="text-muted-foreground leading-relaxed">Our smart contracts constantly scan lending markets to find the most efficient yield, automatically compounding your returns daily.</p>
              </div>
              <div className="mt-8 flex items-center justify-center sm:justify-start gap-3">
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-border shadow-sm text-sm font-bold">
                  <div className="w-2 h-2 rounded-full bg-primary" /> USDC
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-border shadow-sm text-sm font-bold">
                  <div className="w-2 h-2 rounded-full bg-success" /> aUSDC
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2 premium-card !p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div className="max-w-xl flex flex-col items-center md:items-start">
                <div className="w-12 h-12 rounded-lg bg-white border border-border shadow-sm flex items-center justify-center text-foreground mb-6">
                  <Coins className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Withdraw Anytime</h3>
                <p className="text-muted-foreground leading-relaxed">Your capital remains yours. Withdraw your initial deposit plus all accumulated yield at any moment with zero exit fees.</p>
              </div>
              <Link href="/app">
                <button className="btn-primary !px-8 !py-4 whitespace-nowrap shadow-md">
                  View Vaults
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-16">
            <div className="max-w-xs">
              <div className="flex items-center gap-3 mb-6">
                <Logo />
                <span className="font-bold text-xl tracking-tight text-foreground">YieldSave</span>
              </div>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">Institutional-grade DeFi savings built for everyone. Predictable yields on your stablecoins powered by proven protocols.</p>
            </div>

            <div className="grid grid-cols-2 gap-16">
              <div>
                <h5 className="font-bold text-foreground mb-6">Protocol</h5>
                <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                  <li><a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a></li>
                  <li><a href="#markets" className="hover:text-primary transition-colors">Markets</a></li>
                  <li><a href="#governance" className="hover:text-primary transition-colors">Governance</a></li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-foreground mb-6">Resources</h5>
                <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                  <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                  <li><a href="https://github.com/emdevelopa/ys-frontend" target="_blank" className="hover:text-primary transition-colors">GitHub</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-medium text-muted-foreground">
            <p>© {new Date().getFullYear()} YieldSave Protocol. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-foreground">Twitter</a>
              <a href="#" className="hover:text-foreground">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
