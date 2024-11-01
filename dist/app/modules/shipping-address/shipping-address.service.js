"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingAddressService = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const shipping_address_model_1 = require("./shipping-address.model");
const paginationHelpers_1 = require("../../helpers/paginationHelpers");
const http_status_codes_1 = require("http-status-codes");
// creating shipping address
const createShippingAddress = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield shipping_address_model_1.ShippingAddress.create(payload);
    return result;
});
// get all shipping address
const getAllShippingAddresss = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
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
    const { page, limit, skip, sortBy, sortOrder } = paginationHelpers_1.paginationHelpers.calculatePagination(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield shipping_address_model_1.ShippingAddress.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit)
        .select("-password");
    const total = yield shipping_address_model_1.ShippingAddress.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
// get single shipping address
const getSingleShippingAddress = (id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const shipping_address = yield shipping_address_model_1.ShippingAddress.findById(id);
    if (((_a = shipping_address === null || shipping_address === void 0 ? void 0 : shipping_address.user_id) === null || _a === void 0 ? void 0 : _a.toString()) !== user_id.toString()) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.OK, "Unauthorized!");
    }
    return shipping_address;
});
// get my shipping address
const getMyShippingAddress = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const shipping_address = yield shipping_address_model_1.ShippingAddress.findOne({
        user_id,
    });
    if (!shipping_address) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.OK, "No shipping address found!");
    }
    return shipping_address;
});
// update shipping address
const updateShippingAddress = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield shipping_address_model_1.ShippingAddress.findOneAndUpdate({ user_id: payload === null || payload === void 0 ? void 0 : payload.user_id }, payload, {
        upsert: true,
        new: true,
    });
    return result;
});
// delete shipping address
const deleteShippingAddress = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield shipping_address_model_1.ShippingAddress.findOneAndDelete({ user_id });
    return result;
});
exports.ShippingAddressService = {
    createShippingAddress,
    getAllShippingAddresss,
    getMyShippingAddress,
    getSingleShippingAddress,
    updateShippingAddress,
    deleteShippingAddress,
};
