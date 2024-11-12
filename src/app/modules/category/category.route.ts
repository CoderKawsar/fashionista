import { NextFunction, Request, Response, Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import authRole from "../../middlewares/authRole";
import { ENUM_USER_ROLE } from "../../enums/user";
import { CategoryController } from "./category.controller";
import { CategoryValidation } from "./category.validation";
import { FileUploadHelper } from "../../helpers/fileUploadHelpers";

const router = Router();

// create Category
router.post(
  "/",
  authRole(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  FileUploadHelper.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = CategoryValidation.createCategorySchema.parse(
      JSON.parse(req.body.data)
    );
    return CategoryController.createCategory(req, res, next);
  }
);

// get all Categories
router.get("/", CategoryController.getAllCategories);

// get single Category
router.get("/:id", CategoryController.getSingleCategory);

// update single Category
router.patch(
  "/:id",
  authRole(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  FileUploadHelper.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = CategoryValidation.updateCategoryZodSchema.parse(
      JSON.parse(req.body.data)
    );
    return CategoryController.updateCategory(req, res, next);
  }
);

// delete Category
router.delete(
  "/:id",
  authRole(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  CategoryController.deleteCategory
);

export const CategoryRoutes = router;
