import { NextFunction, Request, Response, Router } from "express";
import authRole from "../../middlewares/authRole";
import { ENUM_USER_ROLE } from "../../enums/user";
import { FileUploadHelper } from "../../helpers/fileUploadHelpers";
import { ProductValidation } from "./product.validation";
import { ProductController } from "./product.controller";

const router = Router();

// create Product
router.post(
  "/",
  authRole(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  FileUploadHelper.upload.single("main_image"),
  FileUploadHelper.upload.fields([{ name: "other_images", maxCount: 7 }]),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = ProductValidation.createProductSchema.parse(
      JSON.parse(req.body.data)
    );
    return ProductController.createProduct(req, res, next);
  }
);

// get all Products
router.get("/", ProductController.getAllProducts);

// get single Product
router.get("/:id", ProductController.getSingleProduct);

// update single Product
router.patch(
  "/:id",
  authRole(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  FileUploadHelper.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.data) {
        req.body = ProductValidation.updateProductZodSchema.parse(
          JSON.parse(req.body.data)
        );
      } else {
        req.body = ProductValidation.updateProductZodSchema.parse({});
      }
    } catch (error) {
      return next(error);
    }
    return ProductController.updateProduct(req, res, next);
  }
);

// delete Product
router.delete(
  "/:id",
  authRole(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  ProductController.deleteProduct
);

export const ProductRoutes = router;
