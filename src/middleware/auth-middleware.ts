import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import FormatEnv from "../lib/format-environment";
import { User } from "../database/models/user-model";
import Auth from "../lib/authenticate-helper";
import ResponseJson from "../lib/response-handler";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const token = Auth.bearerToken(req);

    const payload = Auth.verifyToken(token)

    req.user = { id: payload.data.userId }
    next();

  } catch (error) {
    throw error
  }
};

