// generalService.ts
import { General } from "../models/UserModels";

interface SubscriptionData {
  memberId: string;
  paymentId: string;
  subscription: string;
}

// Creates (or you may later update) a subscription for a member.
export const createOrUpdateSubscriptionService = async (data: SubscriptionData) => {
  // For simplicity, this example always creates a new document.
  // You could add logic to check for an existing subscription and update it.
  const general = await General.create(data);
  return general;
};

// Retrieves subscription details by member ID.
export const getSubscriptionService = async (memberId: string) => {
  const subscription = await General.findOne({ memberId });
  return subscription;
};
