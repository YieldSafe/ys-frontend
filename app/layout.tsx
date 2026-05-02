import "./globals.css";
import { ReactNode } from "react";
import type { Metadata } from "next";

import Providers from "./providers";

export const metadata: Metadata = {
  title: "YieldSafe — Your savings, always earning",
  description: "Non-custodial DeFi savings vault on Base Sepolia. Deposit USDC, earn yield automatically via Aave V3. Withdraw anytime.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
