"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    const responseData = {
        statusCode: data.statusCode,
        success: data.success,
        message: data.message || null,
        cacheMaxAge: data.cacheMaxAge,
        meta: data.meta || null || undefined,
        data: data.data || null || undefined,
    };
    // Set cache-control header
    if (data.cacheMaxAge) {
        res.set("Cache-Control", `private, max-age=${data.cacheMaxAge}, must-revalidate`);
    }
    // Send response
    res.status(data.statusCode).json(responseData);
};
exports.default = sendResponse;
