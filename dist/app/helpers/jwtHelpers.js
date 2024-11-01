"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtHelpers = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_codes_1 = require("http-status-codes");
const createToken = (payload, secret, expireTime) => {
    try {
        return jsonwebtoken_1.default.sign(payload, secret, {
            expiresIn: expireTime,
        });
    }
    catch (error) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid token");
    }
};
const verifyToken = (token, secret) => {
    try {
        const isVerified = jsonwebtoken_1.default.verify(token, secret);
        return isVerified;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid token");
    }
};
exports.jwtHelpers = {
    createToken,
    verifyToken,
};
