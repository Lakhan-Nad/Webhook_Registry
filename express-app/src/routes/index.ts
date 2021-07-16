import express from "express";
import NotFoundHandler from "../controllers/notFoundHandler";
import IPRouter from "./ip";
import MetricCollector from "../controllers/metricHandler";

const app = express();

// settings
app.disable("x-powered-by");
app.enable("case sensitive routing");
app.set("env", process.env.NODE_ENV || "development");

// route for metrics collection
app.use(MetricCollector);

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
