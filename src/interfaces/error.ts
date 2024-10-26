export type IGenericErrorMessage = {
  path: string | number;
  message: string;
};

interface MongoServerError extends Error {
  code: number;
  keyValue: Record<string, any>;
}
