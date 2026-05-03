import { JsonRpcProvider } from "ethers"

const rpcUrl = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL ?? "https://sepolia.base.org"

console.warn("Readonly RPC:", rpcUrl)

export const jsonRpcProvider = new JsonRpcProvider(rpcUrl)

// import { JsonRpcProvider } from "ethers";

// const rpcUrl =
//   process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ||
//   process.env.NEXT_PUBLIC_LISK_TESTNET_RPC_URL ||
//   "https://sepolia.drpc.org";

// if (!rpcUrl) {
//   throw new Error(
//     "Missing RPC URL environment variable. Please check your .env file.",
//   );
// }

// export const jsonRpcProvider = new JsonRpcProvider(
//   rpcUrl,
// );
