import { useCallback } from "react";
import { ErrorDecoder } from "ethers-decode-error";
import YieldSaveVaultAbi from "../lib/abis/YieldSaveVault.json";

const errorDecoder = ErrorDecoder.create([YieldSaveVaultAbi]);

const ERROR_MESSAGES: Record<string, string> = {
  ZeroAmount: "Amount must be greater than zero.",
  InsufficientShares: "You do not have enough shares for this withdrawal.",
  ZeroSharesMinted: "Deposit amount is too small to mint shares.",
  ERC20CallFailed: "The token transfer failed. Please check your balance and approval.",
  ZeroAddress: "Invalid address provided.",
  InvalidFeeRate: "The protocol fee rate is invalid.",
  ReentrancyGuardReentrantCall: "Security error: Reentrant call detected.",
};

export const useDecodedError = () => {
  return useCallback(async (error: unknown): Promise<string> => {
    try {
      const decoded = await errorDecoder.decode(error);
      
      if (decoded?.name && ERROR_MESSAGES[decoded.name]) {
        return ERROR_MESSAGES[decoded.name];
      }

      if (decoded?.reason) {
        return decoded.reason;
      }
    } catch (err) {
      console.error("Error decoding failed:", err);
    }

    // Handle string errors directly
    if (typeof error === "string") {
      if (error.startsWith("0x")) {
        // If it's a hex string (like data from a revert), try decoding it again
        try {
          const decoded = await errorDecoder.decode({ data: error });
          if (decoded?.name && ERROR_MESSAGES[decoded.name]) {
            return ERROR_MESSAGES[decoded.name];
          }
        } catch {}
      }
      return error;
    }

    if (error instanceof Error) {
      // Ethers v6 errors often have a 'code' or 'reason'
      const errObj = error as unknown as { reason?: string; message?: string };
      if (errObj.reason) return errObj.reason;
      if (errObj.message) {
        if (errObj.message.includes("user rejected action")) return "User rejected transaction.";
        return errObj.message;
      }
    }

    return "Transaction failed. Please try again.";
  }, []);
};
