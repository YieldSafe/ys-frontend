# Hooks Reference

All hooks live in [hooks/](../hooks/). There are two layers: **public hooks** used by components, and **internal hooks** that encapsulate raw contract calls.

---

## Provider / Signer Hook

### `useRunner`
**File:** [hooks/useRunner.ts](../hooks/useRunner.ts)

The foundation for all contract interaction. Returns three objects:

| Return | Type | Description |
|--------|------|-------------|
| `provider` | `BrowserProvider \| null` | ethers BrowserProvider wrapping the connected wallet |
| `signer` | `JsonRpcSigner \| null` | Signer derived from the connected wallet (for write txs) |
| `readOnlyProvider` | `JsonRpcProvider` | Public RPC provider for read-only calls (no wallet needed) |

**How it works:**
- `walletProvider` is retrieved from AppKit via `useAppKitProvider("eip155")`
- `provider` wraps it with ethers `BrowserProvider`
- `signer` is resolved via `provider.getSigner()`
- `readOnlyProvider` uses the `jsonRpcProvider` from `constants/provider.ts`

---

## Contract Instance Hooks

### `useContract` / `useYieldSaveContract`
**File:** [hooks/useContract.ts](../hooks/useContract.ts)

Creates an ethers `Contract` instance pointing at the YieldSaveVault.

| Param | Type | Description |
|-------|------|-------------|
| `withSigner` | `boolean` | `true` for write operations (needs wallet), `false` for reads |

Returns: `ethers.Contract | null`

---

### `useErc20Contract` / `useUsdcContract`
**File:** [hooks/useErc20Contract.ts](../hooks/useErc20Contract.ts)

Creates an ethers `Contract` instance for the USDC ERC-20 token.

| Param | Type | Description |
|-------|------|-------------|
| `withSigner` | `boolean` | `true` for approve, `false` for balanceOf/allowance reads |

Returns: `ethers.Contract | null`

---

## Internal Hooks (in `hooks/specific/`)

These are not called directly by components. They wrap raw contract method calls with error handling and loading state.

### `useRead`
**File:** [hooks/specific/useRead.ts](../hooks/specific/useRead.ts)

Centralises all read-only vault contract calls.

| Method | Contract Call | Returns |
|--------|--------------|---------|
| `getVaultBalance()` | `vault.getVaultBalance()` | `Promise<bigint \| null>` |
| `getUserShares(addr)` | `vault.userShares(addr)` | `Promise<bigint \| null>` |
| `getUserBalance(addr)` | `vault.getUserBalance(addr)` | `Promise<bigint \| null>` |
| `getUserDeposits(addr)` | `vault.userDeposits(addr)` | `Promise<bigint \| null>` |
| `previewDeposit(assets)` | `vault.previewDeposit(assets)` | `Promise<bigint \| null>` |
| `previewWithdraw(shares)` | `vault.previewWithdraw(shares)` | `Promise<bigint \| null>` |

Also returns `isLoading: boolean`.

Handles `BAD_DATA` errors (wrong network / wrong ABI) gracefully by returning `null`.

---

### `useWrite`
**File:** [hooks/specific/useWrite.ts](../hooks/specific/useWrite.ts)

Encapsulates state-changing vault transactions.

| Method | Signature | Description |
|--------|-----------|-------------|
| `deposit` | `(amount: bigint) => Promise<boolean>` | Calls `vault.deposit(amount)`, waits for receipt |
| `withdraw` | `(shares: bigint) => Promise<boolean>` | Calls `vault.withdraw(shares)`, waits for receipt |

Also returns:
- `isDepositing: boolean`
- `isWithdrawing: boolean`

Returns `true` on success (`receipt.status === 1`), `false` on failure.

---

## Public Data Hooks

### `useVaultBalance`
**File:** [hooks/useVaultBalance.ts](../hooks/useVaultBalance.ts)

Fetches the total USDC locked in the vault (TVL).

```typescript
const { isLoadingVaultBalance, refetchVaultBalance } = useVaultBalance()
// vaultBalance is returned separately via the callback
```

---

### `useUserShares`
**File:** [hooks/useUserShares.ts](../hooks/useUserShares.ts)

Fetches the connected user's share token balance.

```typescript
const { isLoadingUserShares, refetchUserShares } = useUserShares()
```

---

### `useUserBalance`
**File:** [hooks/useUserBalance.ts](../hooks/useUserBalance.ts)

Fetches the connected user's current vault position value (principal + yield, in USDC wei).

```typescript
const { isLoadingUserBalance, refetchUserBalance } = useUserBalance()
```

---

### `useUserDeposits`
**File:** [hooks/useUserDeposits.ts](../hooks/useUserDeposits.ts)

