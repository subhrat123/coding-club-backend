import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import routes from "./routes/index";
import errorHandler from "./middleware/errorHandler";
import requestLogger from "./middleware/requestLogger";
import config from "./config/env";

const app = express();

// ✅ Apply the middleware globally (Logs all incoming requests)
app.use(requestLogger);

// Middleware
app.use(cors(
  {
    origin: config.FRONTEND_URL,  // Allow requests from your frontend
    credentials: true,  // Allow cookies and authentication headers
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ['Content-Type', 'Authorization']

  }

));
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Routes
app.use("/", routes);

app.use(errorHandler);

export default app;
