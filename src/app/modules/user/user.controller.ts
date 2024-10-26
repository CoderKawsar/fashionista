import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../../shared/sendResponse";
import config from "../../../config";
import { ENUM_USER_ROLE } from "../../enums/user";
import { StatusCodes } from "http-status-codes";
import pick from "../../../shared/pick";
import { userFilterableFields } from "./user.constant";
import { paginationFields } from "../../constants/pagination";

const signUpCustomer = catchAsync(async (req: Request, res: Response) => {
  const { full_name, mobile_number, email, password } = req.body;
  const userData = {
    full_name,
    mobile_number,
    email,
    password,
    role: ENUM_USER_ROLE.CUSTOMER,
  };

  await UserService.signUpCustomer(userData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Customer registered successfully",
  });
});

const createSuperAdmin = catchAsync(async (req: Request, res: Response) => {
  req.body.role = ENUM_USER_ROLE.SUPER_ADMIN;
  await UserService.createAdmin(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Super admin created successfully",
  });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  req.body.role = ENUM_USER_ROLE.ADMIN;
  await UserService.createAdmin(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Admin created successfully",
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  payload.platform = req.headers["user-agent"];

  const result = await UserService.login(payload);

  res.cookie("refresh_token", result.refreshToken, {
    httpOnly: true,
    secure: config.env === "production",
  });

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User logged in successfully!",
    data: result,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const refresh_token = req.cookies.refresh_token;

  const result = await UserService.refreshToken(refresh_token);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Token refreshed successfully !",
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const authUserId = req?.user?.user_id;

  const result = await UserService.changePassword(payload, authUserId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password successfully changed!",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await UserService.getAllUsers(filters, paginationOptions);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "All users fetched successfully",
    data: result,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const { user_id } = req.params;

  const result = await UserService.getSingleUser(user_id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User fetched in successfully!",
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { user_id } = req.params;
  const payload = req.body;

  if (req?.user?.role === ENUM_USER_ROLE.CUSTOMER) {
    if (req.body.mobile_number) delete payload.mobile_number;
  }

  const result = await UserService.updateUser(user_id, payload);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User updated in successfully!",
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { user_id } = req.params;
  await UserService.deleteUser(user_id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User deleted in successfully!",
  });
});

export const UserController = {
  signUpCustomer,
  createSuperAdmin,
  createAdmin,
  loginUser,
  refreshToken,
  changePassword,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};