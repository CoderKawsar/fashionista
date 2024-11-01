"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_codes_1 = require("http-status-codes");
const limitRequestPerMinute = (limit) => (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000, // 1 minutes
    limit: limit,
    handler: (req, res, next) => {
        // When the rate limit is exceeded, throw a custom error
        next(new ApiError_1.default(http_status_codes_1.StatusCodes.TOO_MANY_REQUESTS, "You're making requests a little too quickly! Please wait a moment and try again in a minute."));
    },
});
exports.default = limitRequestPerMinute;
