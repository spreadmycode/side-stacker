import { NextFunction, Request, Response } from "express";
import Queries from "../../libs/queries";
import { getNextPlayer } from "../../libs/utils";
import { Game } from "../../models/Game.model";

export const getGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { gameId } = req.query;

  const player = await Queries.get(<string>gameId);

  if (player) {
    return res.status(200).json({
      gameId: player.id,
      boardInfo: player.boardInfo,
      winner: player.winner,
      nextPlayer: player.nextPlayer,
      inPlay: player.inPlay,
      player1: player.player1,
      player2: player.player2,
    });
  }
};

export const createGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const boardInfo = [...Array(7)].map((x) => Array(7).fill("_"));
  const { symbol: player1 } = req.body;
  const player2 = getNextPlayer(player1);

  const game = await Queries.create({
    boardInfo,
    player1,
    player2,
    nextPlayer: player1,
  } as Game);

  if (game) {
    return res.status(201).json({
      data: game,
    });
  }
};
