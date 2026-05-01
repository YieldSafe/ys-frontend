import { useCallback } from "react";
import { useReadVault } from "./specific/useRead";

export const useUserBalance = () => {
  const { getUserBalance, isLoading } = useReadVault();

  const refetchUserBalance = useCallback(async () => {
    return await getUserBalance();
  }, [getUserBalance]);

  return { isLoadingUserBalance: isLoading, refetchUserBalance };
};
