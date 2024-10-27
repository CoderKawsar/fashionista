import { z } from "zod";

const createCategorySchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Category title is required!",
    }),
  }),
});

const updateCategoryZodSchema = z.object({
  body: z.object({
    title: z.string({}).optional(),
  }),
});

export const CategoryValidation = {
  createCategorySchema,
  updateCategoryZodSchema,
};
