# Deposit Flow

## Overview

Depositing USDC into YieldSafe is a two-step process:
1. **Approve** — grant the vault permission to spend USDC (if not already approved)
2. **Deposit** — transfer USDC to the vault and receive share tokens in return

Share tokens represent the user's proportional ownership of the vault. As the vault earns yield via Aave, each share becomes worth more USDC over time.

---

## End-to-End Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│  USER ACTION                                                        │
│  Navigates to Deposit tab, enters "100" USDC                       │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  UI COMPONENT: DepositForm                                          │
│                                                                     │
│  onChange → setDepositAmt("100")                                    │
│           → previewByAssets(100_000_000n) [live preview call]      │
│           → setDepositPreview(sharesResult)                         │
│                                                                     │
│  Display: "You will receive X shares"                               │
│  Display: "Exchange rate: 1 USDC = Y shares"                       │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  ALLOWANCE CHECK                                                    │
│                                                                     │
│  useAllowance.refetchAllowance()                                    │
│  → usdcContract.allowance(userAddr, vaultAddr)                     │
│  → currentAllowance: bigint                                        │
│                                                                     │
│  needsApproval = currentAllowance < 100_000_000n                   │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               │ needs approval                │ already approved
               ▼                               ▼
┌──────────────────────────┐   ┌───────────────────────────────────┐
│  STEP 1: APPROVE         │   │  STEP 2: DEPOSIT (skip to this)   │
│                          │   └───────────────────────────────────┘
│  User clicks             │
│  "Approve USDC"          │
│         │                │
│         ▼                │
│  useApprove.approve(     │
│    100_000_000n          │
│  )                       │
│         │                │
│         ▼                │
│  USDC.approve(           │
│    vault,                │
│    100_000_000n          │
│  )                       │
│         │                │
│         ▼                │
│  Wallet signs tx ──────► Base Sepolia blockchain
│         │                │
│         ▼                │
│  tx.wait() confirmed     │
│         │                │
│         ▼                │
│  refetchAllowance()      │
│  → UI shows Deposit btn  │
└──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 2: DEPOSIT                                                    │
│                                                                     │
│  User clicks "Deposit"                                              │
│         │                                                           │
│         ▼                                                           │
│  useDeposit.submitDeposit(100_000_000n)                             │
│         │                                                           │
│         ▼                                                           │
│  YieldSaveVault.deposit(100_000_000n)                               │
│  [vault internally calls USDC.transferFrom(user, vault, amount)]   │
│  [vault deposits USDC into Aave V3, receives aUSDC]                │
│  [vault mints share tokens to user]                                 │
│         │                                                           │
│         ▼                                                           │
│  Wallet signs tx ──────────────────────────► Base Sepolia           │
│         │                                                           │
│         ▼                                                           │
│  receipt = tx.wait()                                                │
│  receipt.status === 1 → success                                     │
│         │                                                           │
│         ▼                                                           │
│  onSuccess() called                                                 │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  UI UPDATE: refreshData()                                           │
│                                                                     │
│  Parallel refetch:                                                  │
│  ├── refetchUsdcBalance()   → wallet USDC balance (decreased)      │
│  ├── refetchUserShares()    → user shares (increased)              │
│  ├── refetchUserBalance()   → vault position value (increased)     │
│  ├── refetchUserDeposits()  → principal recorded                   │
│  └── refetchVaultBalance()  → TVL (increased)                      │
│                                                                     │
│  All state updates → React re-render → UI reflects new values      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## What Happens On-Chain

```
User calls: YieldSaveVault.deposit(100_000_000)

Inside the contract:
  1. Checks amount > 0
  2. Calculates shares = previewDeposit(100_000_000)
  3. Checks shares > 0
  4. Records: userDeposits[msg.sender] += 100_000_000
  5. Calls: USDC.transferFrom(msg.sender, address(this), 100_000_000)
  6. Approves Aave pool to pull USDC
  7. Calls: AavePool.supply(USDC, 100_000_000, address(this), 0)
     → Vault receives aUSDC (interest-bearing token)
  8. Mints shares to msg.sender: userShares[msg.sender] += shares
  9. Emits: Deposited(msg.sender, 100_000_000, shares)
```

---

## Exchange Rate Explained

The exchange rate between USDC and shares changes over time as the vault earns yield.

```
Initial state (vault just launched):
  1 USDC = 1 share (1:1)

After yield accumulates:
  1 share = 1.048 USDC  (vault earned 4.8% yield)
  So: depositing 100 USDC gives ~95.4 shares

Formula:
  shares = (amount * totalShares) / getVaultBalance()
```

This means early depositors are rewarded — their shares are proportionally more valuable.

---

## Key Files

| File | Role in Deposit Flow |
|------|---------------------|
| [components/Deposit/DepositForm.tsx](../../components/Deposit/DepositForm.tsx) | UI, form state, orchestrates approve + deposit |
| [hooks/useAllowance.ts](../../hooks/useAllowance.ts) | Reads current USDC approval |
| [hooks/useApprove.ts](../../hooks/useApprove.ts) | Sends approve transaction |
| [hooks/useDeposit.ts](../../hooks/useDeposit.ts) | Sends deposit transaction |
| [hooks/usePreviewDeposit.ts](../../hooks/usePreviewDeposit.ts) | Simulates deposit for preview |
| [hooks/specific/useWrite.ts](../../hooks/specific/useWrite.ts) | Low-level deposit() call |
| [lib/abis/YieldSaveVault.json](../../lib/abis/YieldSaveVault.json) | Contract ABI |

---

## Error Handling

All errors from contract calls pass through `useDecodedError`:

| Scenario | Error | User Message |
|----------|-------|-------------|
| Deposit amount = 0 | `ZeroAmount` | "Amount must be greater than zero" |
| Shares would round to 0 | `ZeroSharesMinted` | "Deposit too small — no shares would be minted" |
| USDC transfer fails | `ERC20CallFailed` | "Token transfer failed" |
| User rejects wallet prompt | N/A (ethers error) | Toast shows raw error message |
| Wrong network | N/A | AppKit prompts network switch |
