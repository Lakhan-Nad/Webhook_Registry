import express from "express";
import NotFoundHandler from "../controllers/notFoundHandler";
import IPRouter from "./ip";
import WebhookRouter from "./webhook";
import MetricCollector from "../controllers/metricHandler";
import GlobalErrorHandler from "../controllers/globalErrorHandler";

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
app.use("/webhook", WebhookRouter);

// 404 error
app.use(NotFoundHandler);

// global error handler
app.use(GlobalErrorHandler);

export default app;
