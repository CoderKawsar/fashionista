import { Schema, model } from "mongoose";
import { IShippingAddress } from "./shipping-address.interface";

const shippingAddressSchema = new Schema<IShippingAddress>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      immutable: true,
      ref: "User",
    },
    division: { type: String, required: true },
    district: { type: String, required: true },
    upazilla: { type: String, required: true },
    address: { type: String, required: true },
    contact_no: { type: String, required: true },
    billing_name: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

export const ShippingAddress = model<IShippingAddress>(
  "ShippingAddress",
  shippingAddressSchema
);
