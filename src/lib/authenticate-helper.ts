import { NextFunction, Request, Response } from "express";
import { User } from "../database/models/user-model";
import FormatEnv from "./format-environment";
import jwt, { JwtPayload } from "jsonwebtoken";
import ApiError from "../abstraction/api-error";
import { createHash } from "crypto";
import { v4 as uuidv4 } from "uuid";

interface CustomJwtPayload {
    iat: number,
    exp: number,
    data: {
        userId: number
    }
}

interface ResponseToken {
    type: string,
    token: string,
    refreshToken: string,
    expiresAt: string,
}

export default class Auth {

    public static async generate(userId: string): Promise<ResponseToken> {
        const appKey = FormatEnv.parseAppKey()
        const token = jwt.sign({ userId: userId }, appKey, { expiresIn: '1d' });

        const refreshToken = uuidv4()
        const refreshTokenHash = this.generateHash(refreshToken)

        const decode = jwt.decode(token) as JwtPayload
        const payload: CustomJwtPayload = { exp: decode.exp, iat: decode.iat, data: { userId: decode.userId } }
        const { iat, exp, data }: CustomJwtPayload = payload

        return {
            type: "Bearer",
            token: token,
            refreshToken: refreshTokenHash,
            expiresAt: FormatEnv.strToDateTime(exp)
        }
    }

    public static generateHash(token: string): string {
        const hash = createHash('sha256').update(token).digest('hex')
        return hash
    }

    public static async authenticate(req: Request): Promise<User> {
        if (!req.user.id) throw new ApiError("Data user tidak ditemukan", 401, "Authorization")
        const findUser = await User.findOne({ where: { id: req.user.id } })
        if (!findUser) throw new ApiError("Data user tidak ditemukan", 401, "Authorization")
        return findUser
    }


    public static bearerToken(req: Request): string {
        const authHeader = req.headers["authorization"];
        if (!authHeader.startsWith('Bearer ')) throw new Error("Data token tidak sesuai dengan server");

        const token = authHeader && authHeader.split(" ")[1];
        if (!token) throw new Error("Data token tidak valid");

        return token
    }

    public static verifyToken(token: string): CustomJwtPayload {

        try {
            const appKey = FormatEnv.parseAppKey()
            const verify: JwtPayload | string = jwt.verify(token, appKey)
            const jwta = verify as JwtPayload
            const payload = { exp: jwta.exp, iat: jwta.iat, data: { userId: jwta.userId } }
            const { iat, exp, data }: CustomJwtPayload = payload
            return payload
        } catch (error) {
            throw error
        }
    }
}