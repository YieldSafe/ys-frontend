"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
);
const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
);

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } }, { threshold: 0.15 });
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
        const id = setInterval(() => { start += step; if (start >= end) { setVal(end); clearInterval(id); } else setVal(Math.floor(start * 100) / 100); }, 16);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={ref}>{prefix}{typeof end === "number" && end % 1 !== 0 ? val.toFixed(1) : val.toLocaleString()}{suffix}</span>;
}

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? "open" : ""}`}>
      <button className="faq-q" onClick={() => setOpen(!open)}>{q}<span className="faq-toggle">+</span></button>
      <div className="faq-a"><div className="faq-a-inner">{a}</div></div>
    </div>
  );
}

export default function HomePage() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") ?? "dark";
    }
    return "dark";
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);
  const r1 = useReveal(), r2 = useReveal(), r3 = useReveal(), r4 = useReveal(), r5 = useReveal(), r6 = useReveal(), r7 = useReveal(), r8 = useReveal();

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <svg width="28" height="28" viewBox="0 0 40 40"><path d="M20 4 L34 14 L34 30 Q34 36 20 38 Q6 36 6 30 L6 14 Z" fill="none" stroke="var(--accent-teal)" strokeWidth="2.5"/><path d="M16 26 L20 18 L24 26 M14 22 L20 14 L26 22" fill="none" stroke="var(--accent-teal)" strokeWidth="2" strokeLinecap="round"/></svg>
          YieldSafe
        </div>
        <div className="navbar-right">
          <a href="#how" style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>How it works</a>
          <a href="#stats" style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Stats</a>
          <a href="#faq" style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>FAQ</a>
          <Link href="/app"><button className="btn btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.9rem" }}>Get Started →</button></Link>
          <button className="theme-toggle" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">{theme === "dark" ? <SunIcon /> : <MoonIcon />}</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-blob1" />
          <div className="hero-blob2" />
          <div className="hero-noise" />
        </div>
        <div className="container hero-content">
          <div className="hero-left">
            <p className="eyebrow">Non-custodial • Powered by Aave V3</p>
            <h1>Your savings,<br />always earning.</h1>
            <p className="hero-sub">Deposit USDC. Earn DeFi yield automatically. Withdraw any time.</p>
            <div className="hero-ctas">
              <Link href="/app"><button className="btn btn-primary btn-lg">Get Started →</button></Link>
              <a href="#how"><button className="btn btn-ghost btn-lg">How it works</button></a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat-card"><div className="hero-stat-val text-teal"><CountUp end={4.8} suffix="%" /></div><div className="hero-stat-label">Annual Percentage Rate</div></div>
              <div className="hero-stat-card"><div className="hero-stat-val text-gold"><CountUp end={2.4} prefix="$" suffix="M" /></div><div className="hero-stat-label">Total Deposited</div></div>
              <div className="hero-stat-card"><div className="hero-stat-val"><CountUp end={4200} suffix="+" /></div><div className="hero-stat-label">Active Users</div></div>
            </div>
          </div>
          <div className="hero-right">
            <div className="shield-wrap">
              <div className="shield-orbit">
                <div className="shield-coin">$</div>
                <div className="shield-coin">$</div>
                <div className="shield-coin">$</div>
              </div>
              <div className="shield-icon" />
            </div>
          </div>
        </div>
        <div className="scroll-ind">↓</div>
      </section>

      {/* How It Works */}
      <section id="how" className="section" ref={r1}>
        <div className="container reveal" ref={r2}>
          <h2 className="section-title">Simple by design.</h2>
          <p className="section-sub">Complex DeFi, abstracted away.</p>
          <div className="steps-grid">
            <div className="step-card"><div className="card"><div className="step-icon">💳</div><h3>Deposit USDC</h3><p>Approve once. Deposit any amount. No minimum. Funds go directly into Aave V3.</p></div><div className="step-connector" /></div>
            <div className="step-card"><div className="card"><div className="step-icon" style={{ color: "var(--accent-gold)" }}>📈</div><h3>Earn yield every block</h3><p>Aave pays yield ~every 12 seconds. Your balance grows passively, no action needed.</p><span className="badge badge-gold" style={{ marginTop: "0.75rem" }}>No staking. No claiming.</span></div><div className="step-connector" /></div>
            <div className="step-card"><div className="card"><div className="step-icon">💰</div><h3>Withdraw anytime</h3><p>Redeem your shares. Receive principal + full yield earned, minus our small protocol fee.</p></div></div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="section" style={{ background: "var(--bg-surface)" }}>
        <div className="container reveal" ref={r3}>
          <div className="stats-panel">
            <div className="stats-header">
              <h2 style={{ fontSize: "1.25rem" }}>Protocol Statistics</h2>
              <a href="#" style={{ fontSize: "0.9rem" }}>↗ View on Etherscan</a>
            </div>
            <div className="stat-row"><span className="stat-row-label">Annual Percentage Rate*</span><span className="stat-row-val text-teal">4.8%</span></div>
            <div className="stat-row"><span className="stat-row-label">Total USDC Deposited</span><span className="stat-row-val text-gold">$2,400,000</span></div>
            <div className="stat-row"><span className="stat-row-label">Active Depositors</span><span className="stat-row-val">4,207</span></div>
            <div className="stat-row"><span className="stat-row-label">Protocol Fee</span><span className="stat-row-val">5% on yield only</span></div>
            <div className="stats-footnote">*APR reflects current Aave V3 USDC supply rate. Rate fluctuates with market conditions.</div>
          </div>
        </div>
      </section>

      {/* Fee Transparency */}
      <section className="section">
        <div className="container reveal" ref={r4}>
          <h2 className="section-title">We only earn when you earn.</h2>
          <div className="fee-grid">
            <div className="fee-breakdown">
              <div>User earns: <span className="text-teal" style={{ float: "right" }}>$10.00 USDC</span></div>
              <div>Protocol fee (5%): <span className="text-danger" style={{ float: "right" }}>− $0.50 USDC</span></div>
              <div className="divider" />
              <div style={{ fontWeight: 700 }}>You receive: <span className="text-teal" style={{ float: "right" }}>$9.50 USDC</span></div>
              <div style={{ marginTop: "0.5rem" }}>Your principal: <span style={{ borderBottom: "2px solid var(--accent-gold)", fontWeight: 700 }}>ALWAYS safe</span></div>
            </div>
            <ul className="fee-bullets" style={{ listStyle: "none", padding: 0 }}>
              <li>Fee applies only to yield earned — never your deposit</li>
              <li>If Aave yields 0%, your fee is $0.00</li>
              <li>Fee collected in a single transaction at withdrawal</li>
            </ul>
            <div className="fee-callout">&ldquo;YieldSafe makes money only when you make money. This is not optional — it&apos;s how we&apos;re built.&rdquo;</div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="section" style={{ background: "var(--bg-surface)" }}>
        <div className="container reveal" ref={r5}>
          <h2 className="section-title">Why YieldSafe?</h2>
          <div style={{ overflowX: "auto" }}>
            <table className="compare-table">
              <thead><tr><th>Feature</th><th>🏦 Bank Savings</th><th>⚡ YieldSafe</th></tr></thead>
              <tbody>
                <tr><td>Typical APY</td><td>0.01 – 0.5%</td><td>~4.8%</td></tr>
                <tr><td>Lock-up</td><td>Often required</td><td className="check">None ✓</td></tr>
                <tr><td>Minimum balance</td><td>$500+</td><td className="check">$0 ✓</td></tr>
                <tr><td>Who holds funds</td><td>The bank</td><td className="check">You (non-custodial) ✓</td></tr>
                <tr><td>Transparent</td><td className="xmark">No ✗</td><td className="check">Fully on-chain ✓</td></tr>
                <tr><td>Fee structure</td><td>Hidden fees</td><td className="check">5% on yield only ✓</td></tr>
                <tr><td>Starts earning</td><td>Next business day</td><td className="check">Next Ethereum block ✓</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="section">
        <div className="container reveal" ref={r6}>
          <h2 className="section-title" style={{ textAlign: "center" }}>Trustless by architecture.</h2>
          <p className="section-sub" style={{ textAlign: "center" }}>The team can&apos;t touch your funds. The code is law.</p>
          <div className="security-grid">
            <div className="security-card"><div className="card"><div className="icon">🔐</div><h3>Non-custodial</h3><p>No admin withdrawal function exists in the contract. Your keys, your funds — always.</p></div></div>
            <div className="security-card"><div className="card"><div className="icon">🏗️</div><h3>Aave V3 Backed</h3><p>$10B+ secured. Live since 2020. Multiple audits by top security firms.</p></div></div>
            <div className="security-card"><div className="card"><div className="icon">🔎</div><h3>Fully on-chain</h3><p>Every deposit, yield event, and fee is verifiable on Etherscan in real-time.</p></div></div>
          </div>
          <p className="risk-note">Smart contracts carry inherent risks. While Aave V3 is battle-tested, no protocol is risk-free. Only deposit what you can afford to have locked temporarily during extreme market conditions.</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section" style={{ background: "var(--bg-surface)" }}>
        <div className="container reveal" ref={r7}>
          <h2 className="section-title">Questions, answered.</h2>
          <div style={{ marginTop: "2rem", maxWidth: "720px" }}>
            <FAQ q="Is my principal ever at risk from fees?" a="Never. The 5% fee applies exclusively to yield earned. Your original deposit is always returned in full, regardless of how long you keep funds in the vault." />
            <FAQ q="When exactly is the fee deducted?" a="The fee is calculated and deducted at the moment of withdrawal. While your funds are in the vault, 100% of Aave yield accrues to your balance. The 5% is only separated when you redeem." />
            <FAQ q="What drives the APY?" a="YieldSafe deposits into Aave V3's USDC lending pool. APY is determined by borrowing demand on Aave — when more users borrow USDC, the supply rate (your yield) increases." />
            <FAQ q="Can I withdraw without waiting?" a="Yes. Withdrawals are instant as long as Aave has sufficient liquidity in the USDC pool, which it historically always has. There is no lock-up, no unbonding, no delay." />
            <FAQ q="What happens if Aave has low liquidity?" a="In rare cases of extreme utilization on Aave, partial withdrawals may be temporarily limited. This is an Aave-level mechanism, not a YieldSafe restriction. Your funds remain safe and withdrawable as liquidity normalizes." />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta reveal" ref={r8}>
        <div className="container">
          <h2>Start earning in under 2 minutes.</h2>
          <p>Connect your wallet. Deposit USDC. Done.</p>
          <Link href="/app"><button className="btn btn-primary btn-lg">Get Started →</button></Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="navbar-logo" style={{ fontSize: "1rem" }}>
          <svg width="22" height="22" viewBox="0 0 40 40"><path d="M20 4 L34 14 L34 30 Q34 36 20 38 Q6 36 6 30 L6 14 Z" fill="none" stroke="var(--accent-teal)" strokeWidth="2.5"/><path d="M16 26 L20 18 L24 26 M14 22 L20 14 L26 22" fill="none" stroke="var(--accent-teal)" strokeWidth="2" strokeLinecap="round"/></svg>
          YieldSafe — Your savings, always earning.
        </div>
        <div className="footer-links">
          <a href="#">Docs</a><a href="#">GitHub</a><a href="#">Audit</a><a href="#">Twitter</a><a href="#">Discord</a>
        </div>
        <button className="theme-toggle" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">{theme === "dark" ? <SunIcon /> : <MoonIcon />}</button>
        <div className="footer-copy">YieldSafe © 2025 — MIT Licensed — Not financial advice.</div>
      </footer>
    </>
  );
}
