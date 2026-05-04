# YieldSafe Frontend — Documentation Hub

YieldSafe is a non-custodial DeFi savings application that lets users deposit USDC and earn yield automatically through Aave V3 on Base Sepolia.

---

## Documentation Index

| Document                                                   | Description                                                                                   |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [Setup Guide](./setup.md)                                  | Clone the repo, install dependencies, configure env vars, and run the app locally             |
| [Architecture Overview](./architecture.md)                 | System design, component hierarchy, data flow diagrams, and deployment topology               |
| [Folder Structure](./folder-structure.md)                  | Every directory and file explained — what it does, what it exports, and why it exists         |
| [Smart Contract Integration](./smart-contracts.md)         | ABI reference, function signatures, events, custom errors, and read vs write paths            |
| [Hooks Reference](./hooks.md)                              | All 16 custom hooks — purpose, parameters, return values, and full dependency tree            |
| [Component Reference](./components.md)                     | Every component — props, responsibilities, hooks used, and top-level data flow                |
| [Wallet Connect Flow](./flows/wallet-connect.md)           | AppKit initialisation, connection lifecycle, hooks used, and disconnection handling           |
| [Deposit Flow](./flows/deposit.md)                         | Approve and deposit end-to-end — flow diagram, on-chain execution, and error handling         |
| [Withdraw Flow](./flows/withdraw.md)                       | Redeem shares for USDC — flow diagram, fee calculation, preview, and error handling           |
| [Token Approval Flow](./flows/token-approval.md)           | Why ERC-20 approval is required, the exact code path, and allowance check logic               |
| [Deployment Guide](./deployment.md)                        | Deploy to Vercel, set env vars, production checklist, contract upgrades, and rollback         |
| [Troubleshooting](./troubleshooting.md)                    | 20+ common errors with root causes, fixes, and guidance on where to get further help         |
