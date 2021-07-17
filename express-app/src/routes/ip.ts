import express from "express";

import { trigger as TriggerController } from "../controllers/webhook";

const route = express.Router();

route.post("/", TriggerController);

export default route;
