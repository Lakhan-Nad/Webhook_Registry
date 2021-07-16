import * as DotEnv from "dotenv";
import { LogLevels } from "moleculer";

DotEnv.config();

export const NODE_ENV = process.env.NODE_ENV || "development";

export const PORT = Number.parseInt(process.env.PORT) || 3000;

export const MONGO_URI =
	process.env.MONGO_URI || "mongodb://localhost:27017/webhooks";

export const LOG_LEVEL: LogLevels =
	(process.env.LOG_LEVEL as LogLevels) || "debug";

export const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export const MONGO_WEBHOOK_COLLECTION =
	process.env.MONGO_WEBHOOK_COLLECTION || "webhooks";
