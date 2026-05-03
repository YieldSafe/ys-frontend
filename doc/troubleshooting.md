# Troubleshooting Guide

---

## Setup Issues

### `npm install` fails with peer dependency errors

**Cause:** React 19 has peer dependency conflicts with some packages.

**Fix:**
```bash
npm install --legacy-peer-deps
```

---

### `NEXT_PUBLIC_APPKIT_PROJECT_ID is not defined`

**Cause:** `.env.local` file is missing or the variable is not set.

**Fix:**
1. Create `.env.local` in the project root (not inside `app/`)
2. Add: `NEXT_PUBLIC_APPKIT_PROJECT_ID=your_id_here`
3. Restart the dev server (`npm run dev`)

> Environment variables are loaded at build time. Changes require a server restart.

---

### `AppKit modal doesn't open` / `No wallets shown`

**Cause:** Invalid or missing project ID.

**Fix:**
1. Verify your project ID at [cloud.reown.com](https://cloud.reown.com)
2. Ensure `localhost:3000` is in the allowed origins for your Reown project
3. Check browser console for AppKit initialization errors

---

### `Cannot read properties of null` on contract calls

**Cause:** Contract address environment variable is not set, so the contract instance is `null`.

**Fix:**
1. Ensure both `NEXT_PUBLIC_YIELD_SAVE_CONTRACT_ADDRESS` and `NEXT_PUBLIC_USDC_CONTRACT_ADDRESS` are set in `.env.local`
2. Restart the dev server

---

## Wallet Connection Issues

### Wallet connects but shows wrong network

**Cause:** Wallet is connected to a network other than Base Sepolia.

**Fix:**
AppKit automatically prompts to switch networks. If it doesn't:
1. Manually switch to Base Sepolia in your wallet
2. Network details: RPC `https://sepolia.base.org`, Chain ID `84532`

---

### MetaMask shows "Pending" indefinitely

**Cause:** A stuck transaction in MetaMask.

**Fix:**
1. Open MetaMask → Settings → Advanced → Reset Account
2. This clears the nonce cache without affecting balances

---

### `useAppKitProvider` returns undefined walletProvider

**Cause:** Wallet is not yet connected when the hook is called.

**Fix:** This is handled by `useRunner.ts` — it returns `null` for `provider` and `signer` when not connected. Components check `isConnected` before calling write operations.

---

## Transaction Errors

### `ZeroAmount` error

**Cause:** Tried to deposit or withdraw with amount = 0.

**Fix:** Ensure the input field has a valid non-zero amount before submitting.

---

### `InsufficientShares` error

**Cause:** The withdraw amount exceeds the user's share balance.

**Fix:** Use the MAX button to fill in the exact share balance, or enter a lower value.

---

### `ERC20CallFailed` on deposit

**Cause:** USDC `transferFrom` failed — most likely the approval was insufficient or expired.

**Fix:**
1. Go back to the Deposit tab
2. The allowance check will detect the issue
3. Re-approve the required amount

---

### Transaction submitted but `receipt.status === 0`

**Cause:** Transaction was included in a block but reverted on-chain.

**Fix:** Check the transaction on [BaseScan](https://sepolia.basescan.org). The revert reason will be visible in the internal transactions tab. Common causes:
- Stale `previewDeposit` result (price moved between preview and submission)
- Re-entrancy attempt (very unlikely in normal use)

---

### `BAD_DATA` error in console (from `useRead.ts`)

**Cause:** The contract address is wrong, the ABI is outdated, or the node returned unexpected data.

**Symptoms:** All balance displays show 0 or null; console shows "BAD_DATA" warnings.

**Fix:**
1. Verify the contract address in `.env.local` matches the deployed contract
2. Verify the ABI in `lib/abis/YieldSaveVault.json` matches the deployed bytecode
3. Try a different RPC URL in `NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL`

---

### "Nonce too low" or "already known" error

**Cause:** A transaction with the same nonce was already broadcast.

**Fix:** Wait for the pending transaction to confirm or fail, then retry.

---

## UI / Display Issues

### Balances show as `0.000000` after connecting

**Cause:** Data fetch hasn't completed yet, or the user has no balance.

**Fix:**
- Wait 2-3 seconds after connecting — data is fetched asynchronously
- Check if the wallet has USDC balance on Base Sepolia
- Open browser console and look for RPC errors

---

### Theme doesn't persist across page refreshes

**Cause:** Theme is stored in `localStorage` as `"theme"`.

**Fix:** This is expected behaviour. If localStorage is cleared (e.g., incognito mode), the theme resets to dark. This is by design.

---

### Numbers display as very large integers (e.g., `100000000`)

**Cause:** USDC uses 6 decimal places. Raw `bigint` values need to be formatted.

**Fix (for developers):**
```typescript
import { formatUnits } from "ethers"
const display = formatUnits(rawBigInt, 6)  // "100.0"
```

Ensure any new display code uses `formatUnits(value, 6)` for USDC values.

---

## Build Errors

### `Type error: ... is not assignable to type ...`

**Cause:** TypeScript type mismatch, usually from `bigint | null` not being handled.

**Fix:** Add null checks:
```typescript
if (value !== null) {
  // use value safely
}
```

---

### `Module not found: lib/abis/...`

**Cause:** Import path is wrong or file doesn't exist.

**Fix:**
- Check the file exists at `lib/abis/YieldSaveVault.json`
- The `tsconfig.json` path alias `@/*` maps to `./src/*` — but this project uses `app/` not `src/`. Use relative imports: `../../lib/abis/YieldSaveVault.json`

---

### Build warning: `"ethers" has no exported member`

**Cause:** ethers.js v6 changed its import paths.

**Fix:** Use named imports from the correct path:
```typescript
// v6 (correct):
import { formatUnits, parseUnits, BrowserProvider } from "ethers"

// v5 (wrong):
import { ethers } from "ethers"
ethers.utils.formatUnits(...)  // does not work in v6
```

---

## Getting Help

- Check [BaseScan](https://sepolia.basescan.org) for transaction details and contract state
- Check [Reown docs](https://docs.reown.com) for AppKit issues
- Check [ethers.js v6 docs](https://docs.ethers.org/v6/) for provider/signer questions
- Open an issue in the repository with: browser console output, wallet type, and steps to reproduce
