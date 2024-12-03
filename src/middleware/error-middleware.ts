import { StatusCodes } from "http-status-codes";
import ApiError, { IError } from "../abstraction/api-error";
import logger from "../lib/winston-logger";
import * as express from "express";
import * as util from "util";
import ResponseJson from "../lib/response-handler";

const addErrorHandler = (
  err: ApiError,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  if (err) {
    const status: number = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
    logger.error(`REQUEST HANDLING ERROR:
        \nERROR:\n${JSON.stringify(err)}
        \nBODY:\n${util.inspect(req.body)}`);
    const body: IError | string = {
      fields: err.fields,
      message: err.message || "An error occurred during the request.",
      name: err.name,
      status,
    };
    ResponseJson.sendFailed(res, status, body.message);
  }
  next();
};

export default addErrorHandler;
