import express from "express";

import * as controller from "./controller";

export const gameRouter = express.Router();

/** POST /api/game */
gameRouter.route("/").get(controller.getGame);
gameRouter.route("/").post(controller.createGame);
