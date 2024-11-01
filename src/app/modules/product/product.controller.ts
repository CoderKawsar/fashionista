import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ProductService } from "./product.service";
import { paginationFields } from "../../constants/pagination";
import pick from "../../../shared/pick";
import { StatusCodes } from "http-status-codes";
import { productFilterableFields } from "./product.constants";

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.createProduct(req);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Product added successfully!",
    data: result,
  });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, productFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await ProductService.getAllProducts(
    filters,
    paginationOptions
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "All Products fetched successfully!",
    data: result,
  });
});

const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // const token = req.headers.authorization;
  // let verifiedUser = null;
  // verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret)

  // if(!token){
  //   const result = await ProductService.getSingleProduct(id, true);
  // }

  // const currentDate = new Date();
  //   const subscribed = await SubscriptionHistory.find({
  //     user_id,
  //     Product_id: id,
  //     expire_date: { $gte: currentDate },
  //   });

  //   if (!subscribed.length) {
  //     throw new ApiError(StatusCodes.OK, "No subscription found!");
  //   }

  const result = await ProductService.getSingleProduct(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Product fetched successfully!",
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.updateProduct(req);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Product updated in successfully!",
    data: result,
  });
});
const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProductService.deleteProduct(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Product deleted in successfully!",
    data: result,
  });
});

export const ProductController = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
