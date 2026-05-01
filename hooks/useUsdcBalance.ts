import { useAppKitAccount } from "@reown/appkit/react";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { useDecodedError } from "./useDecodedError";
import { useUsdcContract } from "./useErc20Contract";

export const useUsdcBalance = () => {
  const { address } = useAppKitAccount();
  const usdcContract = useUsdcContract();
  const decodeError = useDecodedError();
  const [isLoadingUsdcBalance, setIsLoadingUsdcBalance] = useState(false);

  const refetchUsdcBalance = useCallback(async (): Promise<bigint | null> => {
    if (!address) {
      toast.error("Wallet not connected");
      return null;
    }
    if (!usdcContract) {
      toast.error("USDC contract not found");
      return null;
    }

    try {
      setIsLoadingUsdcBalance(true);
      return (await usdcContract.balanceOf(address)) as bigint;
    } catch (error) {
      toast.error(await decodeError(error));
      return null;
    } finally {
      setIsLoadingUsdcBalance(false);
    }
  }, [address, decodeError, usdcContract]);

  return { isLoadingUsdcBalance, refetchUsdcBalance };
};
