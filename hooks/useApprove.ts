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

export const useApprove = () => {
  const { address } = useAppKitAccount();
  const usdcContract = useUsdcContract(true);
  const decodeError = useDecodedError();
  const [isApproving, setIsApproving] = useState(false);

  const approve = useCallback(
    async (amount: bigint): Promise<boolean> => {
      if (!address) {
        toast.error("Wallet not connected");
        return false;
      }
      if (!usdcContract) {
        toast.error("USDC contract not found");
        return false;
      }

      try {
        setIsApproving(true);
        const tx = await usdcContract.approve(
          getAddress(YIELD_SAVE_CONTRACT_ADDRESS),
          amount,
        );
        const receipt = await tx.wait();
        return receipt?.status === 1;
      } catch (error) {
        toast.error(await decodeError(error));
        return false;
      } finally {
        setIsApproving(false);
      }
    },
    [address, decodeError, usdcContract],
  );

  return { approve, isApproving };
};
