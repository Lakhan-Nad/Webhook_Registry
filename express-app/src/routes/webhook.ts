import { NextFunction, Router, Request, Response } from "express";
import * as WebHookControllers from "../controllers/webhook";

const route = Router();

// verify the id the webhook
route.param("id", (_req: Request, _res: Response, next: NextFunction, id) => {
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
