import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import ResponseJson from "../lib/response-handler";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ResponseJson.sendFailed(
      res,
      StatusCodes.BAD_REQUEST,
      ReasonPhrases.BAD_REQUEST,
      errors.array()
    );
  }
  next();
};
