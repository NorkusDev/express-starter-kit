import { RouteDefinition } from "../abstraction/route-definition";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import ResponseJson from "../lib/response-handler";

export default abstract class BaseController {
  public abstract routes(): RouteDefinition[];
  public abstract basePath: string;
  public send(
    res: Response,
    message?: string,
    statusCode: number = StatusCodes.OK
  ): void {
    let obj = {};
    obj = res.locals.data;
    ResponseJson.sendSuccess(res, statusCode, message ?? "Good", obj);
  }
}
