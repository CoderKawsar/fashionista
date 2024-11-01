"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidation = void 0;
const zod_1 = require("zod");
const createProductSchema = zod_1.z
    .object({
    title: zod_1.z.string({
        required_error: "Product name is required!",
    }),
    author: zod_1.z.string({}).optional(),
    membership_type: zod_1.z.enum(["0", "1"]).refine((value) => {
        return value === "0" || value === "1";
    }, {
        message: "Membership type must be either '0'(free) or '1'(paid)",
    }),
    sub_category_id: zod_1.z.string({}).optional(),
    category_id: zod_1.z.string({}).optional(),
    description: zod_1.z.string({
        required_error: "Description is required!",
    }),
    banner: zod_1.z.string({}).optional(),
    syllabus: zod_1.z.string({}).optional(),
    routine: zod_1.z.string({}).optional(),
    study_materials: zod_1.z.string({}).optional(),
})
    .refine((data) => {
    const hasSubCategory = data.hasOwnProperty("sub_category_id");
    const hasCategory = data.hasOwnProperty("category_id");
    // Allow both sub_category_id and category_id
    if (hasSubCategory && hasCategory) {
        return data;
    }
    if (!hasSubCategory && !hasCategory) {
        throw new Error("At least one of sub_category_id or category_id is required");
    }
    // Validation successful, return the data
    return data;
});
const updateProductZodSchema = zod_1.z.object({
    title: zod_1.z.string({}).optional(),
    author: zod_1.z.string({}).optional(),
    membership_type: zod_1.z.enum(["0", "1"]).optional(),
    sub_category_id: zod_1.z.string({}).optional(),
    category_id: zod_1.z.string({}).optional(),
    description: zod_1.z.string({}).optional(),
    banner: zod_1.z.string({}).optional(),
    syllabus: zod_1.z.string({}).optional(),
    routine: zod_1.z.string({}).optional(),
    study_materials: zod_1.z.string({}).optional(),
});
exports.ProductValidation = {
    createProductSchema,
    updateProductZodSchema,
};
