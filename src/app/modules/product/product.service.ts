import ApiError from "../../../errors/ApiError";
import {
  IGenericResponse,
  IPaginationOptions,
} from "../../../interfaces/common";
import { paginationHelpers } from "../../helpers/paginationHelpers";
import mongoose, { SortOrder } from "mongoose";
import { Request } from "express";
import { IUploadFile } from "../../../interfaces/file";
import { User } from "../user/user.model";
import { Types } from "mongoose";
import { Category } from "../category/category.model";
import { IProduct, IProductFilters } from "./product.interface";
import { StatusCodes } from "http-status-codes";
import { FileUploadHelper } from "../../helpers/fileUploadHelpers";
import { productSearchableFields } from "./product.constants";
import { Product } from "./product.model";

// create Product
const createProduct = async (req: Request) => {
  // to check if the category is present of the provided category-id
  const category = await Category.exists({ _id: req.body.category_id });
  if (!category) {
    throw new ApiError(StatusCodes.OK, "Category not found!");
  }

  const files = req.files as { [fieldName: string]: Express.Multer.File[] };
  if (files.main_image) {
    const uploadedImage = await FileUploadHelper.uploadToCloudinary(
      files.main_image[0]
    );
    if (!uploadedImage?.secure_url) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Unable to upload main image"
      );
    }
    req.body.main_image = uploadedImage?.secure_url;
  }

  req.body.other_images = [];
  if (files.other_images) {
    for (const file of files.other_images) {
      const uploadedImage = await FileUploadHelper.uploadToCloudinary(file);
      if (!uploadedImage?.secure_url) {
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Unable to upload other image"
        );
      }
      req.body.other_images.push(uploadedImage?.secure_url);
    }
  }

  const result = await Product.create(req.body);
  return result;
};

// get all Products
const getAllProducts = async (
  filters: IProductFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IProduct[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: productSearchableFields.map((field) => ({
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

  let result = await Product.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
    .populate([
      {
        path: "category_id",
        select: "title _id",
      },
    ])
    .select("-createdAt -updatedAt -__v");

  const total = await Product.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// get Product
const getSingleProduct = async (id: string): Promise<IProduct | null> => {
  const result = await Product.findById(id)
    .populate([
      {
        path: "sub_category_id",
        select: "title _id",
        populate: {
          path: "category_id",
          select: "title _id",
        },
      },
      {
        path: "category_id",
        select: "title _id",
      },
    ])
    .select("-createdAt -updatedAt -__v -study_materials");
  // if the Product is not found, throw error
  if (!result) {
    throw new ApiError(StatusCodes.OK, "Product not found!");
  }

  return result;
};

// update Product
const updateProduct = async (req: Request): Promise<IProduct | null> => {
  // find Product of given id
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(StatusCodes.OK, "Product not found!");
  }

  // if image is given, upload new, and delete old one
  if (req.file) {
    const file = req.file as IUploadFile;
    const uploadedImage = await FileUploadHelper.uploadToCloudinary(file);

    if (uploadedImage) {
      req.body.banner = uploadedImage.secure_url;
    }
    if (product.main_image) {
      // delete that Product banner image from cloudinary
      FileUploadHelper.deleteFromCloudinary(product?.main_image as string);
    }
  }

  if (req.body.category_id && !req.body.sub_category_id)
    delete req.body.sub_category_id;

  // updating Product
  const result = await Product.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true,
    }
  );

  return result;
};

// delete Product
const deleteProduct = async (id: string) => {
  const product = await Product.findById(id);

  if (!Product) {
    throw new ApiError(StatusCodes.OK, "Product not found!");
  } else {
    if (product?.main_image) {
      // delete that Product banner from cloudinary
      FileUploadHelper.deleteFromCloudinary(product?.main_image as string);
    }
  }

  // find and delete Product in one operation
  const result = await Product.findByIdAndDelete(id);
  return result;
};

export const ProductService = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
