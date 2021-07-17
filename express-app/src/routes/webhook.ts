import { NextFunction, Router, Request, Response } from "express";
import * as WebHookControllers from "../controllers/webhook";
import validator from "validator";
import { BadRequestError } from "../errors";

const route = Router();

// verify the id the webhook
route.param("id", (_req: Request, _res: Response, next: NextFunction, id) => {
  // we know all ids are uuid v4 so we can catch
  // any other exception and send a bad request
  if (!validator.isUUID(id, 4)) {
    next(new BadRequestError("Invalid id"));
    return;
  }
  next();
});

// list all webhook
route.get("/", WebHookControllers.list);

// add new webhook
route.post("/", WebHookControllers.register);

// update a webhook
route.put("/:id", WebHookControllers.update);

// delete webhook
route.delete("/:id", WebHookControllers.remove);

export default route;