Fetches the total USDC the user has deposited (sum of all deposits, not reduced by withdrawals). Used to calculate yield: `yield = userBalance - userDeposits`.

```typescript
const { isLoadingUserDeposits, refetchUserDeposits } = useUserDeposits()
```

---

### `useUsdcBalance`
**File:** [hooks/useUsdcBalance.ts](../hooks/useUsdcBalance.ts)

Fetches the user's USDC balance in their connected wallet (not in the vault).

```typescript
const { isLoadingUsdcBalance, refetchUsdcBalance } = useUsdcBalance()
```

---

## Preview / Simulation Hooks

### `usePreviewDeposit`
**File:** [hooks/usePreviewDeposit.ts](../hooks/usePreviewDeposit.ts)

Simulates a deposit to show how many shares the user would receive.

```typescript
const { isPreviewingDeposit, previewByAssets } = usePreviewDeposit()

// Call it:
const shares: bigint | null = await previewByAssets(amountInWei)
```

Used in `DepositForm` to display "You will receive X shares".

---

### `usePreviewWithdraw`
**File:** [hooks/usePreviewWithdraw.ts](../hooks/usePreviewWithdraw.ts)

Simulates a withdrawal to show how much USDC the user would receive.

```typescript
const { isPreviewingWithdraw, previewByShares } = usePreviewWithdraw()

// Call it:
const usdcOut: bigint | null = await previewByShares(sharesInWei)
```

Used in `WithdrawForm` to display "You will receive X USDC".

---

## Transaction Hooks

### `useAllowance`
**File:** [hooks/useAllowance.ts](../hooks/useAllowance.ts)

Checks how much USDC the vault is currently approved to spend on behalf of the user.

```typescript
const { isLoadingAllowance, refetchAllowance } = useAllowance()
// returns the allowance bigint via callback
```

Used in `DepositForm` to decide whether to show the Approve button first.

---

### `useApprove`
**File:** [hooks/useApprove.ts](../hooks/useApprove.ts)

Sends an ERC-20 `approve` transaction, authorising the vault to pull USDC.

```typescript
const { approve, isApproving } = useApprove()

// Call it:
await approve(amountInWei)  // triggers wallet signature prompt
```

Returns `isApproving: boolean` for loading UI state.

---

### `useDeposit`
**File:** [hooks/useDeposit.ts](../hooks/useDeposit.ts)

Wrapper around `useWrite.deposit`. Sends the deposit transaction.

```typescript
const { isDepositing, submitDeposit } = useDeposit()

const success = await submitDeposit(amountInWei)
```

---

### `useWithdraw`
**File:** [hooks/useWithdraw.ts](../hooks/useWithdraw.ts)

Wrapper around `useWrite.withdraw`. Sends the withdrawal transaction.

```typescript
const { isWithdrawing, submitWithdraw } = useWithdraw()

const success = await submitWithdraw(sharesInWei)
```

---

## Error Handling Hook

### `useDecodedError`
**File:** [hooks/useDecodedError.ts](../hooks/useDecodedError.ts)

Converts raw contract errors into user-readable strings using the `ethers-decode-error` library.

```typescript
const decodeError = useDecodedError()

try {
  await vaultContract.deposit(amount)
} catch (err) {
  const message = await decodeError(err)
  toast.error(message)
}
```

**Error map:**

| Contract Error | User Message |
|---------------|-------------|
| `ZeroAmount` | "Amount must be greater than zero" |
| `InsufficientShares` | "You don't have enough shares" |
| `ZeroSharesMinted` | "Deposit too small — no shares would be minted" |
| `ERC20CallFailed` | "Token transfer failed" |
| `ZeroAddress` | "Invalid address" |
| `InvalidFeeRate` | "Invalid fee rate" |
| `ReentrancyGuardReentrantCall` | "Reentrant call detected" |

---

## Hook Dependency Tree

```
Component
    │
    ├── useVaultBalance ──────► useRead ──► useContract(false) ──► useRunner
    ├── useUserShares ────────► useRead
    ├── useUserBalance ───────► useRead
    ├── useUserDeposits ──────► useRead
    ├── usePreviewDeposit ────► useRead
    ├── usePreviewWithdraw ───► useRead
    │
    ├── useUsdcBalance ───────► useErc20Contract(false) ──────────► useRunner
    ├── useAllowance ─────────► useErc20Contract(false)
    │
    ├── useApprove ───────────► useErc20Contract(true) ───────────► useRunner
    │
    ├── useDeposit ───────────► useWrite ──► useContract(true) ────► useRunner
    └── useWithdraw ──────────► useWrite
```
