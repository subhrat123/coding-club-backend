import express from "express";
import proxy from "express-http-proxy";
import config from "../config/env";
import { logInfo, logError } from "../utils/logger"; // Import logger

const router = express.Router();

//Health check endpoint
router.get("/", (req, res) => {
  res.status(200).json({ message: "Gateway is healthy" });
});

// Proxy requests to the Auth Service
router.use(
  "/api/auth",
  proxy(config.AUTH_SERVICE_URL, {
    proxyErrorHandler: (err, res, next) => {
      logError(`Proxy Error (Auth Service): ${err.message}`);
      res.status(500).json({ message: "Something went wrong while contacting the Auth Service" });
    },
    proxyReqPathResolver: (req) => {
      const resolvedPath = "/auth" + req.url;
      logInfo(`🔀 Proxying Auth Request: ${req.originalUrl} → ${resolvedPath}`);
      return resolvedPath;
    },
  })
);

// Proxy requests to the User Service
router.use("/api/user", proxy(config.USER_SERVICE_URL, {
  proxyReqPathResolver: (req) => {
    console.log("Proxying User Request:", req.url);
    const resolvedPath = "/user" + req.url;
    logInfo(`🔀 Proxying User Request: ${req.originalUrl} → ${resolvedPath}`);
    return resolvedPath;
  }
}));

// Proxy requests to Team routes
router.use("/api/team", proxy(config.USER_SERVICE_URL, {
  proxyReqPathResolver: (req) => {
    const resolvedPath = "/team" + req.url;
    logInfo(`🔀 Proxying Team Request: ${req.originalUrl} → ${resolvedPath}`);
    return resolvedPath;
  }
}));

// Proxy requests to General Subscription routes
router.use("/api/general", proxy(config.USER_SERVICE_URL, {
  proxyReqPathResolver: (req) => {
    const resolvedPath = "/general" + req.url;
    logInfo(`🔀 Proxying General Subscription Request: ${req.originalUrl} → ${resolvedPath}`);
    return resolvedPath;
  }
}));

export default router;
