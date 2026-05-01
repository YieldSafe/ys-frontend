import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import {
  sepolia,
  type AppKitNetwork,
} from "@reown/appkit/networks";

// 1. Get projectId
const projectId = process.env.NEXT_PUBLIC_APPKIT_PROJECT_ID;
if (!projectId) {
  throw new Error(
    "Missing NEXT_PUBLIC_APPKIT_PROJECT_ID. Set it in your .env file.",
  );
}

export const EthereumSepolia: AppKitNetwork = {
  ...sepolia,
  id: 11155111,
  chainNamespace: "eip155",
  caipNetworkId: "eip155:11155111",
};

// 2. Set the networks
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [EthereumSepolia];

// 3. Create a metadata object - optional
const metadata = {
  name: "Yield_Save",
  description: "Yield Save",
  url: "https://mywebsite.com",
  icons: ["https://avatars.mywebsite.com/"],
};

// 4. Create a AppKit instance
export const appkit = createAppKit({
  adapters: [new EthersAdapter()],
  networks,
  metadata,
  projectId,
  allowUnsupportedChain: false,
  allWallets: "SHOW",
  defaultNetwork: EthereumSepolia,
  enableEIP6963: true,
  features: {
    analytics: true,
    allWallets: true,
    email: false,
    socials: [],
  },
});

appkit.switchNetwork(sepolia);
