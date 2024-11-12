import { z } from "zod";

const createCategorySchema = z.object({
  title: z.string({
    required_error: "Category title is required!",
  }),
});

const updateCategoryZodSchema = z.object({
  title: z.string({}).optional(),
});

export const CategoryValidation = {
  createCategorySchema,
  updateCategoryZodSchema,
};
