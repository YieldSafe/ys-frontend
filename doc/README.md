# YieldSafe Frontend — Documentation Hub

YieldSafe is a non-custodial DeFi savings application that lets users deposit USDC and earn yield automatically through Aave V3 on Base Sepolia.

---

## Documentation Index

| Document | Description |
|----------|-------------|
| [Setup Guide](./setup.md) | Installation, environment variables, and local dev |
| [Architecture Overview](./architecture.md) | System design, diagrams, component hierarchy |
| [Folder Structure](./folder-structure.md) | Every directory and file explained |
| [Smart Contract Integration](./smart-contracts.md) | ABI reference, addresses, function signatures |
| [Hooks Reference](./hooks.md) | All 16 custom hooks: purpose, params, return values |
| [Component Reference](./components.md) | All components: props, responsibilities, dependencies |
| [Wallet Connect Flow](./flows/wallet-connect.md) | AppKit setup, connection lifecycle |
| [Deposit Flow](./flows/deposit.md) | Approve + Deposit end-to-end |
| [Withdraw Flow](./flows/withdraw.md) | Share redemption end-to-end |
| [Token Approval Flow](./flows/token-approval.md) | ERC20 allowance pattern |
| [Deployment Guide](./deployment.md) | Vercel, environment setup, production checklist |
| [Troubleshooting](./troubleshooting.md) | Common errors and fixes |

---

## Quick Reference

**Network:** Base Sepolia (Chain ID `84532`)

**Core Contracts:**
- `YieldSaveVault` — main vault (address via `NEXT_PUBLIC_YIELD_SAVE_CONTRACT_ADDRESS`)
- `USDC` — ERC-20 token (address via `NEXT_PUBLIC_USDC_CONTRACT_ADDRESS`)

**Primary User Flows:**
1. Connect Wallet → Deposit USDC → Earn Yield → Withdraw USDC + Yield
2. Fee: 5% on yield only (not principal), deducted at withdrawal

**Key Stack:**
- Next.js 16 + React 19 (App Router)
- Reown AppKit (formerly WalletConnect) for wallet connection
- ethers.js v6 for contract interaction
- Tailwind CSS v4 with dark/light theming
