import { Request, Response, NextFunction } from "express";
import { ValidationChain } from "express-validator";

export interface RouteDefinition {
  path: string;
  method: "get" | "post" | "put" | "patch" | "delete";
  validator?: ValidationChain[];
  auth?: boolean;
  roleBased? : [];
  handler: (req: Request, res: Response, next: NextFunction) => void;
}
