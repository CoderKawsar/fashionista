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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const jwtHelpers_1 = require("../helpers/jwtHelpers");
const user_model_1 = require("../modules/user/user.model");
const config_1 = __importDefault(require("../../config"));
const http_status_codes_1 = require("http-status-codes");
const authRole = (...requiredRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //get authorization token
        const token = req.headers.authorization;
        if (!token) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not authorized! Login first.");
        }
        // verify token
        let verifiedUser = null;
        verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
        // find user by verified token id
        const isUserExist = yield user_model_1.User.findById(verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.user_id).select("-createdAt -updatedAt -__v -full_name -mobile_number -email");
        // if the role is changed after last login, throw error
        if ((isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.role) !== (verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.role))
            throw new ApiError_1.default(423, "Your role changed. Login again.");
        // guard that specific role
        if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Forbidden access!");
        }
        // if everything pasesed
        if (isUserExist) {
            req.user = verifiedUser; // role  , userid
        }
        else {
            req.user = null;
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User not found!");
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.default = authRole;
