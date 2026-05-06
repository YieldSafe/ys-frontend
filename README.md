# 🛡️ YieldSafe

**The Next-Generation Yield Aggregator for USDC on Base.**

YieldSafe is a professional, non-custodial yield vault that allows users to maximize their USDC returns by routing liquidity directly into top-tier DeFi protocols like Aave V3. Built on Base Sepolia for high speed and low fees.

![YieldSafe Logo](public/logo.svg)

## 🚀 Features

- **USDC Optimized**: Specifically designed for USDC liquidity on the Base Network.
- **Auto-Compounding**: Yield is harvested and compounded every block via interest-bearing receipt tokens (aUSDC).
- **One-Click Deposits**: Combined Approve + Deposit transaction flow for a seamless user experience.
- **Glassmorphism UI**: A futuristic, high-end DeFi dashboard designed for professional traders.
- **Institutional-Grade Security**: Built on the battle-tested Aave V3 protocol architecture.

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), Tailwind CSS
- **Blockchain**: Wagmi, Viem, Reown (AppKit)
- **Styling**: Vanilla CSS Variables + Tailwind Utility Classes
- **Network**: Base Sepolia

## 📖 Documentation

Detailed documentation can be found in the `/doc` directory:

- [Architecture Overview](doc/architecture.md)
- [Setup & Installation](doc/setup.md)
- [Smart Contract Integration](doc/smart-contracts.md)
- [Component Library](doc/components.md)
- [Transaction Flows](doc/flows/deposit.md)

## 🏗️ Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/emdevelopa/ys-frontend.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Create a `.env` file based on the provided template and add your project ID from Reown Cloud.

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 🔐 Security

YieldSafe is non-custodial. Your funds are always in the vault or the underlying liquidity pool (Aave). The smart contract interactions are verified on Base Sepolia.

---

Built with ❤️ by [emdevelopa](https://github.com/emdevelopa)
