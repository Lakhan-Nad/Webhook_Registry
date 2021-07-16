import express from "express";

import { trigger as TriggerController } from "../controllers/webhook";

const route = express.Router();

route.get("/", TriggerController);

export default route;
