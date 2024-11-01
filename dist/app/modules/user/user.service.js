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
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const user_model_1 = require("./user.model");
const user_utills_1 = require("./user.utills");
const jwtHelpers_1 = require("../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
const http_status_codes_1 = require("http-status-codes");
const user_constant_1 = require("./user.constant");
const paginationHelpers_1 = require("../../helpers/paginationHelpers");
// register a student
const signUpCustomer = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    userData.role = "customer" /* ENUM_USER_ROLE.CUSTOMER */;
    const createdUser = yield user_utills_1.UserUtills.createUser(userData);
    const { accessToken, refreshToken } = yield user_utills_1.UserUtills.createTokenRefreshTokenForUser({
        user_id: createdUser === null || createdUser === void 0 ? void 0 : createdUser._id.toString(),
        role: createdUser === null || createdUser === void 0 ? void 0 : createdUser.role,
    });
    return { accessToken, refreshToken };
});
// create super admin
const createSuperAdmin = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    // creating user
    userData.role = "super_admin" /* ENUM_USER_ROLE.SUPER_ADMIN */;
    const createdUser = yield user_utills_1.UserUtills.createUser(userData);
    return createdUser;
});
// create admin
const createAdmin = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    userData.role = "admin" /* ENUM_USER_ROLE.ADMIN */;
    const createdUser = yield user_utills_1.UserUtills.createUser(userData);
    return createdUser;
});
// login user
const login = (loginInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const { email_or_mobile, password } = loginInfo;
    let requestedUser = yield user_model_1.User.findOne({
        $or: [
            { mobile_number: { $eq: email_or_mobile } },
            { email: { $eq: email_or_mobile } },
        ],
    }).select("_id email mobile_number password role");
    if (!requestedUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User not found!");
    }
    // compare password
    const isPasswordMatched = bcrypt_1.default.compareSync(password, requestedUser === null || requestedUser === void 0 ? void 0 : requestedUser.password);
    // if password doesn't match, throw error
    if (!isPasswordMatched) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid credentials!");
    }
    const { accessToken, refreshToken } = yield user_utills_1.UserUtills.createTokenRefreshTokenForUser({
        user_id: requestedUser === null || requestedUser === void 0 ? void 0 : requestedUser._id.toString(),
        role: requestedUser === null || requestedUser === void 0 ? void 0 : requestedUser.role,
    });
    return { isPasswordMatched, accessToken, refreshToken };
});
// refresh token
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
    const isUserExist = yield user_model_1.User.findById(verifiedToken === null || verifiedToken === void 0 ? void 0 : verifiedToken.user_id);
    if (!isUserExist)
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User not found!");
    const newAccessToken = jwtHelpers_1.jwtHelpers.createToken({
        user_id: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist._id,
        role: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.role,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        accessToken: newAccessToken,
    };
});
// change password
const changePassword = (payload, authUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const { email_or_mobile, old_password, new_password } = payload;
    let user = yield user_model_1.User.findOne({
        $or: [
            { mobile_number: { $eq: email_or_mobile } },
            { email: { $eq: email_or_mobile } },
        ],
    }).select("_id email mobile_number password role");
    if ((user === null || user === void 0 ? void 0 : user._id.toString()) !== authUserId)
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid mobile number. This is not your mobile number!");
    // compare password
    const isPasswordMatched = bcrypt_1.default.compareSync(old_password, user === null || user === void 0 ? void 0 : user.password);
    // if password doesn't match, throw error
    if (!isPasswordMatched) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid credentials!");
    }
    const hashedPassword = user_utills_1.UserUtills.hashPassword(new_password);
    yield user_model_1.User.findOneAndUpdate({ email: user === null || user === void 0 ? void 0 : user.email }, {
        password: hashedPassword,
    });
    return "Password successfully changed!";
});
// get all users
const getAllUsers = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: user_constant_1.userSearchableFields.map((field) => ({
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
    const result = yield user_model_1.User.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit)
        .select("-password");
    const total = yield user_model_1.User.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
// get single user
const getSingleUser = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(user_id).select("-__v -createdAt -updatedAt");
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User not found!");
    }
    return result;
});
// update user
const updateUser = (user_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updatingPayload = __rest(payload, []);
    const result = yield user_model_1.User.findByIdAndUpdate(user_id, updatingPayload, {
        new: true,
    }).select("-__v -createdAt -updatedAt -session_id");
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User not found!");
    }
    return result;
});
// delete user
const deleteUser = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndDelete(user_id).select("-__v -createdAt -updatedAt -session_id");
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User not found!");
    }
});
exports.UserService = {
    signUpCustomer,
    createSuperAdmin,
    createAdmin,
    login,
    refreshToken,
    changePassword,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
};
