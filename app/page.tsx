"use client";

import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import "../connection";
import { useUserBalance } from "../hooks/useUserBalance";
import { useState } from "react";

export default function HomePage() {
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();
  const { isLoadingUserBalance, refetchUserBalance } = useUserBalance();
  // const { balance, setBalance } = useState();

  const handleConnectWallet = () => {
    open();
  };

  const handleReadBalance = async () => {
    const balance = await refetchUserBalance();
    // setBalance(balance)
    console.log("balance", balance);
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>YieldSave Dashboard</h1>
      <p>Your frontend is now working.</p>
      <p>{isConnected ? "Wallet connected" : "Wallet not connected"}</p>
      <button onClick={handleConnectWallet}>Connect wallet</button>
      <button onClick={handleReadBalance} disabled={isLoadingUserBalance}>
        {isLoadingUserBalance ? "Loading balance..." : "Read user balance"}
      </button>
      {/* <p>balance: {balance}</p> */}
    </main>
  );
}
