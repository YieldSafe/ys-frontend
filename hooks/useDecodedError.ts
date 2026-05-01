import { useCallback } from "react";
import { ErrorDecoder } from "ethers-decode-error";

const errorDecoder = ErrorDecoder.create();

export const useDecodedError = () => {
  return useCallback(async (error: unknown): Promise<string> => {
    try {
      const decoded = await errorDecoder.decode(error);
      if (decoded?.reason) {
        return decoded.reason;
      }
    } catch {
      // Fall through to generic normalization below.
    }

    if (error instanceof Error && error.message) {
      return error.message;
    }

    if (typeof error === "string" && error) {
      return error;
    }

    return "Transaction failed. Please try again.";
  }, []);
};
