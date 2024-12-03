import { existsSync, mkdirSync } from "fs";
import { Logger } from "winston";
import winston from "winston";

const dir = "./logs";

if (!existsSync(dir)) {
  mkdirSync(dir);
}

const logger: Logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: `${dir}/combined.log` }),
  ],
});

export default logger;
