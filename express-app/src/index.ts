import http from "http";
import { IS_TEST_ENV, LOG_LEVEL, LOG_TYPE } from "./config";
import logger, { setLogLevel, setLogType } from "./logger";
import app from "./routes";
import { ServerExtension } from "./utils/server-enhance";

const server: ServerExtension = new ServerExtension(http.createServer(app));
const PROCESS_CONTEXT = "NODEJS_PROCESS";

process.on("uncaughtException", (err) => {
  logger.error(PROCESS_CONTEXT, "UncaughtException", err);
  stopProcess(true);
});

process.on("unhandledRejection", (err) => {
  logger.error(PROCESS_CONTEXT, "UnhandledRejection", err);
  stopProcess(true);
});

process.on("SIGINT", () => {
  logger.info(PROCESS_CONTEXT, "SIGINT");
  stopProcess(false);
});

process.on("SIGTERM", () => {
  logger.info(PROCESS_CONTEXT, "SIGTERM");
  stopProcess(false);
});

async function startProcess(): Promise<void> {
  setLogLevel(LOG_LEVEL);
  setLogType(LOG_TYPE);
  logger.info(PROCESS_CONTEXT, "Starting server...");
  await server.start();
}

let stopped: boolean = false;

if (!IS_TEST_ENV) {
  startProcess();
}

async function stopProcess(err: boolean = false) {
  if (stopped) {
    return;
  }
  stopped = true;
  logger.info(PROCESS_CONTEXT, "Stopping server...");
  await server.stop();
  process.exit(err ? 1 : 0);
}
