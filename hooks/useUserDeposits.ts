import { useCallback } from "react";
import { useReadVault } from "./specific/useRead";



// github comments 
export const useUserDeposits = () => {
  const { getUserDeposits, isLoading } = useReadVault();

  const refetchUserDeposits = useCallback(async () => {
    return await getUserDeposits();
  }, [getUserDeposits]);

  return { isLoadingUserDeposits: isLoading, refetchUserDeposits };
};
