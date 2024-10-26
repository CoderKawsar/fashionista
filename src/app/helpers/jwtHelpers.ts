import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ApiError from "../../errors/ApiError";
import { StatusCodes } from "http-status-codes";

const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expireTime: string
): string => {
  try {
    return jwt.sign(payload, secret, {
      expiresIn: expireTime,
    });
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid token");
  }
};

const verifyToken = (token: string, secret: Secret) => {
  try {
    const isVerified = jwt.verify(token, secret) as JwtPayload;
    return isVerified;
  } catch (error) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid token");
  }
};

export const jwtHelpers = {
  createToken,
  verifyToken,
};
