import { createAppKit } from "@reown/appkit/react"
import { EthersAdapter } from "@reown/appkit-adapter-ethers"
import { baseSepolia, type AppKitNetwork } from "@reown/appkit/networks"

const projectId = process.env.NEXT_PUBLIC_APPKIT_PROJECT_ID ?? ""

if (!projectId) {
	console.warn("NEXT_PUBLIC_APPKIT_PROJECT_ID missing")
}

const networks = [baseSepolia] as [AppKitNetwork, ...AppKitNetwork[]]

const metadata = {
	name: "Yield_Save",
	description: "Yield Save",
	url: "https://ys-frontend-one.vercel.app",
	icons: ["https://avatars.mywebsite.com/"],
}

export const appkit = createAppKit({
	adapters: [new EthersAdapter()],
	networks,
	metadata,
	projectId,
	allowUnsupportedChain: false,
	allWallets: "SHOW",
	defaultNetwork: baseSepolia,
	enableEIP6963: true,
	features: {
		analytics: true,
		allWallets: true,
		email: false,
		socials: [],
	},
})

// import { createAppKit } from "@reown/appkit/react";
// import { EthersAdapter } from "@reown/appkit-adapter-ethers";
// import {
//   baseSepolia,
//   type AppKitNetwork,
// } from "@reown/appkit/networks";

// const projectId = process.env.NEXT_PUBLIC_APPKIT_PROJECT_ID || "default_project_id";
// if (!projectId) {
//   throw new Error(
//     "Missing NEXT_PUBLIC_APPKIT_PROJECT_ID. Set it in your .env file.",
//   );
// }

// export const BaseSepolia: AppKitNetwork = {
//   ...baseSepolia,
//   id: 84532,
//   chainNamespace: "eip155",
//   caipNetworkId: "eip155:84532",
// };

// // 2. Set the networks
// const networks: [AppKitNetwork, ...AppKitNetwork[]] = [BaseSepolia];

// // 3. Create a metadata object - optional
// const metadata = {
//   name: "Yield_Save",
//   description: "Yield Save",
//   url: "https://mywebsite.com",
//   icons: ["https://avatars.mywebsite.com/"],
// };

// // 4. Create a AppKit instance
// export const appkit = createAppKit({
//   adapters: [new EthersAdapter()],
//   networks,
//   metadata,
//   projectId,
//   allowUnsupportedChain: false,
//   allWallets: "SHOW",
//   defaultNetwork: BaseSepolia,
//   enableEIP6963: true,
//   features: {
//     analytics: true,
//     allWallets: true,
//     email: false,
//     socials: [],
//   },
// });

// appkit.switchNetwork(baseSepolia);
