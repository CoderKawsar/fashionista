import { z } from "zod";

const createProductSchema = z
  .object({
    title: z.string({
      required_error: "Product name is required!",
    }),
    author: z.string({}).optional(),
    membership_type: z.enum(["0", "1"]).refine(
      (value) => {
        return value === "0" || value === "1";
      },
      {
        message: "Membership type must be either '0'(free) or '1'(paid)",
      }
    ),
    sub_category_id: z.string({}).optional(),
    category_id: z.string({}).optional(),
    description: z.string({
      required_error: "Description is required!",
    }),
    banner: z.string({}).optional(),
    syllabus: z.string({}).optional(),
    routine: z.string({}).optional(),
    study_materials: z.string({}).optional(),
  })
  .refine((data) => {
    const hasSubCategory = data.hasOwnProperty("sub_category_id");
    const hasCategory = data.hasOwnProperty("category_id");

    // Allow both sub_category_id and category_id
    if (hasSubCategory && hasCategory) {
      return data;
    }

    if (!hasSubCategory && !hasCategory) {
      throw new Error(
        "At least one of sub_category_id or category_id is required"
      );
    }

    // Validation successful, return the data
    return data;
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
