import { JsonRpcProvider } from "ethers";

const rpcUrl =
  process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ||
  process.env.NEXT_PUBLIC_LISK_TESTNET_RPC_URL;

if (!rpcUrl) {
  throw new Error(
    "Missing NEXT_PUBLIC_SEPOLIA_RPC_URL (or NEXT_PUBLIC_LISK_TESTNET_RPC_URL).",
  );
}

export const jsonRpcProvider = new JsonRpcProvider(
  rpcUrl,
);
