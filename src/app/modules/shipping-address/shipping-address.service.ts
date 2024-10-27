import ApiError from "../../../errors/ApiError";
import { User } from "../user/user.model";
import {
  IShippingAddress,
  IShippingAddressFilters,
} from "./shipping-address.interface";
import { ShippingAddress } from "./shipping-address.model";
import { IPaginationOptions } from "../../../interfaces/common";
import { paginationHelpers } from "../../helpers/paginationHelpers";
import { SortOrder } from "mongoose";
import { StatusCodes } from "http-status-codes";

// creating shipping address
const createShippingAddress = async (
  payload: IShippingAddress
): Promise<IShippingAddress> => {
  const result = await ShippingAddress.create(payload);
  return result;
};

// get all shipping address
const getAllShippingAddresss = async (
  filters: IShippingAddressFilters,
  paginationOptions: IPaginationOptions
) => {
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: shippingAddressSearchableFields.map((field) => ({
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

  const result = await ShippingAddress.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
    .select("-password");
  const total = await ShippingAddress.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// get single shipping address
const getSingleShippingAddress = async (
  id: string,
  user_id: string
): Promise<IShippingAddress | null> => {
  const shipping_address = await ShippingAddress.findById(id);

  if (shipping_address?.user_id?.toString() !== user_id.toString()) {
    throw new ApiError(StatusCodes.OK, "Unauthorized!");
  }
  return shipping_address;
};

// get my shipping address
const getMyShippingAddress = async (
  user_id: string
): Promise<IShippingAddress | null> => {
  const shipping_address = await ShippingAddress.findOne({
    user_id,
  });

  if (!shipping_address) {
    throw new ApiError(StatusCodes.OK, "No shipping address found!");
  }

  return shipping_address;
};

// update shipping address
const updateShippingAddress = async (
  payload: Partial<IShippingAddress>
): Promise<IShippingAddress | null> => {
  const result = await ShippingAddress.findOneAndUpdate(
    { user_id: payload?.user_id },
    payload,
    {
      upsert: true,
      new: true,
    }
  );

  return result;
};

// delete shipping address
const deleteShippingAddress = async (user_id: string) => {
  const result = await ShippingAddress.findOneAndDelete({ user_id });
  return result;
};

export const ShippingAddressService = {
  createShippingAddress,
  getAllShippingAddresss,
  getMyShippingAddress,
  getSingleShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
};
