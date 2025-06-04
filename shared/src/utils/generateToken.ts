
import jwt from "jsonwebtoken";
import config from "../configs/env";

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, config.JWT_SECRET, { expiresIn:  parseInt(config.TOKEN_EXPIRES_IN, 10) });
};
