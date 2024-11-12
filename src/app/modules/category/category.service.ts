import { SortOrder } from "mongoose";
import {
  IGenericResponse,
  IPaginationOptions,
} from "../../../interfaces/common";
import { paginationHelpers } from "../../helpers/paginationHelpers";
import { ICategory, ICategoryFilters } from "./category.interface";
import { Category } from "./category.model";
import ApiError from "../../../errors/ApiError";
import { categorySearchableFields } from "./category.constants";
import { StatusCodes } from "http-status-codes";
import { Request } from "express";
import { IUploadFile } from "../../../interfaces/file";
import { FileUploadHelper } from "../../helpers/fileUploadHelpers";

// create category
const createCategory = async (req: Request): Promise<ICategory> => {
  const file = req.file as IUploadFile;

  if (!file) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Please upload a file");
  }

  const uploadedImage = await FileUploadHelper.uploadToCloudinary(file);

  if (!uploadedImage?.secure_url) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Unable to upload image"
    );
  }
  req.body.image = uploadedImage?.secure_url;

  try {
    const result = await Category.create(req.body);
    return result;
  } catch (error) {
    if (uploadedImage?.secure_url) {
      FileUploadHelper.deleteFromCloudinary(uploadedImage?.secure_url);
    }

    throw error;
  }
};

// get all categories
const getAllCategories = async (
  filters: ICategoryFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ICategory[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: categorySearchableFields.map((field) => ({
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

  let result = await Category.find(whereConditions)
    .select("-createdAt -updatedAt -__v ")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Category.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// get category
const getSingleCategory = async (id: string): Promise<ICategory | null> => {
  const result = await Category.findById(id).select(
    "-createdAt -updatedAt -__v "
  );

  return result;
};

// update category
const updateCategory = async (req: Request): Promise<ICategory | null> => {
  const file = req.file as IUploadFile;

  const category = await Category.findById(req.params.id);
  if (!category) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Category not found!");
  }

  if (file) {
    const uploadedImage = await FileUploadHelper.uploadToCloudinary(file);

    if (!uploadedImage?.secure_url) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Unable to upload image"
      );
    }
    await FileUploadHelper.deleteFromCloudinary(category?.image as string);
    category.image = uploadedImage?.secure_url;
  }

  if (req.body.title) {
    category.title = req.body.title;
  }

  const result = await category.save();
  return result;
};

// delete category
const deleteCategory = async (id: string) => {
  // find and delete CoursePlaylist in one operation
  const result = await Category.findOneAndDelete({ _id: id });

  // if the CoursePlaylist you want to delete was not present, i.e. not deleted, throw error
  if (!result) {
    throw new ApiError(StatusCodes.OK, "Couldn't delete. Category not found!");
  }

  // delete that CoursePlaylist banner image from cloudinary
  FileUploadHelper.deleteFromCloudinary(result?.image as string);

  return result;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
