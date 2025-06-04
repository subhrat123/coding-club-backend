import mongoose from "mongoose";
import config from "./env";
import { logInfo, logError } from "../utils/logger"; // Import logger

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    logInfo("✅ MongoDB Connected");
  } catch (error) {
    logError(`❌ MongoDB Connection Error: ${error}`);
    process.exit(1);
  }
};

export default connectDB;
