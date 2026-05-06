# Architecture Overview

## System Architecture

YieldSafe is a client-side DeFi frontend. There is no backend server — all state comes from the blockchain and the connected wallet. The frontend reads contract state directly via RPC and writes via signed wallet transactions.

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                             │
│                                                                 │
│  ┌─────────────┐    ┌──────────────┐    ┌───────────────────┐  │
│  │  Next.js    │    │  Reown       │    │   ethers.js v6    │  │
│  │  App Router │◄──►│  AppKit      │◄──►│   Contract calls  │  │
│  │  (React 19) │    │  (WalletConn)│    │   Provider/Signer │  │
│  └─────────────┘    └──────────────┘    └───────────────────┘  │
│         │                  │                      │             │
└─────────┼──────────────────┼──────────────────────┼─────────────┘
          │                  │                      │
          │ HTTP / WS RPC    │ Wallet RPC (EIP-1193) │ Contract ABI
          ▼                  ▼                      ▼
┌──────────────────┐  ┌─────────────┐   ┌─────────────────────────┐
│  Base Sepolia    │  │   User      │   │  YieldSaveVault         │
│  Public RPC      │  │   Wallet    │   │  (ERC-4626 style vault) │
│  (read-only)     │  │ (MetaMask/  │   │                         │
│                  │  │  WalletConn)│   │  ┌──────────────────┐   │
└──────────────────┘  └─────────────┘   │  │  Aave V3 Pool    │   │
                                        │  │  (aUSDC lending) │   │
                                        │  └──────────────────┘   │
                                        └─────────────────────────┘
```

---

## Frontend Layer Architecture

```
app/
├── layout.tsx          (Root — mounts Providers)
├── providers.tsx        (ToastContainer + AppKit init)
├── page.tsx             (Landing/marketing page)
└── app/
    └── page.tsx         (Dashboard — main application)
         │
         ├── AppNavbar        (navigation + wallet display)
         ├── BalanceCards     (wallet USDC + vault position)
         ├── StatsGrid        (TVL, APR, users, lockup)
         ├── ActionTabs       (deposit/withdraw/rewards/stats)
         └── [active tab]
              ├── DepositForm   (approve + deposit)
              ├── WithdrawForm  (withdraw shares)
              ├── RewardsTab    (accrued yield display)
              └── StatsTab      (protocol + user position)
```

---

## Component Hierarchy Diagram

```
<Providers>                              ← global: Toast + AppKit
  <AppNavbar>                            ← nav, wallet address, theme
  <main>
    [if disconnected]
      <ConnectWalletScreen>              ← AppKit connect button
    [if connected]
      <BalanceCards>                     ← usdcBalance, userBalance
      <StatsGrid>                        ← TVL, APR (static+live)
      <ActionTabs>                       ← tab selector
        [deposit tab]
          <DepositForm>                  ← useApprove + useDeposit
        [withdraw tab]
          <WithdrawForm>                 ← useWithdraw
        [rewards tab]
          <RewardsTab>                   ← computed: userBalance - userDeposits
        [stats tab]
          <StatsTab>                     ← vaultBalance, feeRate, user address
```

---

## Data Flow Architecture

```
Blockchain (Base Sepolia)
        │
        │  RPC reads (via readOnlyProvider)
        ▼
  useRead.ts  ──────────────────────────────────────────────────────┐
  (specific/useRead.ts)                                             │
  ┌──────────────────────────────────────────────────────────────┐  │
  │  getVaultBalance()     getUserShares()    getUserBalance()   │  │
  │  getUserDeposits()     previewDeposit()   previewWithdraw()  │  │
  └──────────────────────────────────────────────────────────────┘  │
        │                                                            │
        │  Used by these public hooks:                               │
        ├── useVaultBalance.ts   →  vaultBalance (bigint)           │
        ├── useUserShares.ts     →  userShares (bigint)             │
        ├── useUserBalance.ts    →  userBalance (bigint)            │
        ├── useUserDeposits.ts   →  userDeposits (bigint)           │
        ├── usePreviewDeposit.ts →  previewByAssets(amount)         │
        └── usePreviewWithdraw.ts→  previewByShares(shares)         │
                                                                     │
