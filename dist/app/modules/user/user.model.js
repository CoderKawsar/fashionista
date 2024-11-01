"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    full_name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    mobile_number: { type: String, unique: true, required: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, required: true },
}, {
    timestamps: true,
});
exports.User = (0, mongoose_1.model)("User", userSchema);
