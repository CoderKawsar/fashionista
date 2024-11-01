"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingAddress = void 0;
const mongoose_1 = require("mongoose");
const shippingAddressSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        unique: true,
        immutable: true,
        ref: "User",
    },
    district: { type: String, required: true },
    upazilla: { type: String, required: true },
    address: { type: String, required: true },
    billing_contact_number: { type: String, required: true },
    billing_name: { type: String, required: true },
}, {
    timestamps: true,
});
exports.ShippingAddress = (0, mongoose_1.model)("ShippingAddress", shippingAddressSchema);
