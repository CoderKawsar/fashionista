"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./app/routes"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const ApiError_1 = __importDefault(require("./errors/ApiError"));
const config_1 = __importDefault(require("./config"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const http_status_codes_1 = require("http-status-codes");
const app = (0, express_1.default)();
// use middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: config_1.default.url.client, credentials: true }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// global rate limiter
const globalRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000, // 1 minutes
    limit: 120,
    handler: (req, res, next) => {
        // When the rate limit is exceeded, throw a custom error
        next(new ApiError_1.default(http_status_codes_1.StatusCodes.TOO_MANY_REQUESTS, `You're making requests a little too quickly! Please wait a moment and try again in a minute.`));
    },
});
// use router
app.use("/api/v1", globalRateLimiter, routes_1.default);
// global error handler
app.use(globalErrorHandler_1.default);
// handle not found
app.use((req, res, next) => {
    res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Not Found",
        errorMessages: [
            {
                path: req.originalUrl,
                message: "API not found!",
            },
        ],
    });
    next();
});
exports.default = app;