Wallet (EIP-1193 provider)                                          │
        │                                                            │
        │  useRunner.ts  ──────────────────────────────────────────-┘
        │  ┌──────────────────────────────────────────────────────┐
        │  │  provider  (BrowserProvider)                         │
        │  │  signer    (JsonRpcSigner)                           │
        │  │  readOnlyProvider (JsonRpcProvider, public RPC)      │
        │  └──────────────────────────────────────────────────────┘
        │
        │  useContract.ts / useErc20Contract.ts
        │  (creates ethers Contract with signer for writes)
        │
        ▼
  useWrite.ts
  ┌──────────────────────────────────────┐
  │  deposit(amount: bigint)             │
  │  withdraw(shares: bigint)            │
  └──────────────────────────────────────┘
        │
        ├── useApprove.ts   →  approve(amount)
        ├── useDeposit.ts   →  submitDeposit(amount)
        └── useWithdraw.ts  →  submitWithdraw(shares)
```

---

## Frontend-to-Blockchain Communication Diagram

```
User clicks "Deposit USDC"
        │
        ▼
DepositForm.tsx
  handleDepositFlow()
        │
        ├─[Step 1: Check Allowance]
        │  │
        │  ├─[if allowance < amount]──► useApprove.approve(amount)
        │  │                                    │
        │  │                            usdcContract.approve(
        │  │                              YieldSaveVault, amount
        │  │                            )
        │  │                                    │
        │  │                            wallet signs tx → tx.wait()
        │  │
        │  └─[allowance sufficient]───► Skip to Step 2
        │
        ▼
        ├─[Step 2: Deposit]──────────► useDeposit.submitDeposit(amount)
        │                                    │
        │                            vaultContract.deposit(amount)
        │                                    │
        │                            wallet signs tx
        │                                    │
        │                            tx.wait() + receipt.status === 1
        │
        ▼
        ├─[Step 3: Refresh]──────────► handleRefresh()
        │                                    │
        │                            wait(2000ms) → re-fetch all
        │                                    │
        │                            UI updates with new balances
```

---

## State Management

YieldSafe uses **local React state only** — no Redux, Zustand, or Context for app state. Each page component manages its own state via `useState` and feeds data down to child components via props.

```
app/app/page.tsx  ← owns all state
  │
  ├── usdcBalance: bigint
  ├── userShares: bigint
  ├── userBalance: bigint
  ├── userDeposits: bigint
  ├── vaultBalance: bigint
  ├── exchangeRate: bigint
  ├── activeTab: Tab
  └── theme: "dark" | "light"
        │
        │  passed as props ▼
  DepositForm, WithdrawForm, BalanceCards, StatsTab, RewardsTab
```

Global state (wallet connection) is managed by **Reown AppKit** via its own internal context, accessed through the `useAppKitAccount()` and `useAppKit()` hooks.

---

## Theming Architecture

Theme is controlled via `data-theme` attribute on `<html>`. CSS custom properties adapt:

```
[data-theme="light"]     [data-theme="dark"] (default)
  --bg-base: #F2F5FC       --bg-base: #07090F
  --bg-surface: #FFFFFF    --bg-surface: #0C1018
  --accent-teal: #00897B   --accent-teal: #00DEC8
  --accent-gold: #B8860B   --accent-gold: #EFA500
```

Theme toggle lives in `AppNavbar.tsx` and `page.tsx` (landing), stored in `localStorage` as `"theme"`.

---

## Deployment Architecture

```
GitHub Repository
      │
      │  push to main
      ▼
Vercel (automatic deployment)
      │
      ├── Build: next build
      ├── Runtime: Node.js serverless (but app is fully client-side)
      └── Env vars: configured in Vercel dashboard
              │
              ▼
      Static + Edge CDN
              │
              ▼
      User Browser ──► Base Sepolia RPC ──► Smart Contracts
```
