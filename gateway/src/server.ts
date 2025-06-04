import app from "./app";
import config from "./config/env";
import { logInfo, logError } from "./utils/logger"; // Import logger

const PORT = config.PORT;

app.listen(PORT, () => {
  logInfo(`🚀 API Gateway running on port ${PORT}`);
});

// Handle unexpected errors
process.on("uncaughtException", (err) => {
  logError(`🔥 Uncaught Exception: ${err.message}`);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logError(`⚠️ Unhandled Rejection at: ${promise}, reason: ${reason}`);
});
