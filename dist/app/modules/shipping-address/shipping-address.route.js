"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingAddressRoutes = void 0;
const express_1 = require("express");
const shipping_address_controller_1 = require("./shipping-address.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const shipping_address_validation_1 = require("./shipping-address.validation");
const authRole_1 = __importDefault(require("../../middlewares/authRole"));
const router = (0, express_1.Router)();
// create shipping address
router.post("/", (0, authRole_1.default)("customer" /* ENUM_USER_ROLE.CUSTOMER */), (0, validateRequest_1.default)(shipping_address_validation_1.ShippingAddressValidation.createShippingAddressZodSchema), shipping_address_controller_1.ShippingAddressController.createShippingAddress);
// get all shipping addresses
router.get("/", (0, authRole_1.default)("super_admin" /* ENUM_USER_ROLE.SUPER_ADMIN */, "admin" /* ENUM_USER_ROLE.ADMIN */), shipping_address_controller_1.ShippingAddressController.getAllShippingAddresss);
// get single shipping address
router.get("/my-shipping-address", (0, authRole_1.default)("customer" /* ENUM_USER_ROLE.CUSTOMER */), shipping_address_controller_1.ShippingAddressController.getMyShippingAddress);
// get single shipping address
router.get("/:id", (0, authRole_1.default)("customer" /* ENUM_USER_ROLE.CUSTOMER */), shipping_address_controller_1.ShippingAddressController.getSingleShippingAddress);
// update single shipping address
router.patch("/update", (0, authRole_1.default)("customer" /* ENUM_USER_ROLE.CUSTOMER */), (0, validateRequest_1.default)(shipping_address_validation_1.ShippingAddressValidation.updateShippingAddressZodSchema), shipping_address_controller_1.ShippingAddressController.updateShippingAddress);
// delete single shipping address
router.delete("/delete", (0, authRole_1.default)("customer" /* ENUM_USER_ROLE.CUSTOMER */), shipping_address_controller_1.ShippingAddressController.deleteShippingAddress);
exports.ShippingAddressRoutes = router;
