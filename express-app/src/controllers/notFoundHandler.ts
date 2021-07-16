import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../errors";

export default (req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError(`${req.url} not found`));
};
