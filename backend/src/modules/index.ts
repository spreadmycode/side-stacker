import express from "express";

import { gameRouter } from "./game";

export const services = express.Router();

services.use("/game", gameRouter);
