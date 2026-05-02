import { useCallback } from "react";
import { useReadVault } from "./specific/useRead";

export const usePreviewDeposit = () => {
  const { isLoading, previewDeposit } = useReadVault();

  const previewByAssets = useCallback(
    async (assets: bigint) => {
      return await previewDeposit(assets);
    },
    [previewDeposit],
  );

  return { isPreviewingDeposit: isLoading, previewByAssets };
};
