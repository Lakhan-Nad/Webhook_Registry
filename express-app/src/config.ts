// @ts-ignore
import { config } from "dotenv";

config();

export const PORT: number = Number.parseInt(process.env.PORT || "5000");

export const HOST: string = process.env.HOST || "localhost";

export const NODE_ENV: string = process.env.NODE_ENV || "development";

export const IS_TEST_ENV: boolean = NODE_ENV === "test";

export const LOG_LEVEL: string = process.env.LOG_LEVEL || "info";

export const LOG_TYPE: string = process.env.LOG_TYPE || "simple";

export const WEBHOOK_API_BASE =
  process.env.WEBHOOK_API_BASE || "http://localhost:3000/webhook";
