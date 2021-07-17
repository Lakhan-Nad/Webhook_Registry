import http from "http";
import { Response } from "express";

export default function request(
  method: string,
  url: string,
  headers: any,
  data: any,
  response: Response
) {
  const req = http.request(
    url,
    {
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      method,
    },
    (res) => {
      const writer = (chunk: any) => {
        response.write(chunk);
      };
      const endWriter = () => {
        response.end();
        res.off("data", writer);
        res.off("end", endWriter);
      };
      response.setHeader(
        "content-type",
        res.headers["content-type"] || "application/json"
      );
      response.status(res.statusCode || 200);
      res.on("data", writer);
      res.on("end", endWriter);
    }
  );
  method = String.prototype.toLowerCase.call(method);
  if (method === "post" || method === "put") {
    req.write(JSON.stringify(data));
  }
  req.end();
}
