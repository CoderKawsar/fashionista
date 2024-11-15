import { z } from "zod";

const createProductSchema = z.object({
  title: z.string({
    required_error: "Product name is required!",
  }),
  description: z.string({
    required_error: "Description is required!",
  }),
  price: z
    .number({
      required_error: "Price is required!",
    })
    .min(0),
  dummy_price: z.number({}).min(0).optional(),
  available_quantity: z
    .number({
      required_error: "Quantity is required!",
    })
    .min(0),
  color: z
    .array(
      z
        .object({
          name: z.string().optional(),
          code: z.string().optional(),
        })
        .optional()
    )
    .optional(),
  size: z.array(z.string({})).optional(),
  target_customer_category: z.string({
    required_error: "Target customer category is required!",
  }),
  category_id: z.string({
    required_error: "Category is required!",
  }),
});

const updateProductZodSchema = z.object({
  title: z.string({}).optional(),
  author: z.string({}).optional(),
  membership_type: z.enum(["0", "1"]).optional(),
  sub_category_id: z.string({}).optional(),
  category_id: z.string({}).optional(),
  description: z.string({}).optional(),
  banner: z.string({}).optional(),
  syllabus: z.string({}).optional(),
  routine: z.string({}).optional(),
  study_materials: z.string({}).optional(),
});

export const ProductValidation = {
  createProductSchema,
  updateProductZodSchema,
};
