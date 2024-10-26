import { Response } from "express";

type IApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string | null;
  cacheMaxAge?: number;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data?: T | null;
};

const sendResponse = <T>(res: Response, data: IApiResponse<T>): void => {
  const responseData: IApiResponse<T> = {
    statusCode: data.statusCode,
    success: data.success,
    message: data.message || null,
    cacheMaxAge: data.cacheMaxAge,
    meta: data.meta || null || undefined,
    data: data.data || null || undefined,
  };

  // Set cache-control header
  if (data.cacheMaxAge) {
    res.set(
      "Cache-Control",
      `private, max-age=${data.cacheMaxAge}, must-revalidate`
    );
  }

  // Send response
  res.status(data.statusCode).json(responseData);
};

export default sendResponse;
