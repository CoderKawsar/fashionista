import { Types } from "mongoose";

export interface IShippingAddress {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  billing_name: string;
  billing_contact_number: string;
  district: string;
  upazilla: string;
  address: string;
}

export interface IShippingAddressFilters {
  searchTerm?: string;
  user_id?: Types.ObjectId;
  billing_name?: string;
  billing_contact_number?: string;
  district?: string;
  upazilla?: string;
}
