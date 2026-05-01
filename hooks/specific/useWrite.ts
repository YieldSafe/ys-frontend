import { useAppKitAccount } from "@reown/appkit/react";
import { useYieldSaveContract } from "../useContract";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { useDecodedError } from "../useDecodedError";

export const useWriteVault = () => {
  const vaultContract = useYieldSaveContract(true);
  const { address } = useAppKitAccount();
  const decodeError = useDecodedError();
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const deposit = useCallback(
    async (amount: bigint): Promise<boolean> => {
      if (!address) {
        toast.error("Wallet not connected");
        return false;
      }
      if (!vaultContract) {
        toast.error("Vault contract not found");
        return false;
      }

      try {
        setIsDepositing(true);
        const tx = await vaultContract.deposit(amount);
        const receipt = await tx.wait();
        return receipt?.status === 1;
      } catch (error) {
        toast.error(await decodeError(error));
        return false;
      } finally {
        setIsDepositing(false);
      }
    },
    [address, decodeError, vaultContract],
  );

  const withdraw = useCallback(
    async (shares: bigint): Promise<boolean> => {
      if (!address) {
        toast.error("Wallet not connected");
        return false;
      }
      if (!vaultContract) {
        toast.error("Vault contract not found");
        return false;
      }

      try {
        setIsWithdrawing(true);
        const tx = await vaultContract.withdraw(shares);
        const receipt = await tx.wait();
        return receipt?.status === 1;
      } catch (error) {
        toast.error(await decodeError(error));
        return false;
      } finally {
        setIsWithdrawing(false);
      }
    },
    [address, decodeError, vaultContract],
  );

  return {
    deposit,
    isDepositing,
    isWithdrawing,
    withdraw,
  };
};

export const useWriteTodo = useWriteVault;
