import bcrypt from "bcrypt";
import ApiError from "../../../errors/ApiError";
import {
  ChangePasswordPayload,
  ILoginInfo,
  IUser,
  IUserFilters,
} from "./user.interface";
import { User } from "./user.model";
import { UserUtills } from "./user.utills";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import { ENUM_USER_ROLE } from "../../enums/user";
import { StatusCodes } from "http-status-codes";
import { IPaginationOptions } from "../../../interfaces/common";
import { userSearchableFields } from "./user.constant";
import { paginationHelpers } from "../../helpers/paginationHelpers";
import { SortOrder } from "mongoose";

// register a student
const signUpCustomer = async (userData: IUser) => {
  userData.role = ENUM_USER_ROLE.CUSTOMER;
  const createdUser = await UserUtills.createUser(userData);

  return createdUser;
};

// create super admin
const createSuperAdmin = async (userData: IUser) => {
  // creating user
  userData.role = ENUM_USER_ROLE.SUPER_ADMIN;
  const createdUser = await UserUtills.createUser(userData);

  return createdUser;
};

// create admin
const createAdmin = async (userData: IUser) => {
  userData.role = ENUM_USER_ROLE.ADMIN;
  const createdUser = await UserUtills.createUser(userData);

  return createdUser;
};

// login user
const login = async (loginInfo: ILoginInfo) => {
  const { email_or_mobile, password } = loginInfo;

  let requestedUser = await User.findOne({
    $or: [
      { mobile_number: { $eq: email_or_mobile } },
      { email: { $eq: email_or_mobile } },
    ],
  }).select("_id email mobile_number password role");

  if (!requestedUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User not found!");
  }

  // compare password
  const isPasswordMatched = bcrypt.compareSync(
    password,
    requestedUser?.password as string
  );
  // if password doesn't match, throw error
  if (!isPasswordMatched) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid credentials!");
  }

  const { accessToken, refreshToken } =
    await UserUtills.createTokenRefreshTokenForUser({
      user_id: requestedUser?._id.toString() as string,
      role: requestedUser?.role as string,
    });

  return { isPasswordMatched, accessToken, refreshToken };
};

// refresh token
const refreshToken = async (token: string) => {
  const verifiedToken = jwtHelpers.verifyToken(
    token,
    config.jwt.refresh_secret as Secret
  );

  const isUserExist = await User.findById(verifiedToken?.user_id);
  if (!isUserExist)
    throw new ApiError(StatusCodes.BAD_REQUEST, "User not found!");

  const newAccessToken = jwtHelpers.createToken(
    {
      user_id: isUserExist?._id,
      role: isUserExist?.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

// change password
const changePassword = async (
  payload: ChangePasswordPayload,
  authUserId: string
) => {
  const { email_or_mobile, old_password, new_password } = payload;

  let user = await User.findOne({
    $or: [
      { mobile_number: { $eq: email_or_mobile } },
      { email: { $eq: email_or_mobile } },
    ],
  }).select("_id email mobile_number password role");

  if (user?._id.toString() !== authUserId)
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Invalid mobile number. This is not your mobile number!"
    );

  // compare password
  const isPasswordMatched = bcrypt.compareSync(
    old_password,
    user?.password as string
  );

  // if password doesn't match, throw error
  if (!isPasswordMatched) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid credentials!");
  }

  const hashedPassword = UserUtills.hashPassword(new_password);

  await User.findOneAndUpdate(
    { email: user?.email },
    {
      password: hashedPassword,
    }
  );

  return "Password successfully changed!";
};

// get all users
const getAllUsers = async (
  filters: IUserFilters,
  paginationOptions: IPaginationOptions
) => {
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: userSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await User.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
    .select("-password");
  const total = await User.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// get single user
const getSingleUser = async (user_id: string): Promise<IUser> => {
  const result = await User.findById(user_id).select(
    "-__v -createdAt -updatedAt"
  );

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User not found!");
  }
  return result;
};

// update user
const updateUser = async (
  user_id: string,
  payload: Partial<IUser>
): Promise<Omit<IUser, "password">> => {
  const { ...updatingPayload } = payload;
  const result = await User.findByIdAndUpdate(user_id, updatingPayload, {
    new: true,
  }).select("-__v -createdAt -updatedAt -session_id");

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User not found!");
  }

  return result;
};

// delete user
const deleteUser = async (user_id: string) => {
  const result = await User.findByIdAndDelete(user_id).select(
    "-__v -createdAt -updatedAt -session_id"
  );

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User not found!");
  }
};

export const UserService = {
  signUpCustomer,
  createSuperAdmin,
  createAdmin,
  login,
  refreshToken,
  changePassword,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
