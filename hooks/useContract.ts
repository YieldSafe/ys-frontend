import { useMemo } from "react";
import { Contract } from "ethers";
import { getAddress } from "ethers";
import YieldSaveVaultAbi from "../lib/abis/YieldSaveVault.json";
import useRunners from "./useRunner";

const YIELD_SAVE_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_YIELD_SAVE_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

if (!YIELD_SAVE_CONTRACT_ADDRESS) {
  throw new Error(
    "Missing NEXT_PUBLIC_YIELD_SAVE_CONTRACT_ADDRESS. Set it in your .env file.",
  );
}

console.log("yieald contract", YIELD_SAVE_CONTRACT_ADDRESS);


const yieldVaultAbi = YieldSaveVaultAbi;


export const useYieldSaveContract = (withSigner = false) => {
  const { readOnlyProvider, signer } = useRunners();

  return useMemo(() => {
    if (withSigner) {
      if (!signer) return null;
      return new Contract(
        getAddress(YIELD_SAVE_CONTRACT_ADDRESS),
        yieldVaultAbi,
        signer,
      );
    }

    return new Contract(
      getAddress(YIELD_SAVE_CONTRACT_ADDRESS),
      yieldVaultAbi,
      readOnlyProvider,
    );
  }, [readOnlyProvider, signer, withSigner]);
};

// Backward-compatible alias for existing imports while migrating names.
export const useTodoContract = useYieldSaveContract;
