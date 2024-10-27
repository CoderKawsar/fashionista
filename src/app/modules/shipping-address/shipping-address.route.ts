import { Router } from "express";
import { ShippingAddressController } from "./shipping-address.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ShippingAddressValidation } from "./shipping-address.validation";
import authRole from "../../middlewares/authRole";
import { ENUM_USER_ROLE } from "../../enums/user";

const router = Router();

// create shipping address
router.post(
  "/",
  authRole(ENUM_USER_ROLE.CUSTOMER),
  validateRequest(ShippingAddressValidation.createShippingAddressZodSchema),
  ShippingAddressController.createShippingAddress
);

// get all shipping addresses
router.get(
  "/",
  authRole(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  ShippingAddressController.getAllShippingAddresss
);

// get single shipping address
router.get(
  "/my-shipping-address",
  authRole(ENUM_USER_ROLE.CUSTOMER),
  ShippingAddressController.getMyShippingAddress
);

// get single shipping address
router.get(
  "/:id",
  authRole(ENUM_USER_ROLE.CUSTOMER),
  ShippingAddressController.getSingleShippingAddress
);

// update single shipping address
router.patch(
  "/update",
  authRole(ENUM_USER_ROLE.CUSTOMER),
  validateRequest(ShippingAddressValidation.updateShippingAddressZodSchema),
  ShippingAddressController.updateShippingAddress
);

// delete single shipping address
router.delete(
  "/delete",
  authRole(ENUM_USER_ROLE.CUSTOMER),
  ShippingAddressController.deleteShippingAddress
);

export const ShippingAddressRoutes = router;
