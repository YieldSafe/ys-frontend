import { useCallback } from "react";
import { useReadVault } from "./specific/useRead";
// VaultBalance Hooks
export const useVaultBalance = () => {
  const { getVaultBalance, isLoading } = useReadVault();

  const refetchVaultBalance = useCallback(async () => {
    return await getVaultBalance();
  }, [getVaultBalance]);

  return { isLoadingVaultBalance: isLoading, refetchVaultBalance };
};
