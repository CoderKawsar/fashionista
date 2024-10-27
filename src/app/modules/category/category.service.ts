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

// create category
const createCategory = async (payload: ICategory): Promise<ICategory> => {
  const result = await Category.create(payload);
  return result;
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
const updateCategory = async (
  id: string,
  payload: Partial<ICategory>
): Promise<ICategory | null> => {
  // updating CoursePlaylist
  const result = await Category.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  // if the CoursePlaylist you want to update was not present, i.e. not updated, throw error
  if (!result) {
    throw new ApiError(StatusCodes.OK, "Couldn't update. Category not found!");
  }

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

  return result;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
