import { Router } from "express";
import { UserController } from "./user.controller";
import authRole from "../../middlewares/authRole";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import limitRequestPerMinute from "../../middlewares/rateLimit";
import { ENUM_USER_ROLE } from "../../enums/user";

const router = Router();

// register customer
router.post(
  "/",
  limitRequestPerMinute(5),
  validateRequest(UserValidation.RegisterUserZodSchema),
  UserController.signUpCustomer
);

/*================================================
TURN THIS ROUTE OFF IN PRODUCTION
================================================*/
// create super admin
// router.post("/create-super-admin", validateRequest(UserValidation.CreateAdminZodSchema), UserController.createSuperAdmin);

// create admin
router.post(
  "/create-admin",
  limitRequestPerMinute(10),
  authRole(ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(UserValidation.CreateAdminZodSchema),
  UserController.createAdmin
);

// login user
router.post(
  "/login",
  limitRequestPerMinute(5),
  validateRequest(UserValidation.LoginUserZodSchema),
  UserController.loginUser
);

// Refresh token
router.post(
  "/refresh-token",
  limitRequestPerMinute(2),
  validateRequest(UserValidation.RefreshTokenZodSchema),
  UserController.refreshToken
);

// change password
router.patch(
  "/change-password",
  limitRequestPerMinute(5),
  authRole(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.CUSTOMER
  ),
  validateRequest(UserValidation.ChangePasswordZodSchema),
  UserController.changePassword
);

// get all users
router.get(
  "/",
  authRole(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserController.getAllUsers
);

// get single user
router.get(
  "/:user_id",
  authRole(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.CUSTOMER
  ),
  UserController.getSingleUser
);

// update user
router.patch(
  "/:user_id",
  limitRequestPerMinute(10),
  authRole(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.CUSTOMER
  ),
  validateRequest(UserValidation.UpdateUserZodSchema),
  UserController.updateUser
);

// delete user
router.delete(
  "/:user_id",
  authRole(ENUM_USER_ROLE.SUPER_ADMIN),
  UserController.deleteUser
);

export const UserRoutes = router;
