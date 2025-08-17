import { Request, Response, NextFunction } from "express";
import { HttpException } from "../utils/httpException";

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let status = 500;
  let message = "Internal server error";

  if (err instanceof HttpException) {
    status = err.statusCode;
    message = err.message;
  }

  if (process.env.NODE_ENV !== "production") {
    console.error("❌ Error:", {
      name: err.name,
      message: err.message,
      stack: err.stack,
    });
  }

  res.status(status).json({
    success: false,
    statusCode: status,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};
