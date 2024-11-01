import { Types } from "mongoose";

export interface IProduct {
  title: string;
  description: string;
  main_image: string;
  other_images: string[];
  dummy_price: number;
  price: number;
  available_quantity: number;
  color: {
    name: string;
    code: string;
  }[];
  size: string;
  target_customer_category: string;
  category_id: Types.ObjectId;
}

export interface IProductFilters {
  searchTerm?: string;
  title?: string;
  dummy_price?: number;
  price?: number;
  quantity?: number;
  size?: string;
  target_customer_category?: string;
  category_id?: Types.ObjectId;
}
