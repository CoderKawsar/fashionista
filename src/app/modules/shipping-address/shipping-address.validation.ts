import { z } from "zod";

const createShippingAddressZodSchema = z.object({
  body: z.object({
    billing_name: z.string({
      required_error: "Billing name is required!",
    }),
    billing_contact_no: z.string({
      required_error: "Billing contact number is required!",
    }),
    district: z.string({
      required_error: "District is required!",
    }),
    upazilla: z.string({
      required_error: "Upazilla is required!",
    }),
    address: z.string({
      required_error: "Address is required!",
    }),
  }),
});

const updateShippingAddressZodSchema = z.object({
  body: z.object({
    billing_name: z.string({}).optional(),
    billing_contact_no: z.string({}).optional(),
    district: z.string({}).optional(),
    upazilla: z.string({}).optional(),
    address: z.string({}).optional(),
  }),
});

export const ShippingAddressValidation = {
  createShippingAddressZodSchema,
  updateShippingAddressZodSchema,
};
