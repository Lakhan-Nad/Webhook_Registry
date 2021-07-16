import { Request, Response, NextFunction } from "express";

import validator from "validator";
import { BadRequestError } from "../errors";

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
}

export function remove(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
}

export function list(req: Request, res: Response, next: NextFunction) {}

export function trigger(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip;
}
