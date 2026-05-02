import { useCallback } from "react";
import { useWriteVault } from "./specific/useWrite";

export const useWithdraw = () => {
  const { isWithdrawing, withdraw } = useWriteVault();

  const submitWithdraw = useCallback(
    async (shares: bigint) => {
      return await withdraw(shares);
    },
    [withdraw],
  );

  return { isWithdrawing, submitWithdraw };
};
