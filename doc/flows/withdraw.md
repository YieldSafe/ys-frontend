# Withdraw Flow

## Overview

Withdrawing from YieldSafe redeems share tokens in exchange for USDC. The returned USDC includes the original principal plus any accrued yield, minus a 5% protocol fee applied only to the yield portion.

Withdrawal is a **single transaction** — no approval step is needed because the vault already owns the shares.

---

## End-to-End Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│  USER ACTION                                                        │
│  Navigates to Withdraw tab, enters shares amount (or clicks MAX)   │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  UI COMPONENT: WithdrawForm                                         │
│                                                                     │
│  onChange → setWithdrawAmt("50.5")                                  │
│           → previewByShares(parseUnits("50.5", 6))                 │
│           → setWithdrawPreview(usdcResult)                         │
│                                                                     │
│  Computed display:                                                  │
│  ├── USDC to receive = withdrawPreview                              │
│  ├── Yield earned = (withdrawPreview - proportionalDeposit)        │
│  └── Protocol fee = 5% × yield                                     │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  USER ACTION: Clicks "Withdraw aUSDC"                               │
│                                                                     │
│  handleWithdraw()                                                   │
│  → parseUnits(withdrawAmt, 6)  → shares: bigint                    │
│  → submitWithdraw(shares)                                           │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  HOOK: useWithdraw → useWrite.withdraw(shares)                      │
│                                                                     │
│  vaultContract.withdraw(shares)                                     │
│         │                                                           │
│         ▼                                                           │
│  Wallet signs transaction                                           │
│         │                                                           │
│         ▼                                                           │
│  Transaction broadcast to Base Sepolia                              │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  ON-CHAIN EXECUTION: YieldSaveVault.withdraw(shares)                │
│                                                                     │
│  1. Validates shares > 0                                            │
│  2. Validates userShares[caller] >= shares                          │
│  3. Calculates gross USDC value of shares                           │
│  4. Calculates proportional deposit (user's original principal)     │
│  5. Calculates yield = grossValue - proportionalDeposit             │
│  6. Calculates fee = yield * feeRate / 10000  (5%)                 │
│  7. payout = grossValue - fee                                       │
│  8. Burns shares: userShares[caller] -= shares                      │
│  9. Withdraws from Aave: AavePool.withdraw(USDC, grossValue, this) │
│  10. Transfers fee to treasury                                      │
│  11. Transfers payout to caller                                     │
│  12. Emits: Withdrawn(caller, shares, payout)                       │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  RECEIPT CHECK                                                      │
│                                                                     │
│  receipt = await tx.wait()                                          │
│  receipt.status === 1 → success                                     │
│  → returns true                                                     │
│  → onSuccess() called                                               │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  UI UPDATE: onSuccess() → refreshData()                             │
│                                                                     │
│  ├── refetchUsdcBalance()   → wallet USDC (increased by payout)    │
│  ├── refetchUserShares()    → shares (decreased by burned amount)  │
│  ├── refetchUserBalance()   → vault position (decreased)           │
│  ├── refetchUserDeposits()  → principal updated                    │
│  └── refetchVaultBalance()  → TVL (decreased)                      │
│                                                                     │
│  Form resets: setWithdrawAmt("")                                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Fee Calculation

The 5% fee applies **only to yield**, not to the principal:

```
Example:
  User deposited: 100 USDC
  Vault now values shares at: 110 USDC (10 USDC yield)

  gross withdrawal = 110 USDC
  yield portion    = 110 - 100 = 10 USDC
  fee              = 10 × 5% = 0.5 USDC → goes to treasury
  payout to user   = 110 - 0.5 = 109.5 USDC
```

If there is no yield (position value equals deposits), the fee is zero.

---

## Preview Calculation

`WithdrawForm` calls `previewByShares()` to display the expected payout before the user submits:

```typescript
// hooks/usePreviewWithdraw.ts
const usdcOut = await vaultContract.previewWithdraw(sharesInWei)
// Returns: payout after fee (matches what the actual tx will return)
```

---

## MAX Button Behaviour

Clicking MAX fills the input with the user's full share balance:

```typescript
// WithdrawForm.tsx
const handleMax = () => {
  setWithdrawAmt(formatUnits(userShares, 6))
}
```

This allows full withdrawal of all shares in a single transaction.

---

## Key Files

| File | Role in Withdraw Flow |
|------|----------------------|
| [components/Withdraw/WithdrawForm.tsx](../../components/Withdraw/WithdrawForm.tsx) | UI, form state, calls withdraw |
| [hooks/useWithdraw.ts](../../hooks/useWithdraw.ts) | Withdraw transaction wrapper |
| [hooks/usePreviewWithdraw.ts](../../hooks/usePreviewWithdraw.ts) | Simulates withdrawal for preview |
| [hooks/specific/useWrite.ts](../../hooks/specific/useWrite.ts) | Low-level withdraw() call |
| [lib/abis/YieldSaveVault.json](../../lib/abis/YieldSaveVault.json) | Contract ABI |

---

## Error Handling

| Scenario | Error | User Message |
|----------|-------|-------------|
| Shares = 0 | `ZeroAmount` | "Amount must be greater than zero" |
| Shares > user's balance | `InsufficientShares` | "You don't have enough shares" |
| User rejects wallet prompt | Wallet error | Toast shows raw error |
| Wrong network | N/A | AppKit prompts network switch |

---

## Difference From Deposit

| Aspect | Deposit | Withdraw |
|--------|---------|---------|
| Steps | 2 (approve + deposit) | 1 (withdraw only) |
| What user inputs | USDC amount | Share amount |
| What user receives | Share tokens | USDC |
| Fee | None | 5% of yield only |
| Approval needed | Yes (USDC → vault) | No (shares already in vault state) |
