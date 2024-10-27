import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import pick from "../../../shared/pick";
import { paginationFields } from "../../constants/pagination";
import { StatusCodes } from "http-status-codes";
import { CategoryService } from "./category.service";
import { categoryFilterableFields } from "./category.constants";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  await CategoryService.createCategory(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Category created successfully!",
  });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, categoryFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await CategoryService.getAllCategories(
    filters,
    paginationOptions
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "All Categories fetched successfully!",
    data: result,
  });
});

const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CategoryService.getSingleCategory(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Category fetched successfully!",
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await CategoryService.updateCategory(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Category updated in successfully!",
    data: result,
  });
});
const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CategoryService.deleteCategory(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Category deleted in successfully!",
    data: result,
  });
});

export const CategoryController = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
