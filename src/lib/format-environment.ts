import dotenv from "dotenv";
import { Jwt, Secret } from "jsonwebtoken";
import path from "path";

dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

export default class FormatEnv {

  public static parseAppKey(): Secret {
    const appKey = process.env.APP_KEY;

    if (!appKey.startsWith('base64:')) throw Error('Invalid app key, must be start with base64:')
    const key = appKey.substring(7);
    return key;
  }

  public static strToDateTime(date: number): string {
    return new Date(date * 1000).toString();
  }
}