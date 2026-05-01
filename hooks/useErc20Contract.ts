import { Contract, getAddress } from "ethers";
import { useMemo } from "react";
import { ERC20_ABI } from "../lib/abis/erc20";
import useRunners from "./useRunner";

const USDC_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS;

if (!USDC_CONTRACT_ADDRESS) {
  throw new Error(
    "Missing NEXT_PUBLIC_USDC_CONTRACT_ADDRESS. Set it in your .env file.",
  );
}

export const useUsdcContract = (withSigner = false) => {
  const { readOnlyProvider, signer } = useRunners();

  return useMemo(() => {
    if (withSigner) {
      if (!signer) return null;
      return new Contract(getAddress(USDC_CONTRACT_ADDRESS), ERC20_ABI, signer);
    }

    return new Contract(
      getAddress(USDC_CONTRACT_ADDRESS),
      ERC20_ABI,
      readOnlyProvider,
    );
  }, [readOnlyProvider, signer, withSigner]);
};
