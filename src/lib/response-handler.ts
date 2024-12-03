import { Response } from "express";
interface ResponseSuccess {
  status_code: number;
  status: string;
  message: string;
  data?: any;
}

interface ResponseFailed {
  status_code: number;
  status: string;
  message: string;
  errors?: any;
}

class ResponseJson {
  public static sendSuccess(
    res: Response,
    status_code: number,
    message: string,
    data: any = null
  ) {
    const result: ResponseSuccess = {
      status_code: status_code,
      status: "success",
      message: message,
      data: data,
    };
    return res.status(status_code).json(result);
  }
  public static sendFailed(
    res: Response,
    status_code: number,
    message: string,
    errors: any = null
  ) {
    const result: ResponseFailed = {
      status_code: status_code,
      status: "error",
      message: message,
      errors: errors,
    };
    return res.status(status_code).json(result);
  }
}
export default ResponseJson;
