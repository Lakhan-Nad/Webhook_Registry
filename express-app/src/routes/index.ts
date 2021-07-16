import express from "express";
import NotFoundHandler from "../controllers/notFoundHandler";
import IPRouter from "./ip";

const app = express();

// settings
app.disable("x-powered-by");
app.set("env", process.env.NODE_ENV || "development");

// middleware
app.use(express.json());

// routers
app.use("/ip", IPRouter);
app.use("/webhook");

// 404 error
app.use(NotFoundHandler);

// global error handler
app.use();

export default app;
