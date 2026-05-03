# Folder Structure Reference

```
ys-frontend/
├── app/                          # Next.js App Router pages
│   ├── app/
│   │   └── page.tsx              # Dashboard (authenticated app UI)
│   ├── globals.css               # Global styles + CSS variables for theming
│   ├── layout.tsx                # Root HTML shell, metadata, wraps <Providers>
│   ├── page.tsx                  # Landing / marketing page
│   └── providers.tsx             # Initialises AppKit + ToastContainer
│
├── components/                   # Reusable React components
│   ├── ui/
│   │   ├── AppNavbar.tsx         # Top navigation bar, wallet display, theme toggle
│   │   └── Icons.tsx             # SVG icons: SunIcon, MoonIcon, Logo
│   ├── Dashboard/
│   │   ├── ActionTabs.tsx        # Tab bar: Deposit / Withdraw / Rewards / Stats
│   │   ├── BalanceCards.tsx      # Dual card: Wallet USDC balance + Vault position
│   │   ├── RewardsTab.tsx        # Shows accrued yield (userBalance - userDeposits)
│   │   ├── StatsGrid.tsx         # 4-column stats: TVL, APR, Users, Lockup
│   │   └── StatsTab.tsx          # Detailed vault stats + user position
│   ├── Deposit/
│   │   └── DepositForm.tsx       # Full deposit UI: approve + deposit flow
│   └── Withdraw/
│       └── WithdrawForm.tsx      # Full withdraw UI: preview + withdraw flow
│
├── constants/
│   └── provider.ts               # Read-only JsonRpcProvider (public RPC)
│
├── hooks/                        # Custom React hooks (Web3 + UI logic)
│   ├── specific/
│   │   ├── useRead.ts            # All read-only vault contract calls (internal)
│   │   └── useWrite.ts           # deposit() and withdraw() tx execution (internal)
│   ├── useAllowance.ts           # USDC allowance for the vault contract
│   ├── useApprove.ts             # Approve USDC spend
│   ├── useContract.ts            # YieldSaveVault contract instance (signer or read-only)
│   ├── useDecodedError.ts        # Maps contract custom errors to user-friendly messages
│   ├── useDeposit.ts             # Deposit call (delegates to useWrite)
│   ├── useErc20Contract.ts       # USDC ERC-20 contract instance
│   ├── usePreviewDeposit.ts      # Simulate deposit: USDC → shares
│   ├── usePreviewWithdraw.ts     # Simulate withdraw: shares → USDC
│   ├── useRunner.ts              # provider, signer, readOnlyProvider setup
│   ├── useUsdcBalance.ts         # User's USDC wallet balance
│   ├── useUserBalance.ts         # User's vault position value in USDC
│   ├── useUserDeposits.ts        # Total USDC the user has deposited (principal)
│   ├── useUserShares.ts          # User's vault share token balance
│   ├── useVaultBalance.ts        # Total USDC locked in the vault (TVL)
│   └── useWithdraw.ts            # Withdraw call (delegates to useWrite)
│
├── lib/
│   └── abis/
│       ├── erc20.ts              # ERC-20 ABI as TS string array (balanceOf, approve, etc.)
│       ├── ERC20.json            # ERC-20 ABI in JSON format
│       └── YieldSaveVault.json   # YieldSaveVault full ABI (events, errors, functions)
│
├── types/                        # TypeScript type definitions (stubs, extendable)
│   ├── components.ts
│   └── contracts.ts
│
├── connection.ts                 # AppKit initialisation (projectId, network, metadata)
├── utils.ts                      # formatAddress() helper
├── doc/                          # ← You are here (project documentation)
├── .env.local                    # Environment variables (not committed)
├── eslint.config.mjs             # ESLint configuration
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies and scripts
├── tailwind.config.ts            # Tailwind: custom colors, fonts, animations
└── tsconfig.json                 # TypeScript compiler options
```

---

## File Purpose Quick Reference

### Entry Points

| File | Role |
|------|------|
| `app/layout.tsx` | Root HTML, sets `<html lang>`, metadata, wraps everything in `<Providers>` |
| `app/providers.tsx` | Client component; imports `connection.ts` to boot AppKit; mounts `<ToastContainer>` |
| `connection.ts` | Creates and exports the AppKit instance; called once at startup |
| `app/page.tsx` | Public marketing page — no wallet required |
| `app/app/page.tsx` | Protected dashboard — full app experience |

### Hook Hierarchy

```
Public hooks (called by components)
  └── useVaultBalance, useUserShares, useUserBalance,
      useUserDeposits, usePreviewDeposit, usePreviewWithdraw
          └── useRead.ts  (internal — calls contract directly)
                └── useContract.ts (read-only contract instance)
                      └── useRunner.ts (readOnlyProvider)

  └── useApprove, useDeposit, useWithdraw
          └── useWrite.ts (internal — executes txs)
          └── useErc20Contract.ts (signer-attached USDC contract)
                └── useRunner.ts (signer)

  └── useAllowance
          └── useErc20Contract.ts

  └── useUsdcBalance
          └── useErc20Contract.ts (read-only)
```

### ABI Files

| File | Used By | Content |
|------|---------|---------|
| `lib/abis/YieldSaveVault.json` | `useContract.ts`, `useDecodedError.ts` | Full vault ABI |
| `lib/abis/erc20.ts` | `useErc20Contract.ts` | Human-readable ERC-20 ABI |
| `lib/abis/ERC20.json` | (available, JSON format) | Standard ERC-20 ABI |

### Constants

| File | Exports | Purpose |
|------|---------|---------|
| `constants/provider.ts` | `jsonRpcProvider` | Public read-only RPC for Base Sepolia |
| `utils.ts` | `formatAddress(addr)` | Shortens wallet address: `0x1234...ABCDEF` |
