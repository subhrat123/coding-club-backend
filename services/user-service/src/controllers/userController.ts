import { RequestHandler } from "express";
import { fetchUserProfile, updateUserProfile } from "../services/userService";

export const getProfile: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).user.userId;
    const token = req.headers.authorization;
    console.log(userId);
    const user = await fetchUserProfile(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return; // Exit without returning a value
    }
    res.status(200).json({ user });
  } catch (error: any) {
    next(error);
  }
};

export const updateProfile: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.params.id; // Use userId from request params or token
    const updated = await updateUserProfile(userId, req.body);

    if (!updated) {
      res.status(404).json({ message: "User not found" });
      return; // Exit without returning a value
    }

    res.status(200).json({ user: updated });
  } catch (error: any) {
    next(error);
  }
};
