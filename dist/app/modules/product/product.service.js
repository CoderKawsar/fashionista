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
exports.ProductService = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelpers_1 = require("../../helpers/paginationHelpers");
const category_model_1 = require("../category/category.model");
const http_status_codes_1 = require("http-status-codes");
const fileUploadHelpers_1 = require("../../helpers/fileUploadHelpers");
const product_constants_1 = require("./product.constants");
const product_model_1 = require("./product.model");
// create Product
const createProduct = (req) => __awaiter(void 0, void 0, void 0, function* () {
    // to check if the category is present of the provided category-id
    const category = yield category_model_1.Category.findById(req.body.category_id);
    if (!category) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.OK, "Category not found!");
    }
    if (req.file) {
        const file = req.file;
        const uploadedImage = yield fileUploadHelpers_1.FileUploadHelper.uploadToCloudinary(file);
        if (uploadedImage) {
            req.body.banner = uploadedImage.secure_url;
        }
    }
    const result = yield product_model_1.Product.create(req.body);
    return result;
});
// get all Products
const getAllProducts = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: product_constants_1.productSearchableFields.map((field) => ({
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
    let result = yield product_model_1.Product.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit)
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
            path: "category_id", // Conditional population for root category_id
            select: "title _id",
        },
    ])
        .select("-createdAt -updatedAt -__v -study_materials");
    const total = yield product_model_1.Product.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
// get Product
const getSingleProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_model_1.Product.findById(id)
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
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.OK, "Product not found!");
    }
    return result;
});
// update Product
const updateProduct = (req) => __awaiter(void 0, void 0, void 0, function* () {
    // find Product of given id
    const product = yield product_model_1.Product.findById(req.params.id);
    if (!product) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.OK, "Product not found!");
    }
    // if image is given, upload new, and delete old one
    if (req.file) {
        const file = req.file;
        const uploadedImage = yield fileUploadHelpers_1.FileUploadHelper.uploadToCloudinary(file);
        if (uploadedImage) {
            req.body.banner = uploadedImage.secure_url;
        }
        if (product.main_image) {
            // delete that Product banner image from cloudinary
            fileUploadHelpers_1.FileUploadHelper.deleteFromCloudinary(product === null || product === void 0 ? void 0 : product.main_image);
        }
    }
    if (req.body.category_id && !req.body.sub_category_id)
        delete req.body.sub_category_id;
    // updating Product
    const result = yield product_model_1.Product.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
    });
    return result;
});
// delete Product
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.Product.findById(id);
    if (!product_model_1.Product) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.OK, "Product not found!");
    }
    else {
        if (product === null || product === void 0 ? void 0 : product.main_image) {
            // delete that Product banner from cloudinary
            fileUploadHelpers_1.FileUploadHelper.deleteFromCloudinary(product === null || product === void 0 ? void 0 : product.main_image);
        }
    }
    // find and delete Product in one operation
    const result = yield product_model_1.Product.findByIdAndDelete(id);
    return result;
});
exports.ProductService = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
};
