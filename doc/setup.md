# Setup Guide

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | ≥ 18 | LTS recommended |
| npm | ≥ 9 | Bundled with Node |
| Git | Any | For cloning |
| Wallet | MetaMask / any EVM wallet | Base Sepolia testnet |

---

## 1. Clone the Repository

```bash
git clone <repository-url>
cd ys-frontend
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Reown (AppKit) project ID
# Get yours at: https://cloud.reown.com
NEXT_PUBLIC_APPKIT_PROJECT_ID=your_project_id_here

# YieldSaveVault smart contract address on Base Sepolia
NEXT_PUBLIC_YIELD_SAVE_CONTRACT_ADDRESS=0x...

# USDC token contract address on Base Sepolia
NEXT_PUBLIC_USDC_CONTRACT_ADDRESS=0x...

# Base Sepolia RPC URL (defaults to public endpoint if not set)
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
```

> **Why `NEXT_PUBLIC_` prefix?** Next.js only exposes env vars to the browser bundle when they are prefixed with `NEXT_PUBLIC_`. All four variables are read client-side.

### Getting a Reown Project ID

1. Go to [cloud.reown.com](https://cloud.reown.com)
2. Create a new project
3. Set the allowed domains to include `localhost:3000` for local development
4. Copy the Project ID into `.env.local`

### Getting Test USDC on Base Sepolia

Base Sepolia uses a test version of USDC. You can mint test tokens from the Circle faucet or the Base Sepolia USDC faucet. Ensure your wallet also has Base Sepolia ETH for gas (available from the Base faucet at `https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet`).

---

## 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page.
Open [http://localhost:3000/app](http://localhost:3000/app) for the dashboard.

---

## 5. Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server with hot reload |
| `npm run build` | Compile for production (runs type-check + lint) |
| `npm run start` | Start the compiled production server |
| `npm run lint` | Run ESLint across the project |
| `npm run test` | Placeholder — no tests yet |

---

## 6. Connect Your Wallet

1. Make sure MetaMask (or any EVM wallet) is installed
2. Add Base Sepolia network to your wallet:
   - **Network Name:** Base Sepolia
   - **RPC URL:** `https://sepolia.base.org`
   - **Chain ID:** `84532`
   - **Currency:** ETH
   - **Explorer:** `https://sepolia.basescan.org`
3. Click **Connect Wallet** in the app and select your wallet

---

## 7. Troubleshooting Setup

See [Troubleshooting Guide](./troubleshooting.md) for common setup errors.
