"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// errors/handleMongooseError.js
const mongoose_1 = require("mongoose");
const handleMongooseError = (error) => {
    let errors = [];
    let statusCode = 500;
    let message = "Mongoose Error";
    if (error instanceof mongoose_1.Error.ValidationError) {
        // Handle Mongoose ValidationError
        statusCode = 400;
        message = "Validation Error";
        errors = Object.values(error.errors).map((err) => ({
            path: err.path,
            message: err.message,
        }));
    }
    else if (error instanceof mongoose_1.Error.CastError) {
        // Handle Mongoose CastError
        statusCode = 400;
        message = `Invalid ${error.path}: ${error.value}`;
        errors = [
            {
                path: error.path,
                message: message,
            },
        ];
        // @ts-ignore
    }
    else if (error.code && error.code === 11000) {
        // Handle Mongoose Duplicate Key Error
        statusCode = 409;
        message = "Duplicate Key Error";
        // @ts-ignore
        errors = Object.keys(error.keyValue).map((key) => ({
            path: key,
            message: `${key} already exists.`,
        }));
    }
    return {
        statusCode,
        message,
        errorMessages: errors,
    };
};
exports.default = handleMongooseError;
