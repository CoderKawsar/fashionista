import express, { Application, Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import routes from "./app/routes";
import rateLimit from "express-rate-limit";
import ApiError from "./errors/ApiError";
import config from "./config";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { StatusCodes } from "http-status-codes";

const app: Application = express();

// use middlewares
app.use(helmet());
app.use(cors({ origin: config.url.client, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// global rate limiter
const globalRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  limit: 120,
  handler: (req, res, next) => {
    // When the rate limit is exceeded, throw a custom error
    next(
      new ApiError(
        StatusCodes.TOO_MANY_REQUESTS,
        `You're making requests a little too quickly! Please wait a moment and try again in a minute.`
      )
    );
  },
});

// use router
app.use("/api/v1", globalRateLimiter, routes);

// global error handler
app.use(globalErrorHandler);

// handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API not found!",
      },
    ],
  });
  next();
});

export default app;
