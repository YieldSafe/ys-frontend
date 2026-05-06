# Smart Contract Integration

## Contracts Used

| Contract | Address Source | Network | Purpose |
|----------|---------------|---------|---------|
| `YieldSaveVault` | `NEXT_PUBLIC_YIELD_SAVE_CONTRACT_ADDRESS` | Base Sepolia (84532) | Core vault: deposit, earn, withdraw |
| `USDC` | `NEXT_PUBLIC_USDC_CONTRACT_ADDRESS` | Base Sepolia (84532) | ERC-20 token deposited/withdrawn |

---

## YieldSaveVault — Full Function Reference

ABI file: [lib/abis/YieldSaveVault.json](../lib/abis/YieldSaveVault.json)

### Write Functions (require wallet signature)

#### `deposit(uint256 amount) → uint256 shares`
Deposits USDC into the vault and mints share tokens to the caller.

| Parameter | Type | Description |
|-----------|------|-------------|
| `amount` | `uint256` | USDC amount in wei (6 decimals). Must be > 0 |

| Return | Type | Description |
|--------|------|-------------|
| `shares` | `uint256` | Share tokens minted to user |

**Prerequisites:** Caller must have approved the vault for at least `amount` USDC.

**Reverts with:**
- `ZeroAmount` — if amount is 0
- `ZeroSharesMinted` — if calculated shares round to 0
- `ERC20CallFailed` — if USDC transferFrom fails

---

#### `withdraw(uint256 shares) → uint256 payout`
Burns share tokens and returns USDC (principal + yield, minus fee) to the caller.

| Parameter | Type | Description |
|-----------|------|-------------|
| `shares` | `uint256` | Share token amount to redeem |

| Return | Type | Description |
|--------|------|-------------|
| `payout` | `uint256` | USDC returned to caller after fee |

**Fee logic:** `fee = 5% × (withdrawValue - originalDeposit)` — fee only applies to yield portion.

**Reverts with:**
- `ZeroAmount` — if shares is 0
- `InsufficientShares` — if caller has fewer shares than requested

---

### Read Functions (no signature, no gas)

#### `previewDeposit(uint256 assets) → uint256 shares`
Calculates how many shares a given USDC amount would produce. Used to show users their expected shares before depositing.

---

#### `previewWithdraw(uint256 shares) → uint256 payout`
Calculates how much USDC (after fee) a given share amount would return. Used to show withdrawal preview.

---

#### `previewWithdrawFor(address user, uint256 shares) → uint256`
Same as `previewWithdraw` but scoped to a specific user's deposit basis for accurate fee calculation.

---

#### `getVaultBalance() → uint256`
Returns total USDC value held in the vault (TVL). Shown in StatsGrid and StatsTab.

---

#### `getUserBalance(address user) → uint256`
Returns the current USDC value of a user's position (principal + accrued yield). Used in `BalanceCards`.

---

#### `userShares(address user) → uint256`
Returns the user's share token balance. Used as the max in `WithdrawForm`.

---

#### `userDeposits(address user) → uint256`
Returns the total USDC the user has deposited (sum of all deposits, not reduced by withdrawals). Used to calculate yield: `yield = getUserBalance() - userDeposits()`.

---

#### `totalShares() → uint256`
Returns total shares outstanding across all users.

---

#### `feeRate() → uint256`
Returns the protocol fee in basis points. Currently `500` = 5%.

---

#### `aUsdc() → address`
Address of the Aave aUSDC token (interest-bearing USDC held by the vault).

---

#### `usdc() → address`
Address of the USDC token accepted for deposits.

---

#### `aavePool() → address`
Address of the Aave V3 lending pool the vault interacts with.

---

#### `treasury() → address`
Address where protocol fees are sent.

---

### Events

#### `Deposited(address indexed user, uint256 amount, uint256 shares)`
Emitted on every successful deposit.

#### `Withdrawn(address indexed user, uint256 shares, uint256 payout)`
Emitted on every successful withdrawal.

---

### Custom Errors

| Error | Meaning | When thrown |
|-------|---------|------------|
| `ZeroAmount` | Amount or shares parameter is 0 | deposit(0) or withdraw(0) |
| `InsufficientShares` | User requests more shares than they own | withdraw(tooMany) |
| `ZeroSharesMinted` | Deposit too small, rounds to 0 shares | Extremely small deposits |
| `ERC20CallFailed` | USDC transfer/transferFrom returned false | Token transfer issue |
| `ZeroAddress` | Invalid zero address provided | Constructor/admin calls |
| `InvalidFeeRate` | Fee rate set above allowed maximum | Admin fee change |
| `ReentrancyGuardReentrantCall` | Reentrancy attempt detected | Malicious reentrant call |

The `useDecodedError.ts` hook maps all these to human-readable strings for display.

---

## USDC Token — ERC-20 Functions Used

ABI file: [lib/abis/erc20.ts](../lib/abis/erc20.ts)

| Function | Usage |
|----------|-------|
| `balanceOf(address) → uint256` | Fetch user's USDC balance |
| `allowance(address owner, address spender) → uint256` | Check if vault is approved to spend |
| `approve(address spender, uint256 amount) → bool` | Approve vault to pull USDC |
| `decimals() → uint8` | Returns 6 (USDC uses 6 decimal places) |
| `symbol() → string` | Returns "USDC" |

---

## Important: USDC Decimals

USDC uses **6 decimal places** (not 18 like ETH). All `bigint` values in the app represent USDC in 6-decimal wei units.

```typescript
// 1 USDC = 1_000_000n (1e6)
// Display: formatUnits(balance, 6)
// Input:   parseUnits("10", 6) → 10_000_000n
```

When reading or comparing amounts, always use `formatUnits(value, 6)` for display and `parseUnits(inputString, 6)` for contract calls.

---

## Contract Interaction Diagram

```
Frontend App
     │
     ├── READ path (no wallet required)
     │       │
     │       ▼
     │   constants/provider.ts
     │   JsonRpcProvider (public RPC)
     │       │
     │       ▼
     │   useContract({ withSigner: false })
     │   useErc20Contract({ withSigner: false })
     │       │
     │       ▼
     │   Contract.balanceOf() / getVaultBalance()
     │   / previewDeposit() etc.
     │       │
     │       ▼
     │   bigint returned → formatUnits → display
     │
     └── WRITE path (wallet required)
             │
             ▼
         useRunner.ts
         walletProvider (EIP-1193 from AppKit)
         BrowserProvider → getSigner()
             │
             ▼
         useContract({ withSigner: true })
         useErc20Contract({ withSigner: true })
             │
             ├── usdcContract.approve(vault, amount)
             │         tx = await approve(...)
             │         await tx.wait()
             │
             └── vaultContract.deposit(amount)
                       tx = await deposit(...)
                       receipt = await tx.wait()
                       receipt.status === 1 → success
```
