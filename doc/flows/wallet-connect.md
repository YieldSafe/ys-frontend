# Wallet Connect Flow

## Overview

YieldSafe uses **Reown AppKit** (formerly WalletConnect AppKit) for wallet connection. AppKit provides a pre-built modal that supports MetaMask, WalletConnect-compatible wallets, and Coinbase Wallet.

---

## Initialization

AppKit is initialized once at app startup in [connection.ts](../../connection.ts):

```typescript
import { createAppKit } from "@reown/appkit/react"
import { EthersAdapter } from "@reown/appkit-adapter-ethers"
import { baseSepolia } from "@reown/appkit/networks"

export const modal = createAppKit({
  adapters: [new EthersAdapter()],
  networks: [baseSepolia],
  metadata: {
    name: "Yield_Save",
    description: "Yield Save",
    url: "https://ys-frontend-one.vercel.app",
    icons: ["https://avatars.mywebsite.com/"]
  },
  projectId: process.env.NEXT_PUBLIC_APPKIT_PROJECT_ID,
  features: {
    analytics: true,
    allWallets: true,
    email: false,
    socials: []
  }
})
```

This file is imported by [app/providers.tsx](../../app/providers.tsx), which ensures AppKit boots before any component renders.

---

## Connection Flow

```
User Action: Clicks "Connect Wallet"
        │
        ▼
AppKit Modal Opens
  ├── MetaMask (browser extension)
  ├── WalletConnect (mobile scan)
  ├── Coinbase Wallet
  └── ... (all wallets enabled)
        │
        ▼
User Selects & Approves Connection
        │
        ▼
AppKit sets internal state:
  address: "0xABC..."
  isConnected: true
  walletProvider: EIP-1193 provider
        │
        ▼
useAppKitAccount() returns:
  { address, isConnected, caipAddress }
        │
        ▼
app/app/page.tsx detects connection change
useEffect([address]) → refreshData()
        │
        ▼
All balances fetched:
  - usdcBalance (wallet USDC)
  - userShares (vault shares)
  - userBalance (vault position)
  - userDeposits (principal)
  - vaultBalance (TVL)
        │
        ▼
Dashboard UI renders with user data
```

---

## AppKit Hooks Used

### `useAppKitAccount()`
Returns the connected wallet state.

```typescript
const { address, isConnected, caipAddress } = useAppKitAccount()
```

| Field | Type | Description |
|-------|------|-------------|
| `address` | `string \| undefined` | Connected wallet address |
| `isConnected` | `boolean` | Whether a wallet is connected |
| `caipAddress` | `string \| undefined` | CAIP-10 format address (e.g., `eip155:84532:0x...`) |

---

### `useAppKit()`
Provides modal control functions.

```typescript
const { open, close } = useAppKit()

// Open the connect modal:
open()

// Open to a specific view:
open({ view: "Account" })
```

---

### `useAppKitProvider("eip155")`
Returns the raw EIP-1193 wallet provider, used by `useRunner.ts` to create an ethers `BrowserProvider`.

```typescript
const { walletProvider } = useAppKitProvider("eip155")
const provider = new BrowserProvider(walletProvider)
const signer = await provider.getSigner()
```

---

## Disconnection Flow

```
User clicks "Disconnect" in AppNavbar
        │
        ▼
modal.disconnect() called
        │
        ▼
AppKit clears internal state
  address: undefined
  isConnected: false
        │
        ▼
useAppKitAccount() returns isConnected: false
        │
        ▼
Dashboard switches to "Connect Wallet" screen
All balance state reset to 0n
```

---

## Network Enforcement

AppKit is configured with `networks: [baseSepolia]` only. If the user's wallet is on the wrong network, AppKit will prompt them to switch to Base Sepolia (Chain ID 84532) before allowing transactions.

---

## Component Integration

```
app/app/page.tsx
  const { address, isConnected } = useAppKitAccount()
  const { open } = useAppKit()

  return (
    <>
      {!isConnected ? (
        <button onClick={() => open()}>Connect Wallet</button>
      ) : (
        <Dashboard address={address} />
      )}
    </>
  )
```

```
AppNavbar.tsx
  const { open } = useAppKit()

  // Show connect button when disconnected
  // Show address + disconnect button when connected
```
