import { Request, Response, NextFunction } from "express";

import validator from "validator";
import { BadRequestError } from "../errors";

export function registerHandle(
  req: Request,
  res: Response,
  next: NextFunction
) {
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

export function updateWebhook(req: Request, res: Response, next: NextFunction) {
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

export function deleteWebhook(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
}

export function listWebhooks(req: Request, res: Response, next: NextFunction) {}

export function trigger(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip;
}
