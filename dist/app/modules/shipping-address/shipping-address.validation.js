"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingAddressValidation = void 0;
const zod_1 = require("zod");
const createShippingAddressZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        billing_name: zod_1.z.string({
            required_error: "Billing name is required!",
        }),
        billing_contact_no: zod_1.z.string({
            required_error: "Billing contact number is required!",
        }),
        district: zod_1.z.string({
            required_error: "District is required!",
        }),
        upazilla: zod_1.z.string({
            required_error: "Upazilla is required!",
        }),
        address: zod_1.z.string({
            required_error: "Address is required!",
        }),
    }),
});
const updateShippingAddressZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        billing_name: zod_1.z.string({}).optional(),
        billing_contact_no: zod_1.z.string({}).optional(),
        district: zod_1.z.string({}).optional(),
        upazilla: zod_1.z.string({}).optional(),
        address: zod_1.z.string({}).optional(),
    }),
});
exports.ShippingAddressValidation = {
    createShippingAddressZodSchema,
    updateShippingAddressZodSchema,
};
