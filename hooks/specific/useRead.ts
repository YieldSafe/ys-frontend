import { useAppKitAccount } from "@reown/appkit/react";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { useDecodedError } from "../useDecodedError";
import { useYieldSaveContract } from "../useContract";



export const useReadVault = () => {
  const vaultContract = useYieldSaveContract();
  const { address } = useAppKitAccount();
  const decodeError = useDecodedError();
  const [isLoading, setIsLoading] = useState(false);

  const getVaultBalance = useCallback(async (): Promise<bigint | null> => {
    if (!vaultContract) {
      toast.error("Vault contract not found");
      return null;
    }
    try {
      setIsLoading(true);
      return (await vaultContract.getVaultBalance()) as bigint;
    } catch (error) {
      toast.error(await decodeError(error));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [decodeError, vaultContract]);

  const getUserShares = useCallback(async (): Promise<bigint | null> => {
    if (!vaultContract) {
      toast.error("Vault contract not found");
      return null;
    }
    if (!address) {
      toast.error("Wallet not connected");
      return null;
    }

    try {
      setIsLoading(true);
      return (await vaultContract.userShares(address)) as bigint;
    } catch (error) {
      toast.error(await decodeError(error));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [address, decodeError, vaultContract]);

  const getUserBalance = useCallback(async (): Promise<bigint | null> => {
    if (!vaultContract) {
      toast.error("Vault contract not found");
      return null;
    }
    if (!address) {
      toast.error("Wallet not connected");
      return null;
    }

    try {
      setIsLoading(true);
      return (await vaultContract.getUserBalance(address)) as bigint;
    } catch (error) {
      console.log("error", error);
      
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "BAD_DATA"
      ) {
        toast.error(
          "Wrong contract/network/ABI: getUserBalance returned empty data (0x).",
        );
        return null;
      }
      
      toast.error(await decodeError(error));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [address, decodeError, vaultContract]);

  const previewWithdraw = useCallback(
    async (shares: bigint): Promise<bigint | null> => {
      if (!vaultContract) {
        toast.error("Vault contract not found");
        return null;
      }

      try {
        setIsLoading(true);
        return (await vaultContract.previewWithdraw(shares)) as bigint;
      } catch (error) {
        toast.error(await decodeError(error));
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [decodeError, vaultContract],
  );

  const previewDeposit = useCallback(
    async (amount: bigint): Promise<bigint | null> => {
      if (!vaultContract) {
        toast.error("Vault contract not found");
        return null;
      }

      try {
        setIsLoading(true);
        return (await vaultContract.previewDeposit(amount)) as bigint;
      } catch (error) {
        toast.error(await decodeError(error));
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [decodeError, vaultContract],
  );

  const getUserDeposits = useCallback(async (): Promise<bigint | null> => {
    if (!vaultContract) {
      toast.error("Vault contract not found");
      return null;
    }
    if (!address) {
      toast.error("Wallet not connected");
      return null;
    }

    try {
      setIsLoading(true);
      return (await vaultContract.userDeposits(address)) as bigint;
    } catch (error) {
      toast.error(await decodeError(error));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [address, decodeError, vaultContract]);

  return {
    getVaultBalance,
    getUserShares,
    getUserBalance,
    getUserDeposits,
    isLoading,
    previewWithdraw,
    previewDeposit,
  };
};

export const useReadTodo = useReadVault;
