import { useYieldSaveContract } from "./useContract";
import { useAppKitAccount } from "@reown/appkit/react";
import { useCallback, useEffect, useState } from "react";
import { formatUnits, EventLog } from "ethers";

export interface ActivityItem {
  type: "deposit" | "withdraw";
  amount: string;
  timestamp: string;
  status: "Confirmed" | "Pending";
}

export const useRecentActivity = () => {
  const contract = useYieldSaveContract();
  const { address } = useAppKitAccount();
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchActivity = useCallback(async () => {
    if (!contract || !address) return;
    setIsLoading(true);
    try {
      const depositFilter = contract.filters.Deposited(address);
      const withdrawFilter = contract.filters.Withdrawn(address);

      // Fetch last 10,000 blocks for events
      const [deposits, withdraws] = await Promise.all([
        contract.queryFilter(depositFilter, -10000),
        contract.queryFilter(withdrawFilter, -10000)
      ]);

      interface InternalActivityItem extends ActivityItem {
        blockNumber: number;
      }

      const items: InternalActivityItem[] = [
        ...deposits.map(d => ({
          type: "deposit" as const,
          amount: formatUnits((d as EventLog).args[1], 6), // assets
          timestamp: "Recently",
          status: "Confirmed" as const,
          blockNumber: d.blockNumber
        })),
        ...withdraws.map(w => ({
          type: "withdraw" as const,
          amount: formatUnits((w as EventLog).args[4], 6), // payout
          timestamp: "Recently",
          status: "Confirmed" as const,
          blockNumber: w.blockNumber
        }))
      ];
      
      // Sort by block number descending
      const sorted = items.sort((a, b) => b.blockNumber - a.blockNumber);
      setActivity(sorted.slice(0, 5));
    } catch (e) {
      console.error("Failed to fetch activity", e);
    } finally {
      setIsLoading(false);
    }
  }, [contract, address]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchActivity();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchActivity]);

  return { activity, isLoading, refetchActivity: fetchActivity };
};
