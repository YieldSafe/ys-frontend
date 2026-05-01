import { useAppKitAccount } from "@reown/appkit/react";
import { getAddress } from "ethers";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { useDecodedError } from "./useDecodedError";
import { useUsdcContract } from "./useErc20Contract";

const YIELD_SAVE_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_YIELD_SAVE_CONTRACT_ADDRESS;

if (!YIELD_SAVE_CONTRACT_ADDRESS) {
  throw new Error(
    "Missing NEXT_PUBLIC_YIELD_SAVE_CONTRACT_ADDRESS. Set it in your .env file.",
  );
}

export const useAllowance = () => {
  const { address } = useAppKitAccount();
  const usdcContract = useUsdcContract();
  const decodeError = useDecodedError();
  const [isLoadingAllowance, setIsLoadingAllowance] = useState(false);

  const refetchAllowance = useCallback(async (): Promise<bigint | null> => {
    if (!address) {
      toast.error("Wallet not connected");
      return null;
    }
    if (!usdcContract) {
      toast.error("USDC contract not found");
      return null;
    }

    try {
      setIsLoadingAllowance(true);
      return (await usdcContract.allowance(
        address,
        getAddress(YIELD_SAVE_CONTRACT_ADDRESS),
      )) as bigint;
    } catch (error) {
      toast.error(await decodeError(error));
      return null;
    } finally {
      setIsLoadingAllowance(false);
    }
  }, [address, decodeError, usdcContract]);

  return { isLoadingAllowance, refetchAllowance };
};
