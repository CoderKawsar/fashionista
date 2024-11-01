import { v2 as cloudinary } from "cloudinary";
import multer, { FileFilterCallback } from "multer";
import fs from "fs";
import config from "../../config";
import { ICloudinaryResponse, IUploadFile } from "../../interfaces/file";
import ApiError from "../../errors/ApiError";
import { StatusCodes } from "http-status-codes";

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

// save file to server storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now().toString() + file.originalname);
  },
});

// Allowed image types
const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "image/svg",
];

// filter file types
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Only image files are allowed!"
    );
  }
};

// finally upload to server storage
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  // @ts-ignore
  fileFilter,
});

const uploadToCloudinary = async (
  file: IUploadFile
): Promise<ICloudinaryResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      (error: Error, result: ICloudinaryResponse) => {
        fs.unlinkSync(file.path);
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const deleteFromCloudinary = async (
  secureUrl: string
): Promise<ICloudinaryResponse | undefined> => {
  return new Promise((resolve, reject) => {
    const parts = secureUrl.split("/");
    if (parts.length > 0) {
      const publicId = parts.pop()?.replace(/\.[^/.]+$/, "");
      if (publicId) {
        cloudinary.uploader.destroy(
          publicId,
          (error: Error, result: ICloudinaryResponse) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
      } else {
        reject(new Error("Failed to extract publicId"));
      }
    } else {
      reject(new Error("Invalid secureUrl format"));
    }
  });
};

export const FileUploadHelper = {
  upload,
  uploadToCloudinary,
  deleteFromCloudinary,
};
