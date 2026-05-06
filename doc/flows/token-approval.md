# Token Approval Flow

## Why Approval Is Required

ERC-20 tokens (like USDC) use an allowance system for security. A smart contract cannot pull tokens from a user's wallet without explicit permission. Before the YieldSaveVault can transfer USDC from the user, the user must call `approve()` on the USDC contract, granting the vault permission to spend up to a specified amount.

This is a two-transaction pattern:
1. **Approve** — user authorises the vault to spend USDC (no USDC moves yet)
2. **Deposit** — vault transfers USDC from user into itself

---

## Approval Flow Diagram

```
User enters deposit amount (e.g. 100 USDC)
        │
        ▼
useAllowance.refetchAllowance()
→ usdcContract.allowance(userAddress, vaultAddress)
→ returns currentAllowance: bigint
        │
        ├── [currentAllowance >= depositAmount]
        │         Approval sufficient → skip to Deposit
        │
        └── [currentAllowance < depositAmount]
                  │
                  ▼
          UI shows "Approve USDC" button
                  │
          User clicks "Approve USDC"
                  │
                  ▼
          useApprove.approve(depositAmount)
                  │
                  ▼
          usdcContract.approve(
            vaultAddress,      ← spender
            depositAmount      ← USDC in 6-decimal wei
          )
                  │
                  ▼
          Wallet prompts user to sign
                  │
                  ▼
          User confirms in wallet
                  │
                  ▼
          tx = await approve(...)
          await tx.wait()           ← waits for on-chain confirmation
                  │
                  ▼
          refetchAllowance()        ← updates displayed allowance
                  │
                  ▼
          UI switches to "Deposit" button
```

---

## Code Path

**Component triggers approval:**
```typescript
// DepositForm.tsx
const handleApprove = async () => {
  await approve(parseUnits(depositAmt, 6))
  await refetchAllowance()   // refresh so UI updates
}
```

**Hook executes the transaction:**
```typescript
// hooks/useApprove.ts
const approve = async (amount: bigint) => {
  setIsApproving(true)
  const tx = await usdcContract.approve(VAULT_ADDRESS, amount)
  await tx.wait()
  setIsApproving(false)
}
```

**Contract call on-chain:**
```
USDC.approve(
  spender: YieldSaveVault address,
  amount:  100_000_000n  // 100 USDC in 6-decimal units
)
```

---

## Allowance Check

Before showing the approval button, `DepositForm` checks the current allowance:

```typescript
// hooks/useAllowance.ts
const allowance = await usdcContract.allowance(
  userAddress,   // owner
  vaultAddress   // spender
)
// returns bigint
```

**UI decision logic:**
```typescript
const needsApproval = currentAllowance < parseUnits(depositAmt, 6)

// In DepositForm render:
{needsApproval ? (
  <button onClick={handleApprove} disabled={isApproving}>
    {isApproving ? "Approving..." : "Approve USDC"}
  </button>
) : (
  <button onClick={handleDeposit} disabled={isDepositing}>
    {isDepositing ? "Depositing..." : "Deposit"}
  </button>
)}
```

---

## Approval Amount Strategy

The current implementation approves the **exact deposit amount** (not unlimited). This is the safer approach — the user grants minimum necessary permission.

**Trade-off:** The user must approve again for each new deposit if it exceeds the previous approval amount. This is a UX friction point but better for security.

---

## On-Chain State After Approval

```
USDC Contract Storage (simplified)
  allowances[userAddress][vaultAddress] = 100_000_000n

After vault.deposit(100_000_000n):
  allowances[userAddress][vaultAddress] = 0n  ← consumed
```

---

## Important Notes

1. **Approvals are network-specific** — an approval on Base Sepolia is not valid on mainnet.
2. **Approvals persist** — if a user approves but does not deposit, the allowance remains until used or revoked.
3. **Gas cost** — approval is a separate transaction and costs gas. On Base Sepolia, this is very cheap (<$0.01).
4. **Order matters** — the vault's `deposit()` will revert with `ERC20CallFailed` if called without sufficient approval.
