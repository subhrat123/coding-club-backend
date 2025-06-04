import { Request, Response, NextFunction, RequestHandler } from "express";
import { createOrUpdateSubscriptionService, getSubscriptionService } from "../services/generalService";

// Create or update subscription for a general member.
export const createOrUpdateSubscription: RequestHandler = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const { memberId, paymentId, subscription } = req.body;
    const general = await createOrUpdateSubscriptionService({ memberId, paymentId, subscription });
    res.status(201).json({ subscription: general });
  } catch (error: any) {
    next(error);
  }
};

// Get subscription details by member ID.
export const getSubscription: RequestHandler = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const { memberId } = req.params;
    const subscription = await getSubscriptionService(memberId);
    if (!subscription) {
      res.status(404).json({ message: "Subscription not found" });
      return;
    }
    res.status(200).json({ subscription });
  } catch (error: any) {
    next(error);
  }
};
