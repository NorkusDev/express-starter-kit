import { NextFunction, Request, Response } from "express";
import { RouteDefinition } from "../../abstraction/route-definition";
import BaseController from "../base-controller";
import { body, validationResult } from "express-validator";
import { UserService } from "./user-service";
import ResponseJson from "../../lib/response-handler";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../abstraction/api-error";
import jwt, { JwtPayload } from 'jsonwebtoken';
import FormatEnv from "../../lib/format-environment";
import Auth from "../../lib/authenticate-helper";

const userValidationRules = () => [
  body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long")
    .trim(),
];

const loginValidationRules = () => [
  body("username").notEmpty().withMessage("username tidak sesuai"),
  body("password")
    .notEmpty()
    .trim()
    .withMessage("password yang dimasukan tidak valid"),
];

export default class UserController extends BaseController {
  private userService: UserService;
  constructor() {
    super();
    this.userService = new UserService();
  }
  public basePath: string = "user";
  public routes(): RouteDefinition[] {
    return [
      {
        path: "/",
        method: "get",
        auth: true,
        handler: this.getUsers.bind(this),
      },
      {
        path: "/login",
        method: "post",
        validator: loginValidationRules(),
        handler: this.findByUsername.bind(this),
      },
    ];
  }

  public async getUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const auth = await Auth.authenticate(req)
      res.locals.data = req.user
      this.send(res,"Data token telah dibuat");
    } catch (error) {
      next(error);
    }
  }

  public async findByUsername(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { username, password } = req.body;
      const findUser = await this.userService.findByUsername(username);
      if (findUser == null) {
        throw new ApiError("Data tidak ditemukan", StatusCodes.NOT_FOUND);
      }
      res.locals.data = findUser;
      this.send(res, "Data ditemukan");
    } catch (error) {
      next(error);
    }
  }
}
// };