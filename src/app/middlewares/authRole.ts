import { NextFunction, Request, Response } from "express";
import { Secret } from "jsonwebtoken";
import ApiError from "../../errors/ApiError";
import { jwtHelpers } from "../helpers/jwtHelpers";
import { User } from "../modules/user/user.model";
import config from "../../config";
import { StatusCodes } from "http-status-codes";

const authRole =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //get authorization token
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "You are not authorized! Login first."
        );
      }

      // verify token
      let verifiedUser = null;
      verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);

      // find user by verified token id
      const isUserExist = await User.findById(verifiedUser?.user_id).select(
        "-createdAt -updatedAt -__v -full_name -mobile_number -email"
      );

      // if the role is changed after last login, throw error
      if (isUserExist?.role !== verifiedUser?.role)
        throw new ApiError(423, "Your role changed. Login again.");

      // guard that specific role
      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(StatusCodes.FORBIDDEN, "Forbidden access!");
      }

      // if everything pasesed
      if (isUserExist) {
        req.user = verifiedUser; // role  , userid
      } else {
        req.user = null;
        throw new ApiError(StatusCodes.BAD_REQUEST, "User not found!");
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export default authRole;
