import { useCallback } from "react";
import { useReadVault } from "./specific/useRead";

export const usePreviewWithdraw = () => {
  const { isLoading, previewWithdraw } = useReadVault();

  const previewByShares = useCallback(
    async (shares: bigint) => {
      return await previewWithdraw(shares);
    },
    [previewWithdraw],
  );

  return { isPreviewingWithdraw: isLoading, previewByShares };
};
