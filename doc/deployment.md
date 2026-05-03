# Deployment Guide

## Production Environment

YieldSafe frontend is deployed on **Vercel** and configured for automatic deployment from the `main` branch.

Live URL: `https://ys-frontend-one.vercel.app`

---

## Environment Variables

Set these in the Vercel dashboard under **Project Settings → Environment Variables**:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_APPKIT_PROJECT_ID` | Yes | Reown Cloud project ID |
| `NEXT_PUBLIC_YIELD_SAVE_CONTRACT_ADDRESS` | Yes | Deployed vault contract address |
| `NEXT_PUBLIC_USDC_CONTRACT_ADDRESS` | Yes | USDC token address on target network |
| `NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL` | Optional | Custom RPC URL (defaults to public endpoint) |

> All variables must have the `NEXT_PUBLIC_` prefix to be available in the browser bundle.

---

## Vercel Deployment

### Automatic Deployment (Recommended)

1. Push to the `main` branch
2. Vercel detects the push and starts a build automatically
3. Build command runs: `next build`
4. On success, the new version goes live at the production URL

### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## Production Build Checklist

Before merging to `main`:

- [ ] `npm run lint` passes with no errors
- [ ] `npm run build` completes without errors
- [ ] All four environment variables are set in Vercel
- [ ] Wallet connection tested on Base Sepolia
- [ ] Deposit flow tested end-to-end
- [ ] Withdrawal flow tested end-to-end
- [ ] Both dark and light themes render correctly
- [ ] Mobile layout tested (responsive design)
- [ ] Contract addresses verified on BaseScan

---

## Build Output

Next.js builds to `.next/` with:
- **Static pages:** Landing page (`/`) is pre-rendered as static HTML
- **Client-side pages:** Dashboard (`/app`) is a fully client-side React app
- **No server-side data fetching** — all data comes from RPC calls in the browser

---

## Deploying a Contract Update

When the smart contract is redeployed (e.g., after an upgrade):

1. Get the new contract address from the deployment
2. Update `NEXT_PUBLIC_YIELD_SAVE_CONTRACT_ADDRESS` in Vercel environment variables
3. If the ABI changed, update [lib/abis/YieldSaveVault.json](../lib/abis/YieldSaveVault.json)
4. Trigger a new Vercel deployment (or push a trivial commit to `main`)

> **Note:** ABI changes require a code update. Address changes alone only require an environment variable update and redeploy.

---

## Network Configuration

Current deployment targets **Base Sepolia** (testnet).

To deploy against a different network:
1. Update `connection.ts` — change `networks: [baseSepolia]` to the target network
2. Update contract addresses in environment variables
3. Update the RPC URL environment variable
4. Update any hardcoded network references (BaseScan links in `StatsTab`)

```typescript
// connection.ts — change this line:
import { baseSepolia } from "@reown/appkit/networks"
// to e.g.:
import { base } from "@reown/appkit/networks"
```

---

## CI/CD Pipeline

From `CONTRIBUTING.md`, CI checks run on every PR:

| Check | Command | Must Pass |
|-------|---------|-----------|
| Linting | `npm run lint` | Yes |
| Build | `npm run build` | Yes |
| Tests | `npm run test` | N/A (placeholder) |

Vercel also runs a preview deployment for every PR, accessible via the PR status checks.

---

## Rollback

To roll back to a previous deployment on Vercel:

1. Go to the Vercel dashboard → Deployments tab
2. Find the last working deployment
3. Click the three-dot menu → **Promote to Production**

This is instant and does not require a new build.

---

## Monitoring

- **Vercel Analytics:** Enabled via AppKit (`analytics: true` in `connection.ts`)
- **Error visibility:** Runtime errors surface as toast notifications to users
- **Transaction status:** Users see tx hash links they can verify on BaseScan
- **Contract events:** `Deposited` and `Withdrawn` events are emitted for all operations — queryable via BaseScan or The Graph
