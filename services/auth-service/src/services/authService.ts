import { Member } from "../models/Member";
import { hashPassword, comparePassword } from "../utils/hashPassword";
import { generateToken } from "../utils/generateToken";
import { logInfo, logError } from "../utils/logger"; // Import logger

interface RegisterData {
  username: string;
  name: string;
  email: string;
  password: string;
  contact_no?: string;
}

export const registerUser = async (data: RegisterData) => {
  logInfo(`📝 Registering user: ${data.email}`);
  const existing = await Member.findOne({ email: data.email });
  if (existing) {
    logError("❌ Registration failed: User already exists");
    throw new Error("User already exists");
  }

  const hashed = await hashPassword(data.password);
  const user = await Member.create({ ...data, password: hashed }) as { _id: string };
  logInfo(`✅ User registered successfully: ${data.email}`);
  return { user };
};

export const loginUser = async (email: string, password: string) => {
  logInfo(`🔑 Login attempt for: ${email}`);
  const user = await Member.findOne({ email }) as { _id: string, password: string };
  if (!user) {
    logError("❌ Login failed: User not found");
    throw new Error("User not found");
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    logError("❌ Login failed: Invalid credentials");
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user._id);
  logInfo(`✅ User logged in successfully: ${email}`);
  return { user, token };
};

export const getUserProfileById = async (id: string) => {
  logInfo(`👤 Fetching profile for user ID: ${id}`);
  const user = await Member.findById(id).select("-password");
  if (!user) {
    logError("❌ User not found");
    throw new Error("User not found");
  }
  return user;
};

export const updateUserProfileById = async (id: string, data: any) => {
  logInfo(`🔄 Updating profile for user ID: ${id}`);
  const user = await Member.findByIdAndUpdate(id, data, { new: true }).select("-password");
  if (!user) {
    logError("❌ User not found during update");
    throw new Error("User not found");
  }
  logInfo(`✅ Profile updated successfully: ${id}`);
  return user;
};
