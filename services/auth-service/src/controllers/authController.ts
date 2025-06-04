import { RequestHandler } from "express";
import { Request, Response, NextFunction } from 'express';
import {
  registerUser,
  loginUser,
  getUserProfileById,
  updateUserProfileById,
} from "../services/authService";
import { logInfo, logError } from "../utils/logger";

export const register: RequestHandler = async (req, res, next) => {
  try {
    logInfo(`📝 Registering new user: ${req.body.email}`);
    const { username, name, email, password } = req.body;
    const { user } = await registerUser({ username, name, email, password });
    res.status(201).json({ user });
  } catch (error: any) {
    logError(`❌ Register Error: ${error.message}`);
    next(error);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    logInfo(`🔑 Login attempt: ${req.body.email}`);
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);
    res.status(200).json({ user, token });
  } catch (error: any) {
    logError(`❌ Login Error: ${error.message}`);
    next(error);
  }
};

export const logout: RequestHandler = (req, res) => {
  logInfo("👋 User logged out");
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logout successful" });
};


export const getProfileById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const profileId = req.params.id;
    // Your logic to get the profile by ID
    // console.log(profileId)
    const profile = await getUserProfileById(profileId); // Replace with your actual logic

    if (!profile) {
      res.status(404).send('Profile not found');
      return;
    }

    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

export const updateProfileById: RequestHandler = async (req, res, next) => {
  try {
    logInfo(`🔄 Updating profile for user ID: ${req.params.id}`);
    const { id } = req.params;
    const updatedUser = await updateUserProfileById(id, req.body);
    res.status(200).json({ user: updatedUser });
  } catch (error: any) {
    logError(`❌ Error updating user profile: ${error.message}`);
    next(error);
  }
};

