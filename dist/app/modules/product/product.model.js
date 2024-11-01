"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String },
    main_image: { type: String, required: true },
    other_images: [{ type: String }],
    price: { type: Number, required: true },
    dummy_price: { type: Number, required: true },
    available_quantity: { type: Number, required: true, default: 0 },
    color: [
        {
            name: { type: String },
            code: { type: String },
        },
    ],
    size: { type: String, required: true },
    target_customer_category: { type: String, required: true },
    category_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category",
    },
}, { timestamps: true, toJSON: { virtuals: true } });
productSchema.index({ title: 1, price: 1, category_id: 1 }, { unique: true });
exports.Product = (0, mongoose_1.model)("Product", productSchema);
