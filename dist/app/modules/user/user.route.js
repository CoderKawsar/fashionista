"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const authRole_1 = __importDefault(require("../../middlewares/authRole"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validation_1 = require("./user.validation");
const rateLimit_1 = __importDefault(require("../../middlewares/rateLimit"));
const router = (0, express_1.Router)();
// register customer
router.post("/", (0, rateLimit_1.default)(5), (0, validateRequest_1.default)(user_validation_1.UserValidation.RegisterUserZodSchema), user_controller_1.UserController.signUpCustomer);
/*================================================
TURN THIS ROUTE OFF IN PRODUCTION
================================================*/
// create super admin
// router.post("/create-super-admin", validateRequest(UserValidation.CreateAdminZodSchema), UserController.createSuperAdmin);
// create admin
router.post("/create-admin", (0, rateLimit_1.default)(10), (0, authRole_1.default)("super_admin" /* ENUM_USER_ROLE.SUPER_ADMIN */), (0, validateRequest_1.default)(user_validation_1.UserValidation.CreateAdminZodSchema), user_controller_1.UserController.createAdmin);
// login user
router.post("/login", (0, rateLimit_1.default)(5), (0, validateRequest_1.default)(user_validation_1.UserValidation.LoginUserZodSchema), user_controller_1.UserController.loginUser);
// Refresh token
router.post("/refresh-token", (0, rateLimit_1.default)(2), (0, validateRequest_1.default)(user_validation_1.UserValidation.RefreshTokenZodSchema), user_controller_1.UserController.refreshToken);
// change password
router.patch("/change-password", (0, rateLimit_1.default)(5), (0, authRole_1.default)("super_admin" /* ENUM_USER_ROLE.SUPER_ADMIN */, "admin" /* ENUM_USER_ROLE.ADMIN */, "customer" /* ENUM_USER_ROLE.CUSTOMER */), (0, validateRequest_1.default)(user_validation_1.UserValidation.ChangePasswordZodSchema), user_controller_1.UserController.changePassword);
// get all users
router.get("/", (0, authRole_1.default)("super_admin" /* ENUM_USER_ROLE.SUPER_ADMIN */, "admin" /* ENUM_USER_ROLE.ADMIN */), user_controller_1.UserController.getAllUsers);
// get single user
router.get("/:user_id", (0, authRole_1.default)("super_admin" /* ENUM_USER_ROLE.SUPER_ADMIN */, "admin" /* ENUM_USER_ROLE.ADMIN */, "customer" /* ENUM_USER_ROLE.CUSTOMER */), user_controller_1.UserController.getSingleUser);
// update user
router.patch("/:user_id", (0, rateLimit_1.default)(10), (0, authRole_1.default)("super_admin" /* ENUM_USER_ROLE.SUPER_ADMIN */, "admin" /* ENUM_USER_ROLE.ADMIN */, "customer" /* ENUM_USER_ROLE.CUSTOMER */), (0, validateRequest_1.default)(user_validation_1.UserValidation.UpdateUserZodSchema), user_controller_1.UserController.updateUser);
// delete user
router.delete("/:user_id", (0, authRole_1.default)("super_admin" /* ENUM_USER_ROLE.SUPER_ADMIN */), user_controller_1.UserController.deleteUser);
exports.UserRoutes = router;
