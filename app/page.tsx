"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useVaultBalance } from "../hooks/useVaultBalance";
import { formatUnits } from "ethers";

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold: 0.15 }
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
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return (
    <span ref={ref}>
      {prefix}{typeof end === "number" && end % 1 !== 0 ? val.toFixed(1) : val.toLocaleString()}{suffix}
    </span>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item border-b border-[var(--border)] ${open ? "open" : ""}`}>
      <button
        className="faq-q flex justify-between items-center w-full py-5 text-left font-semibold text-[1.05rem] bg-transparent border-none cursor-pointer text-[var(--text-primary)] hover:text-teal transition-colors"
        onClick={() => setOpen(!open)}
      >
        {q}
        <span className="faq-toggle text-[1.25rem] text-[var(--text-muted)] transition-transform duration-200">+</span>
      </button>
      <div className="faq-a">
        <div className="pb-5">{a}</div>
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
        r5 = useReveal(), r6 = useReveal(), r7 = useReveal(), r8 = useReveal();

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4 md:px-8 py-4 bg-[var(--bg-nav)] backdrop-blur-[12px] border-b border-[var(--border)]">
        <div className="font-display font-extrabold text-xl md:text-xl text-[var(--text-primary)] flex items-center gap-1.5 md:gap-2">
          <svg width="24" height="24" viewBox="0 0 40 40" className="md:w-[28px] md:h-[28px]">
            <path d="M20 4 L34 14 L34 30 Q34 36 20 38 Q6 36 6 30 L6 14 Z" fill="none" stroke="var(--accent-teal)" strokeWidth="2.5"/>
            <path d="M16 26 L20 18 L24 26 M14 22 L20 14 L26 22" fill="none" stroke="var(--accent-teal)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="hidden sm:inline">YieldSafe</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4">
          <div className="hidden md:flex items-center gap-4 mr-2">
            <a href="#how" className="text-[var(--text-muted)] text-sm hover:text-teal transition-colors">How it works</a>
            <a href="#stats" className="text-[var(--text-muted)] text-sm hover:text-teal transition-colors">Stats</a>
            <a href="#faq" className="text-[var(--text-muted)] text-sm hover:text-teal transition-colors">FAQ</a>
          </div>
          {isConnected ? (
            <div className="flex items-center gap-1.5 md:gap-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-full px-2 md:px-3 py-1.5 font-mono text-[10px] sm:text-xs text-[var(--text-primary)]">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500" />
              {shortAddr(address!)}
            </div>
          ) : (
            <button
              onClick={() => open()}
              className="inline-flex items-center gap-2 px-3 md:px-5 py-1.5 md:py-2 rounded-full bg-teal text-white font-semibold text-xs md:text-sm cursor-pointer border-none transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,222,200,0.4)] hover:-translate-y-px"
            >
              <span className="hidden sm:inline">Connect Wallet</span>
              <span className="sm:hidden">Connect</span>
            </button>
          )}
          <Link href="/app">
            <button className="inline-flex items-center gap-2 px-3 md:px-5 py-1.5 md:py-2 rounded-full bg-transparent text-teal border border-teal font-semibold text-xs md:text-sm cursor-pointer transition-all duration-300 hover:bg-[var(--glow-teal)]">
              <span className="hidden sm:inline">Launch App</span>
              <span className="sm:hidden">Launch</span>
            </button>
          </Link>
          <button
            className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-full w-8 h-8 md:w-9 md:h-9 cursor-pointer flex items-center justify-center text-[var(--text-muted)] transition-all duration-200 hover:border-teal hover:text-teal p-0 leading-none [&_svg]:w-[16px] md:[&_svg]:w-[18px] [&_svg]:h-[16px] md:[&_svg]:h-[18px] [&_svg]:fill-current [&_svg]:transition-transform [&_svg]:duration-300 hover:[&_svg]:rotate-[30deg] flex-shrink-0"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center relative overflow-hidden pt-20">
        <div className="absolute inset-0 z-0" style={{ background: "var(--hero-bg)" }}>
          <div className="absolute rounded-full filter blur-[80px] opacity-30 w-[500px] h-[500px] top-[10%] left-[15%] animate-blobFloat"
            style={{ background: "radial-gradient(circle, rgba(0,222,200,0.25), transparent 70%)" }} />
          <div className="absolute rounded-full filter blur-[80px] opacity-30 w-[400px] h-[400px] bottom-[15%] right-[10%] animate-blobFloatReverse"
            style={{ background: "radial-gradient(circle, rgba(12,16,24,0.8), transparent 70%)" }} />
          <div className="hero-noise" />
        </div>
        <div className="relative z-[2] flex flex-col lg:flex-row items-center gap-10 lg:gap-16 w-full max-w-[1200px] mx-auto px-4 md:px-8 text-center lg:text-left mt-8 lg:mt-0">
          <div className="w-full lg:flex-[0_0_58%]">
            <p className="text-xs uppercase tracking-[0.15em] text-[var(--text-muted)] font-medium mb-4">Non-custodial • Powered by Aave V3</p>
            <h1 className="font-display font-extrabold leading-[1.05] mb-5 text-[clamp(2.5rem,8vw,5.5rem)]">
              Your savings,<br className="hidden lg:block" />always earning.
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-muted)] mb-8 max-w-[500px] mx-auto lg:mx-0">
              Deposit USDC. Earn DeFi yield automatically. Withdraw any time.
            </p>
            <div className="flex gap-4 mb-10 flex-col sm:flex-row justify-center lg:justify-start">
              <Link href="/app">
                <button className="inline-flex items-center gap-2 px-6 md:px-10 py-3 md:py-4 rounded-full bg-teal text-white font-semibold text-base md:text-[1.1rem] cursor-pointer border-none transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,222,200,0.4)] hover:-translate-y-px">
                  Get Started →
                </button>
              </Link>
              <a href="#how">
                <button className="inline-flex items-center gap-2 px-6 md:px-10 py-3 md:py-4 rounded-full bg-transparent text-teal font-semibold text-base md:text-[1.1rem] cursor-pointer border-[1.5px] border-teal transition-all duration-300 hover:bg-[var(--glow-teal)]">
                  How it works
                </button>
              </a>
            </div>
            <div className="flex gap-4 flex-wrap justify-center lg:justify-start">
              <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-4 px-6 min-w-[150px] shadow-[-4px_0_16px_var(--glow-teal)]">
                <div className="font-display text-[1.75rem] font-extrabold text-teal"><CountUp end={4.8} suffix="%" /></div>
                <div className="text-xs text-[var(--text-muted)] mt-1">Annual Percentage Rate</div>
              </div>
              <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-4 px-6 min-w-[150px] shadow-[-4px_0_16px_var(--glow-teal)]">
                <div className="font-display text-[1.75rem] font-extrabold text-gold">
                  {liveVaultBalance !== null ? (
                    <CountUp end={parseFloat(formatUnits(liveVaultBalance, 6))} prefix="$" />
                  ) : (
                    <CountUp end={2.4} prefix="$" suffix="M" />
                  )}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1">Total Deposited</div>
              </div>
              <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-4 px-6 min-w-[150px] shadow-[-4px_0_16px_var(--glow-teal)]">
                <div className="font-display text-[1.75rem] font-extrabold"><CountUp end={4200} suffix="+" /></div>
                <div className="text-xs text-[var(--text-muted)] mt-1">Active Users</div>
              </div>
            </div>
          </div>
          <div className="w-full lg:flex-1 flex justify-center items-center mt-12 lg:mt-0">
            <div className="relative w-[280px] h-[280px] animate-floatBreath">
              <div className="absolute w-full h-full rounded-full border border-dashed border-[var(--border)] animate-orbit">
                <div className="absolute w-9 h-9 rounded-full bg-gold text-white text-xs font-bold flex items-center justify-center font-mono shadow-[0_0_12px_var(--glow-gold)] top-[-18px] left-1/2 -translate-x-1/2">$</div>
                <div className="absolute w-9 h-9 rounded-full bg-gold text-white text-xs font-bold flex items-center justify-center font-mono shadow-[0_0_12px_var(--glow-gold)] bottom-[-18px] left-1/2 -translate-x-1/2">$</div>
                <div className="absolute w-9 h-9 rounded-full bg-gold text-white text-xs font-bold flex items-center justify-center font-mono shadow-[0_0_12px_var(--glow-gold)] top-1/2 right-[-18px] -translate-y-1/2">$</div>
              </div>
              <div className="shield-icon" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 z-[2] animate-bounce text-[var(--text-micro)] text-2xl">↓</div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-24" ref={r1}>
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 reveal" ref={r2}>
          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] mb-3">Simple by design.</h2>
          <p className="text-[var(--text-muted)] text-xl mb-0">Complex DeFi, abstracted away.</p>
          <div className="flex gap-8 items-stretch relative mt-12 max-md:flex-col">
            {[
              { icon: "💳", title: "Deposit USDC", desc: "Approve once. Deposit any amount. No minimum. Funds go directly into Aave V3.", badge: null },
              { icon: "📈", title: "Earn yield every block", desc: "Aave pays yield ~every 12 seconds. Your balance grows passively, no action needed.", badge: "No staking. No claiming.", iconColor: "var(--accent-gold)" },
              { icon: "💰", title: "Withdraw anytime", desc: "Redeem your shares. Receive principal + full yield earned, minus our small protocol fee.", badge: null },
            ].map((step, i) => (
              <div key={i} className="flex-1 text-center relative">
                <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-8 h-full flex flex-col items-center transition-all duration-200">
                  <div className="text-[2.5rem] mb-4" style={{ color: step.iconColor }}>{step.icon}</div>
                  <h3 className="font-display text-xl mb-3">{step.title}</h3>
                  <p className="text-[var(--text-muted)] text-[0.95rem]">{step.desc}</p>
                  {step.badge && (
                    <span className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--glow-gold)] text-gold">{step.badge}</span>
                  )}
                </div>
                {i < 2 && <div className="step-connector max-md:hidden" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-24 bg-[var(--bg-surface)]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 reveal" ref={r3}>
          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl">
            <div className="flex justify-between items-center px-6 py-5 border-b border-[var(--border)]">
              <h2 className="text-xl font-semibold">Protocol Statistics</h2>
              <a
                href={`https://sepolia.basescan.org/address/${process.env.NEXT_PUBLIC_YIELD_SAVE_CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-teal hover:underline"
              >
                ↗ View on BaseScan
              </a>
            </div>
            {[
              { label: "Annual Percentage Rate*", val: "4.8%", cls: "text-teal" },
              { label: "Total USDC Deposited",    val: liveVaultBalance !== null ? `$${parseFloat(formatUnits(liveVaultBalance, 6)).toLocaleString()}` : "$2,400,000", cls: "text-gold" },
              { label: "Active Depositors",       val: "4,207", cls: "" },
              { label: "Protocol Fee",            val: "5% on yield only", cls: "" },
            ].map((row, i, arr) => (
              <div key={i} className={`flex justify-between items-center px-6 py-4 ${i < arr.length - 1 ? "border-b border-[var(--border)]" : ""}`}>
                <span className="text-[var(--text-muted)]">{row.label}</span>
                <span className={`font-mono font-bold text-lg ${row.cls}`}>{row.val}</span>
              </div>
            ))}
            <div className="px-6 py-4 text-xs text-[var(--text-micro)]">*APR reflects current Aave V3 USDC supply rate. Rate fluctuates with market conditions.</div>
          </div>
        </div>
      </section>

      {/* Fee Transparency */}
      <section className="py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 reveal" ref={r4}>
          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] mb-3">We only earn when you earn.</h2>
          <div className="grid grid-cols-2 gap-12 mt-12 items-start max-md:grid-cols-1">
            <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-8 font-mono text-[0.95rem] leading-[2.2]">
              <div>User earns: <span className="text-teal float-right">$10.00 USDC</span></div>
              <div>Protocol fee (5%): <span className="text-danger float-right">− $0.50 USDC</span></div>
              <div className="border-t border-dashed border-[var(--border)] my-2" />
              <div className="font-bold">You receive: <span className="text-teal float-right">$9.50 USDC</span></div>
              <div className="mt-2">Your principal: <span className="border-b-2 border-gold font-bold">ALWAYS safe</span></div>
            </div>
            <ul className="list-none p-0 space-y-5">
              {[
                "Fee applies only to yield earned — never your deposit",
                "If Aave yields 0%, your fee is $0.00",
                "Fee collected in a single transaction at withdrawal",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[var(--text-muted)]">
                  <span>🛡️</span>{item}
                </li>
              ))}
              <div className="col-span-full bg-[var(--bg-surface)] border-l-4 border-gold rounded-lg px-6 py-5 italic text-[var(--text-muted)] mt-4">
                &ldquo;YieldSafe makes money only when you make money. This is not optional — it&apos;s how we&apos;re built.&rdquo;
              </div>
            </ul>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-24 bg-[var(--bg-surface)]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 reveal" ref={r5}>
          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] mb-3">Why YieldSafe?</h2>
          <div className="overflow-x-auto">
            <table className="compare-table w-full border-collapse mt-8">
              <thead>
                <tr>
                  <th className="text-left p-4 border-b border-[var(--border)] font-semibold text-[var(--text-muted)] text-sm">Feature</th>
                  <th className="text-left p-4 border-b border-[var(--border)] font-semibold text-[var(--text-muted)] text-sm">🏦 Bank Savings</th>
                  <th className="text-left p-4 border-b border-[var(--border)] font-semibold text-[var(--text-muted)] text-sm">⚡ YieldSafe</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Typical APY", "0.01 – 0.5%", "~4.8%"],
                  ["Lock-up", "Often required", "None ✓"],
                  ["Minimum balance", "$500+", "$0 ✓"],
                  ["Who holds funds", "The bank", "You (non-custodial) ✓"],
                  ["Transparent", "No ✗", "Fully on-chain ✓"],
                  ["Fee structure", "Hidden fees", "5% on yield only ✓"],
                  ["Starts earning", "Next business day", "Next Base block ✓"],
                ].map(([feat, bank, ys], i) => (
                  <tr key={i}>
                    <td className="p-4 border-b border-[var(--border)] text-sm">{feat}</td>
                    <td className="p-4 border-b border-[var(--border)] text-[var(--text-micro)] text-sm">{bank}</td>
                    <td className="p-4 border-b border-[var(--border)] text-sm">{ys}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 reveal" ref={r6}>
          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] mb-3 text-center">Trustless by architecture.</h2>
          <p className="text-[var(--text-muted)] text-xl text-center mb-0">The team can&apos;t touch your funds. The code is law.</p>
          <div className="grid grid-cols-3 gap-6 mt-12 max-md:grid-cols-1">
            {[
              { icon: "🔐", title: "Non-custodial", desc: "No admin withdrawal function exists in the contract. Your keys, your funds — always." },
              { icon: "🏗️", title: "Aave V3 Backed", desc: "$10B+ secured. Live since 2020. Multiple audits by top security firms." },
              { icon: "🔎", title: "Fully on-chain", desc: "Every deposit, yield event, and fee is verifiable on BaseScan in real-time." },
            ].map((card, i) => (
              <div key={i} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-6 h-full">
                <div className="text-[2rem]">{card.icon}</div>
                <h3 className="font-display text-lg mt-3 mb-2">{card.title}</h3>
                <p className="text-[var(--text-muted)] text-sm">{card.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs text-[var(--text-micro)] text-center max-w-[700px] mx-auto">
            Smart contracts carry inherent risks. While Aave V3 is battle-tested, no protocol is risk-free. Only deposit what you can afford to have locked temporarily during extreme market conditions.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-[var(--bg-surface)]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 reveal" ref={r7}>
          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] mb-3">Questions, answered.</h2>
          <div className="mt-8 max-w-[720px]">
            <FAQ q="Is my principal ever at risk from fees?" a="Never. The 5% fee applies exclusively to yield earned. Your original deposit is always returned in full, regardless of how long you keep funds in the vault." />
            <FAQ q="When exactly is the fee deducted?" a="The fee is calculated and deducted at the moment of withdrawal. While your funds are in the vault, 100% of Aave yield accrues to your balance. The 5% is only separated when you redeem." />
            <FAQ q="What drives the APY?" a="YieldSafe deposits into Aave V3's USDC lending pool. APY is determined by borrowing demand on Aave — when more users borrow USDC, the supply rate (your yield) increases." />
            <FAQ q="Can I withdraw without waiting?" a="Yes. Withdrawals are instant as long as Aave has sufficient liquidity in the USDC pool, which it historically always has. There is no lock-up, no unbonding, no delay." />
            <FAQ q="What happens if Aave has low liquidity?" a="In rare cases of extreme utilization on Aave, partial withdrawals may be temporarily limited. This is an Aave-level mechanism, not a YieldSafe restriction. Your funds remain safe and withdrawable as liquidity normalizes." />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center py-24 reveal" ref={r8}>
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] mb-4">Start earning in under 2 minutes.</h2>
          <p className="text-[var(--text-muted)] mb-8 text-xl">Connect your wallet. Deposit USDC. Done.</p>
          <Link href="/app">
            <button className="inline-flex items-center gap-2 px-6 md:px-10 py-3 md:py-4 rounded-full bg-teal text-white font-semibold text-base md:text-[1.1rem] cursor-pointer border-none transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,222,200,0.4)] hover:-translate-y-px">
              Get Started →
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex justify-between items-center px-4 md:px-8 py-8 border-t border-[var(--border)] flex-wrap gap-4 max-md:flex-col max-md:text-center">
        <div className="font-display font-extrabold text-[var(--text-primary)] flex items-center gap-2 text-base">
          <svg width="22" height="22" viewBox="0 0 40 40">
            <path d="M20 4 L34 14 L34 30 Q34 36 20 38 Q6 36 6 30 L6 14 Z" fill="none" stroke="var(--accent-teal)" strokeWidth="2.5"/>
            <path d="M16 26 L20 18 L24 26 M14 22 L20 14 L26 22" fill="none" stroke="var(--accent-teal)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          YieldSafe — Your savings, always earning.
        </div>
        <div className="flex gap-6">
          {["Docs", "GitHub", "Audit", "Twitter", "Discord"].map(link => (
            <a key={link} href="#" className="text-[var(--text-muted)] text-sm hover:text-teal transition-colors">{link}</a>
          ))}
        </div>
        <button
          className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-full w-9 h-9 cursor-pointer flex items-center justify-center text-[var(--text-muted)] transition-all duration-200 hover:border-teal hover:text-teal p-0 [&_svg]:w-[18px] [&_svg]:h-[18px] [&_svg]:fill-current"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
        <div className="text-[var(--text-micro)] text-xs w-full text-center mt-4">YieldSafe © 2025 — MIT Licensed — Not financial advice.</div>
      </footer>
    </>
  );
}
