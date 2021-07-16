import express, { NextFunction, Router, Request, Response } from "express";

const route = express.Router();

// verify the id the webhook
route.param("id", (_req: Request, _res: Response, next: NextFunction, id) => {
  next();
});

// list all webhook
route.get("/");

// add new webhook
route.post("/");

// update a webhook
route.put("/:id");

// delete webhook
route.delete("/:id");

export default route;
