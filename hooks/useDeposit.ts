import { useCallback } from "react";
import { useWriteVault } from "./specific/useWrite";

export const useDeposit = () => {
  const { deposit, isDepositing } = useWriteVault();

  const submitDeposit = useCallback(
    async (amount: bigint) => {
      return await deposit(amount);
    },
    [deposit],
  );

  return { isDepositing, submitDeposit };
};
