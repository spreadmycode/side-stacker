import "dotenv/config";
import http from "http";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { services } from "./modules";
import socket from "./libs/socket";

const app = express();
const server = http.createServer(app);

// Middlewares
app.use(express.json());
app.use(cors());

// Mount REST on /api
app.use("/api", services);
app.get("/", async (req: Request, res: Response, next: NextFunction) => {
  res.send("Hi there!");
});

socket(server);

server.listen(8000, () => console.log(`App listening on localhost:8000`));
