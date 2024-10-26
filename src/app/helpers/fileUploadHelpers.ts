import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import * as fs from "fs";
import config from "../../config";
import { ICloudinaryResponse, IUploadFile } from "../../interfaces/file";

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

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
  uploadToCloudinary,
  deleteFromCloudinary,
  upload,
};
