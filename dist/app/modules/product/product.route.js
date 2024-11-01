"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = require("express");
const authRole_1 = __importDefault(require("../../middlewares/authRole"));
const fileUploadHelpers_1 = require("../../helpers/fileUploadHelpers");
const product_validation_1 = require("./product.validation");
const product_controller_1 = require("./product.controller");
const router = (0, express_1.Router)();
// create Product
router.post("/", (0, authRole_1.default)("super_admin" /* ENUM_USER_ROLE.SUPER_ADMIN */, "admin" /* ENUM_USER_ROLE.ADMIN */), fileUploadHelpers_1.FileUploadHelper.upload.single("main_image"), fileUploadHelpers_1.FileUploadHelper.upload.fields([{ name: "other_images", maxCount: 7 }]), (req, res, next) => {
    req.body = product_validation_1.ProductValidation.createProductSchema.parse(JSON.parse(req.body.data));
    return product_controller_1.ProductController.createProduct(req, res, next);
});
// get all Products
router.get("/", product_controller_1.ProductController.getAllProducts);
// get single Product
router.get("/:id", product_controller_1.ProductController.getSingleProduct);
// update single Product
router.patch("/:id", (0, authRole_1.default)("super_admin" /* ENUM_USER_ROLE.SUPER_ADMIN */, "admin" /* ENUM_USER_ROLE.ADMIN */), fileUploadHelpers_1.FileUploadHelper.upload.single("file"), (req, res, next) => {
    try {
        if (req.body.data) {
            req.body = product_validation_1.ProductValidation.updateProductZodSchema.parse(JSON.parse(req.body.data));
        }
        else {
            req.body = product_validation_1.ProductValidation.updateProductZodSchema.parse({});
        }
    }
    catch (error) {
        return next(error);
    }
    return product_controller_1.ProductController.updateProduct(req, res, next);
});
// delete Product
router.delete("/:id", (0, authRole_1.default)("super_admin" /* ENUM_USER_ROLE.SUPER_ADMIN */, "admin" /* ENUM_USER_ROLE.ADMIN */), product_controller_1.ProductController.deleteProduct);
exports.ProductRoutes = router;
