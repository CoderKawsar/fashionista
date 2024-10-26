import { Types } from "mongoose";
import { ENUM_USER_ROLE } from "../../enums/user";

export interface IUser {
  _id?: Types.ObjectId;
  full_name: string;
  email: string;
  mobile_number: string;
  password: string;
  role: ENUM_USER_ROLE;
}

export interface IUserFilters {
  searchTerm?: string;
  fields?: string; // comma separated list of fields to return
  full_name?: string;
  email?: string;
  mobile_number?: string;
  role?: string;
}

export type ILoginInfo = {
  email_or_mobile: string;
  password: string;
};

export type ChangePasswordPayload = {
  email_or_mobile: string;
  old_password: string;
  new_password: string;
};
