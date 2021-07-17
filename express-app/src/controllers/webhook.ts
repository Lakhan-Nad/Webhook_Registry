import { Request, Response, NextFunction } from "express";

import validator from "validator";
import { WEBHOOK_API_BASE } from "../config";
import { BadRequestError } from "../errors";
import logger from "../logger";
import request from "../utils/request";

const WEBHOOK_CONTROLLER_CONTEXT = "WEBHOOK_CONTROLLER";

export function register(req: Request, res: Response, next: NextFunction) {
  const { targetURL } = req.body;
  if (
    !validator.isURL(targetURL, {
      protocols: ["http", "https"],
    })
  ) {
    next(new BadRequestError("Invalid URL Provided"));
    return;
  }
  logger.debug(WEBHOOK_CONTROLLER_CONTEXT, "register a new hook");
  request("post", WEBHOOK_API_BASE, {}, { targetURL }, res);
}

export function update(req: Request, res: Response, next: NextFunction) {
  const { targetURL } = req.body;
  const { id } = req.params;
  if (
    !validator.isURL(targetURL, {
      protocols: ["http", "https"],
    })
  ) {
    next(new BadRequestError("Invalid URL Provided"));
    return;
  }
  logger.debug(WEBHOOK_CONTROLLER_CONTEXT, `update hook ${id}`);
  request("put", `${WEBHOOK_API_BASE}/${id}`, {}, { targetURL }, res);
}

export function remove(req: Request, res: Response, _next: NextFunction) {
  const { id } = req.params;
  logger.debug(WEBHOOK_CONTROLLER_CONTEXT, `delete hook ${id}`);
  request("delete", `${WEBHOOK_API_BASE}/${id}`, {}, {}, res);
}

export function list(_req: Request, res: Response, _next: NextFunction) {
  logger.debug(WEBHOOK_CONTROLLER_CONTEXT, `list all hooks`);
  request("get", `${WEBHOOK_API_BASE}`, {}, {}, res);
}

export function trigger(req: Request, res: Response, _next: NextFunction) {
  const ip = req.ip;
  logger.debug(WEBHOOK_CONTROLLER_CONTEXT, `trigger hooks for ip: ${ip}`);
  request("post", `${WEBHOOK_API_BASE}/trigger`, {}, { ipAddress: ip }, res);
}
