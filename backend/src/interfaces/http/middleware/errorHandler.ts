import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../constants/statusCode";
import { Messages } from "../../../constants/messages";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: Messages.INTERNAL_SERVER_ERROR,
  });
}
