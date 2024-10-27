import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ShippingAddressService } from "./shipping-address.service";
import { StatusCodes } from "http-status-codes";
import { paginationFields } from "../../constants/pagination";
import pick from "../../../shared/pick";

const createShippingAddress = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    payload.user_id = req?.user?.userId;

    const result = await ShippingAddressService.createShippingAddress(payload);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Shipping address added successfully!",
      data: result,
    });
  }
);

const getAllShippingAddresss = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, shippingAddressFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await ShippingAddressService.getAllShippingAddresss(
      filters,
      paginationOptions
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "All Shipping addresses fetched successfully!",
      data: result,
    });
  }
);

const getSingleShippingAddress = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const user_id = req?.user?.userId;

    const result = await ShippingAddressService.getSingleShippingAddress(
      id,
      user_id
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Shipping address fetched successfully!",
      data: result,
    });
  }
);

const getMyShippingAddress = catchAsync(async (req: Request, res: Response) => {
  const user_id = req?.user?.userId;

  const result = await ShippingAddressService.getMyShippingAddress(user_id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Shipping address fetched successfully!",
    data: result,
  });
});

const updateShippingAddress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    payload.user_id = req?.user?.user_id;

    const result = await ShippingAddressService.updateShippingAddress(payload);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Shipping address updated in successfully!",
      data: result,
    });
  }
);
const deleteShippingAddress = catchAsync(
  async (req: Request, res: Response) => {
    const user_id = req?.user?.user_id;
    const result = await ShippingAddressService.deleteShippingAddress(user_id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Shipping address deleted in successfully!",
      data: result,
    });
  }
);

export const ShippingAddressController = {
  createShippingAddress,
  getAllShippingAddresss,
  getMyShippingAddress,
  getSingleShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
};
