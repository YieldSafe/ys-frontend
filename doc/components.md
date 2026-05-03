# Component Reference

All components live in [components/](../components/). Components receive data via props — they do not fetch contract data directly (hooks are called in page-level components and passed down).

---

## Layout / Navigation

### `AppNavbar`
**File:** [components/ui/AppNavbar.tsx](../components/ui/AppNavbar.tsx)

Top navigation bar shown on the dashboard.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `activeTab` | `Tab` | Currently selected tab |
| `setActiveTab` | `(t: Tab) => void` | Tab change handler |
| `theme` | `"dark" \| "light"` | Current theme |
| `toggleTheme` | `() => void` | Theme toggle handler |
| `address` | `string \| undefined` | Connected wallet address |
| `onDisconnect` | `() => void` | Disconnect handler |

**Exports:**
```typescript
export type Tab = "deposit" | "withdraw" | "rewards" | "stats"
```

**Responsibilities:**
- Renders logo and app name
- Shows tab navigation buttons with active state
- Displays shortened wallet address when connected (`formatAddress`)
- Provides disconnect button
- Sun/moon icons for theme toggle

---

### `Icons`
**File:** [components/ui/Icons.tsx](../components/ui/Icons.tsx)

Static SVG icon components. No props.

| Export | Description |
|--------|-------------|
| `SunIcon` | Light mode icon |
| `MoonIcon` | Dark mode icon |
| `Logo` | YieldSafe logo — teal square with triangle |

---

## Dashboard Components

### `BalanceCards`
**File:** [components/Dashboard/BalanceCards.tsx](../components/Dashboard/BalanceCards.tsx)

Two-card layout showing wallet balance and vault position side by side.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `usdcBalance` | `bigint` | Raw USDC balance (6 decimals) |
| `userBalance` | `bigint` | Raw vault position value (6 decimals) |
| `userDeposits` | `bigint` | Principal deposited (for yield progress bar) |

**Displays:**
- Left card: Wallet USDC balance + Buy/Send action buttons
- Right card: Savings vault position + yield progress indicator
- All amounts formatted with `formatUnits(value, 6)` and shown to 2 decimal places

---

### `StatsGrid`
**File:** [components/Dashboard/StatsGrid.tsx](../components/Dashboard/StatsGrid.tsx)

4-column protocol statistics row.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `vaultBalance` | `bigint` | Live TVL from contract |

**Displays:**
- Total TVL (live from `vaultBalance`)
- APR: 4.8% (currently static — sourced from Aave's current rate)
- Active Users: 4,207 (static display)
- Lockup: "None" (no lockup period)

---

### `ActionTabs`
**File:** [components/Dashboard/ActionTabs.tsx](../components/Dashboard/ActionTabs.tsx)

Tab selector for switching between app sections.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `activeTab` | `Tab` | Currently active tab |
| `setActiveTab` | `(t: Tab) => void` | Handler for tab change |

**Tabs:** `deposit` | `withdraw` | `rewards` | `stats`

Active tab has teal background highlight and underline indicator.

---

### `RewardsTab`
**File:** [components/Dashboard/RewardsTab.tsx](../components/Dashboard/RewardsTab.tsx)

Shows the user's accrued yield.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `userBalance` | `bigint` | Current vault position value |
| `userDeposits` | `bigint` | Original principal deposited |
| `userShares` | `bigint` | User's share token balance |

**Computed:**
```typescript
accruedYield = userBalance - userDeposits  // always ≥ 0
```

**Displays:**
- Accrued yield in USDC
- All-time profit label
- Share balance
- Live update indicator (pulsing dot)

---

### `StatsTab`
**File:** [components/Dashboard/StatsTab.tsx](../components/Dashboard/StatsTab.tsx)

Detailed view of vault and user position statistics.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `vaultBalance` | `bigint` | Total vault TVL |
| `userBalance` | `bigint` | User's vault position |
| `userShares` | `bigint` | User's shares |
| `address` | `string \| undefined` | Connected wallet address |

**Sections:**
- **Vault Overview:** APR, TVL, fee rate (5%)
- **Your Position:** position value, share balance, wallet address
- **Link:** BaseScan contract link for verification

---

## Deposit Components

### `DepositForm`
**File:** [components/Deposit/DepositForm.tsx](../components/Deposit/DepositForm.tsx)

The main deposit UI. Handles the full approve-then-deposit flow.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `usdcBalance` | `bigint` | Max deposit amount (wallet balance) |
| `exchangeRate` | `bigint` | Shares per USDC (from `previewDeposit`) |
| `onSuccess` | `() => void` | Called after successful deposit to trigger data refresh |
| `isConnected` | `boolean` | Whether a wallet is connected |

**Hooks used internally:**
- `usePreviewDeposit` — live shares preview as user types
- `useAllowance` — checks if approval is needed
- `useApprove` — sends approve transaction
- `useDeposit` — sends deposit transaction
- `useDecodedError` — formats errors for toast

**State:**
- `depositAmt: string` — raw input string
- `depositPreview: bigint | null` — calculated shares to receive
- `currentAllowance: bigint | null` — current vault allowance

**Flow logic:**
```
needsApproval = currentAllowance < parsedDepositAmount

[if needsApproval]
  → Show "Approve USDC" button
  → On click: useApprove.approve(amount) → refresh allowance

[once approved]
  → Show "Deposit" button
  → On click: useDeposit.submitDeposit(amount) → onSuccess()
```

**Displays:**
- Amount input with MAX button (fills `usdcBalance`)
- Exchange rate (USDC → shares)
- Shares to receive (live preview)
- Approve / Deposit button (switches based on allowance state)

---

## Withdraw Components

### `WithdrawForm`
**File:** [components/Withdraw/WithdrawForm.tsx](../components/Withdraw/WithdrawForm.tsx)

The main withdrawal UI. Allows users to redeem shares for USDC.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `userShares` | `bigint` | Max shares the user can withdraw |
| `onSuccess` | `() => void` | Called after successful withdrawal |
| `isConnected` | `boolean` | Whether a wallet is connected |

**Hooks used internally:**
- `usePreviewWithdraw` — live USDC preview as user types shares
- `useWithdraw` — sends withdraw transaction
- `useDecodedError` — formats errors for toast

**State:**
- `withdrawAmt: string` — raw input string (shares)
- `withdrawPreview: bigint | null` — calculated USDC to receive

**Displays:**
- Shares input with MAX button
- USDC to receive (after fee)
- Yield earned (for this withdrawal)
- Protocol fee (5% of yield)
- Network cost estimate
- "Withdraw aUSDC" button

---

## Component Data Flow

```
app/app/page.tsx
  (owns all state, calls all hooks)
         │
         │ props
         ├──────────────────────────────────────────────────────┐
         ▼                                                       ▼
  <BalanceCards                                        <AppNavbar
    usdcBalance={usdcBalance}                           activeTab={activeTab}
    userBalance={userBalance}                           setActiveTab={setActiveTab}
    userDeposits={userDeposits}                         address={address}
  />                                                    theme={theme}
         │                                              toggleTheme={toggleTheme}
         │                                             />
         ▼
  <StatsGrid vaultBalance={vaultBalance} />
         │
         ▼
  <ActionTabs activeTab={activeTab} setActiveTab={setActiveTab} />
         │
         ├── [deposit]  → <DepositForm usdcBalance exchangeRate onSuccess isConnected />
         ├── [withdraw] → <WithdrawForm userShares onSuccess isConnected />
         ├── [rewards]  → <RewardsTab userBalance userDeposits userShares />
         └── [stats]    → <StatsTab vaultBalance userBalance userShares address />
```
