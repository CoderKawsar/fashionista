import rateLimit from "express-rate-limit";
import ApiError from "../../errors/ApiError";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const limitRequestPerMinute = (limit: number) =>
  rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    limit: limit,
    handler: (req: Request, res: Response, next: NextFunction) => {
      // When the rate limit is exceeded, throw a custom error
      next(
        new ApiError(
          StatusCodes.TOO_MANY_REQUESTS,
          "You're making requests a little too quickly! Please wait a moment and try again in a minute."
        )
      );
    },
  });

export default limitRequestPerMinute;
