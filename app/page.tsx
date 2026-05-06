"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useVaultBalance } from "../hooks/useVaultBalance";
import { formatUnits } from "ethers";
import { 
  ChevronDown, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Lock, 
  Globe, 
  BarChart3,
  ExternalLink
} from "lucide-react";
import { Logo, SunIcon, MoonIcon } from "../components/ui/Icons";

const Github = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
);

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function CountUp({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = end / 60;
        const id = setInterval(() => {
          start += step;
          if (start >= end) { setVal(end); clearInterval(id); }
          else setVal(Math.floor(start * 100) / 100);
        }, 16);
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return (
    <span ref={ref} className="tabular-nums font-bold">
      {prefix}{typeof end === "number" && end % 1 !== 0 ? val.toFixed(2) : val.toLocaleString()}{suffix}
    </span>
  );
}

function FAQCard({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-card ${open ? "open" : ""}`}>
      <button className="faq-header" onClick={() => setOpen(!open)}>
        <span className="flex-1 pr-4">{q}</span>
        <ChevronDown className={`w-5 h-5 text-teal transition-transform duration-500 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className="faq-body">
        <p className="text-secondary leading-relaxed font-medium">{a}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("theme") ?? "dark";
    return "dark";
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (typeof window !== "undefined") localStorage.setItem("theme", theme);
  }, [theme]);

  const { isConnected, address } = useAppKitAccount();
  const { open } = useAppKit();
  const { refetchVaultBalance } = useVaultBalance();
  const [liveVaultBalance, setLiveVaultBalance] = useState<bigint | null>(null);

  useEffect(() => {
    refetchVaultBalance().then(setLiveVaultBalance);
  }, [refetchVaultBalance]);

  const shortAddr = (addr: string) => addr.slice(0, 6) + "..." + addr.slice(-4);

  const r1 = useReveal(), r2 = useReveal(), r3 = useReveal(), r4 = useReveal(),
        r5 = useReveal(), r6 = useReveal();

  return (
    <div className="min-h-screen selection:bg-teal selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] nav-glass h-20 px-6">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-4 group">
            <Logo />
            <span className="font-display font-black text-2xl tracking-tighter hidden sm:block">
              YIELD<span className="text-teal">SAFE</span>
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-muted">
            <a href="#how" className="hover:text-teal transition-all">Protocol</a>
            <a href="#stats" className="hover:text-teal transition-all">Analytics</a>
            <a href="#security" className="hover:text-teal transition-all">Security</a>
            <a href="#faq" className="hover:text-teal transition-all">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-3 rounded-2xl bg-white/[0.02] border border-border hover:border-teal transition-all text-secondary"
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
            
            {isConnected ? (
              <div className="hidden sm:flex items-center gap-3 bg-white/[0.03] border border-border rounded-2xl px-5 py-2.5 font-mono text-xs">
                <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                {shortAddr(address!)}
              </div>
            ) : (
              <button onClick={() => open()} className="btn-gradient !py-2.5 !px-8 !text-xs">Connect</button>
            )}
            
            <Link href="/app">
              <button className="btn-outline !py-2.5 !px-8 !text-xs">App</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="mesh-bg" />
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20 filter grayscale blur-[2px]">
          <Image 
            src="/home/solodev/.gemini/antigravity/brain/f99b1b99-35fc-4d8c-a0f8-8a7cf1c92773/hero_background_1778005575225.png" 
            alt="YieldSafe Hero" 
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid lg:grid-cols-2 gap-16 items-center">
          <div className="reveal visible">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-teal text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <Zap className="w-4 h-4 fill-teal" />
              Next-Gen Liquidity Aggregator
            </div>
            
            <h1 className="text-7xl md:text-9xl font-black leading-[0.85] mb-10 tracking-tighter">
              DEPOSIT.<br />
              EARN.<br />
              <span className="text-teal text-glow">SAFE.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-secondary mb-12 max-w-xl leading-relaxed font-medium">
              Maximize your USDC yield with institutional-grade security. Non-custodial, audited, and powered by Aave V3.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/app">
                <button className="btn-gradient !px-12 !py-6 text-lg group">
                  Enter Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
              </Link>
              <a href="#how">
                <button className="btn-outline !px-12 !py-6 text-lg">Protocol Paper</button>
              </a>
            </div>

            <div className="stats-grid-container mt-24 reveal visible">
              <div className="stat-box">
                <div className="stat-value text-teal"><CountUp end={4.8} suffix="%" /></div>
                <div className="stat-label">Variable APY</div>
              </div>
              <div className="stat-box">
                <div className="stat-value text-primary">
                  {liveVaultBalance !== null ? (
                    <CountUp end={parseFloat(formatUnits(liveVaultBalance, 6))} prefix="$" />
                  ) : (
                    <CountUp end={2.4} prefix="$" suffix="M" />
                  )}
                </div>
                <div className="stat-label">Total Vault TVL</div>
              </div>
              <div className="stat-box">
                <div className="stat-value text-primary font-black uppercase tracking-widest text-xs">Verified On Base</div>
                <div className="stat-label">Mainnet Security</div>
              </div>
            </div>
          </div>

          {/* Right Side Visuals */}
          <div className="relative flex flex-col items-center justify-center min-h-[500px] lg:h-[700px] w-full">
            {/* Animated Chart Card */}
            <div className="relative lg:absolute lg:top-0 lg:right-0 glass-panel p-10 w-full max-w-[400px] animate-[float_6s_ease-in-out_infinite] border-teal/20 z-20">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] font-black text-muted mb-2">Earnings Growth</div>
                  <div className="text-4xl font-black text-teal tracking-tighter">+$1,420.69</div>
                </div>
                <div className="p-3 bg-teal/10 rounded-2xl text-teal border border-teal/20">
                  <BarChart3 className="w-8 h-8" />
                </div>
              </div>
              <div className="h-40 w-full relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path 
                    d="M0 80 Q 25 70, 50 40 T 100 20" 
                    fill="none" 
                    stroke="url(#chartGradientLarge)" 
                    strokeWidth="4"
                    className="animate-[drawPath_3s_ease-out_infinite]"
                  />
                  <defs>
                    <linearGradient id="chartGradientLarge" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#00F5FF" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Floating data dots */}
                <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-teal rounded-full animate-pulse shadow-[0_0_10px_#00F5FF]" />
              </div>
            </div>

            {/* Security Shield Card */}
            <div className="relative lg:absolute lg:bottom-0 lg:left-0 glass-panel p-10 w-full max-w-[400px] mt-8 lg:mt-0 animate-[float_8s_ease-in-out_infinite_reverse] border-white/[0.1] z-10">
              <div className="flex items-center gap-8">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-teal/30 blur-2xl animate-pulse rounded-full" />
                  <div className="relative w-24 h-24 bg-white/[0.03] border border-teal/40 rounded-[32px] flex items-center justify-center text-teal shadow-[inset_0_0_20px_rgba(0,245,255,0.1)]">
                    <ShieldCheck className="w-12 h-12" />
                  </div>
                </div>
                <div>
                  <div className="text-lg font-black uppercase tracking-widest mb-2">Vault Secure</div>
                  <div className="text-[11px] text-muted font-bold uppercase tracking-[0.2em] leading-relaxed">
                    Institutional Grade<br />
                    Aave V3 Protocol
                  </div>
                </div>
              </div>
            </div>

            {/* Background Accent for Mobile */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] aspect-square bg-teal/5 blur-[120px] rounded-full pointer-events-none -z-10" />
          </div>
        </div>
      </section>

      {/* Protocol Features */}
      <section id="how" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-8 reveal" ref={r1}>
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-7xl font-black mb-6">Built for<br />Efficiency.</h2>
              <p className="text-secondary text-xl font-medium">We strip away the complexity of DeFi, giving you direct access to professional yield strategies.</p>
            </div>
            <div className="pb-4">
              <a href="https://aave.com/docs" target="_blank" className="text-teal font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:underline">
                Explore Aave Documentation <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 reveal" ref={r2}>
            {[
              { icon: <Zap className="w-8 h-8" />, title: "Real-time Yield", desc: "Every block counts. Watch your balance grow in real-time as Aave distributes interest." },
              { icon: <Lock className="w-8 h-8" />, title: "Non-Custodial", desc: "You maintain 100% ownership. Your funds never leave your control through our audited contracts." },
              { icon: <Globe className="w-8 h-8" />, title: "Base Powered", desc: "Experience lightning-fast transactions and near-zero gas fees on the Base L2 network." },
            ].map((feature, i) => (
              <div key={i} className="feature-card group">
                <div className="w-16 h-16 rounded-2xl bg-teal/10 flex items-center justify-center text-teal mb-8 group-hover:scale-110 group-hover:bg-teal group-hover:text-black transition-all duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-2xl mb-4">{feature.title}</h3>
                <p className="text-secondary font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="py-32 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="glass-panel p-12 md:p-20 border-teal/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal/5 blur-[100px] rounded-full -mr-48 -mt-48" />
            
            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
              <div className="reveal" ref={r3}>
                <h2 className="text-5xl md:text-7xl font-black mb-10">Security First.</h2>
                <div className="space-y-10">
                  <div className="flex gap-6">
                    <div className="w-10 h-10 rounded-full bg-teal flex-shrink-0 flex items-center justify-center text-black">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold mb-3 tracking-wide">AAVE V3 CORE</h4>
                      <p className="text-secondary font-medium">Built on the industry-leading Aave V3 protocol, secured by billions in collateral.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-10 h-10 rounded-full bg-teal flex-shrink-0 flex items-center justify-center text-black">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold mb-3 tracking-wide">IMMUTABLE LOGIC</h4>
                      <p className="text-secondary font-medium">No admin backdoors. The contract logic is permanent and verifiable on BaseScan.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative reveal" ref={r4}>
                <div className="glass-panel !bg-white/[0.03] p-10 border-white/[0.05] text-center">
                  <div className="text-teal font-black text-xs uppercase tracking-widest mb-10">Smart Contract Verification</div>
                  <div className="w-32 h-32 mx-auto mb-10 relative">
                    <div className="absolute inset-0 bg-teal/20 blur-2xl rounded-full animate-pulse" />
                    <ShieldCheck className="w-full h-full text-teal relative z-10" />
                  </div>
                  <div className="text-2xl font-bold mb-4 uppercase">100% Verified</div>
                  <p className="text-muted text-sm font-medium">YieldSafe contracts are public, open-source, and verified on Base Sepolia.</p>
                  <a href="https://base-sepolia.blockscout.com/address/0x01a991c5b234211390613acc2be1104037600106?tab=read_write_contract" target="_blank" className="inline-block mt-6 text-teal text-xs font-black tracking-widest hover:underline">VIEW ON EXPLORER ↗</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 reveal" ref={r5}>
            <h2 className="text-5xl md:text-7xl font-black mb-6">FAQ.</h2>
            <p className="text-secondary text-xl font-medium">Everything you need to know about the protocol.</p>
          </div>

          <div className="faq-wrapper reveal" ref={r6}>
            <FAQCard q="Is there a lock-up period for my deposits?" a="Absolutely not. You can withdraw your principal and all accrued yield at any moment. The protocol is designed for maximum liquidity." />
            <FAQCard q="How does YieldSafe generate interest?" a="Your USDC is automatically supplied to Aave V3, the world's most trusted decentralized lending market. You earn interest paid by borrowers on the Aave platform." />
            <FAQCard q="What are the fees?" a="We believe in fair incentives. YieldSafe takes a small 5% fee exclusively from the yield generated. Your original deposit (principal) is never touched by fees." />
            <FAQCard q="Is my crypto safe?" a="Your funds are held in the YieldSafe vault contract, which interacts directly with Aave V3. We never have access to your private keys or your funds." />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-16 mb-24">
            <div className="max-w-sm">
              <div className="flex items-center gap-4 mb-8">
                <Logo />
                <span className="font-display font-black text-2xl tracking-tighter">YIELD<span className="text-teal">SAFE</span></span>
              </div>
              <p className="text-muted font-medium mb-10">The next-generation non-custodial yield engine. Empowering the future of decentralized finance.</p>
              <div className="flex gap-6">
                <a href="https://github.com/emdevelopa/ys-frontend" target="_blank" className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-border flex items-center justify-center text-muted hover:text-teal hover:border-teal transition-all"><Github className="w-5 h-5" /></a>
                <a href="https://aave.com/docs" target="_blank" className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-border flex items-center justify-center text-muted hover:text-teal hover:border-teal transition-all"><Globe className="w-5 h-5" /></a>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-16 lg:gap-24">
              <div>
                <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-8">Protocol</h5>
                <ul className="space-y-5 text-sm font-bold text-muted">
                  <li><a href="#how" className="hover:text-teal transition-all">Architecture</a></li>
                  <li><a href="#security" className="hover:text-teal transition-all">Security</a></li>
                  <li><a href="https://aave.com/docs" target="_blank" className="hover:text-teal transition-all">Aave Docs</a></li>
                </ul>
              </div>
              <div>
                <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-8">Ecosystem</h5>
                <ul className="space-y-5 text-sm font-bold text-muted">
                  <li><a href="https://github.com/emdevelopa/ys-frontend" target="_blank" className="hover:text-teal transition-all flex items-center gap-2">GitHub <ExternalLink className="w-3 h-3" /></a></li>
                  <li><a href="https://base-sepolia.blockscout.com/address/0x01a991c5b234211390613acc2be1104037600106?tab=read_write_contract" target="_blank" className="hover:text-teal transition-all">Explorer</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-micro">
            <p>© {new Date().getFullYear()} YieldSafe Protocol. Handcrafted by emdevelopa.</p>
            <div className="flex gap-10">
              <a href="#" className="hover:text-primary">Legal</a>
              <a href="#" className="hover:text-primary">Privacy</a>
              <a href="#" className="hover:text-primary">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
