import { useCallback } from "react";
import { useReadVault } from "./specific/useRead";

export const useUserShares = () => {
  const { getUserShares, isLoading } = useReadVault();

  const refetchUserShares = useCallback(async () => {
    return await getUserShares();
  }, [getUserShares]);

  return { isLoadingUserShares: isLoading, refetchUserShares };
};
