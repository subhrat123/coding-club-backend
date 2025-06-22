// ...existing imports
import express from "express";
import proxy from "express-http-proxy";
import config from "../config/env";
import { logInfo, logError } from "../utils/logger";

const router = express.Router();

//  Health check
router.get("/", (req, res) => {
  res.status(200).json({ message: "Gateway is healthy" });
});

//  Auth Service
router.use(
  "/api/auth",
  proxy(config.AUTH_SERVICE_URL, {
    proxyErrorHandler: (err, res, next) => {
      logError(`Proxy Error (Auth Service): ${err.message}`);
      res.status(500).json({
        message: "Something went wrong while contacting the Auth Service",
      });
    },
    proxyReqPathResolver: (req) => {
      const resolvedPath = "/auth" + req.url;
      logInfo(`Proxying Auth Request: ${req.originalUrl} → ${resolvedPath}`);
      return resolvedPath;
    },
  })
);

// User Service
router.use(
  "/api/user",
  proxy(config.USER_SERVICE_URL, {
    proxyReqPathResolver: (req) => {
      const resolvedPath = "/user" + req.url;
      logInfo(`🔀 Proxying User Request: ${req.originalUrl} → ${resolvedPath}`);
      return resolvedPath;
    },
  })
);

//  Team
router.use(
  "/api/team",
  proxy(config.USER_SERVICE_URL, {
    proxyReqPathResolver: (req) => {
      const resolvedPath = "/team" + req.url;
      logInfo(`🔀 Proxying Team Request: ${req.originalUrl} → ${resolvedPath}`);
      return resolvedPath;
    },
  })
);

// General
router.use(
  "/api/general",
  proxy(config.USER_SERVICE_URL, {
    proxyReqPathResolver: (req) => {
      const resolvedPath = "/general" + req.url;
      logInfo(
        `🔀 Proxying General Subscription Request: ${req.originalUrl} → ${resolvedPath}`
      );
      return resolvedPath;
    },
  })
);

//  Event Service
router.use(
  "/api/events",
  proxy(config.EVENT_SERVICE_URL, {
    proxyReqPathResolver: (req) => {
      const resolvedPath = "/events" + req.url;
      logInfo(
        `🔀 Proxying Event Request: ${req.originalUrl} → ${resolvedPath}`
      );
      return resolvedPath;
    },
    proxyErrorHandler: (err, res, next) => {
      logError(`Proxy Error (Event Service): ${err.message}`);
      res.status(500).json({
        message: "Something went wrong while contacting the Event Service",
      });
    },
  })
);

export default router;
