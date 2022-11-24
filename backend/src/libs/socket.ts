import http from "http";
import { Server } from "socket.io";
import { EVENTS } from "../const";
import { Game } from "../models/Game.model";
import Queries from "./queries";
import { getNextPlayer } from "./utils";

const cors = {
  origin: "*",
  method: ["GET", "POST"],
};

const socket = (server: http.Server) => {
  const io = new Server(server, { cors });

  io.on("connection", (socket) => {
    socket.on(EVENTS.JOIN_GAME, async ({ gameInfo, playerInfo }) => {
      const { gameId, inPlay } = gameInfo;
      const player = await Queries.get(gameId);

      if (playerInfo.id) {
        socket.join(gameId);

        if (inPlay) {
          Queries.update({ id: player.id, inPlay } as Game);

          socket.to(gameId).emit(EVENTS.START_GAME, inPlay);
        }
      }
    });

    socket.on(EVENTS.USER_TURN, async (data) => {
      const { boardInfo, symbol, isWin, gameId } = data;

      const player = await Queries.get(gameId);

      if (player) {
        const winner = isWin ? symbol : "";
        let nextToPlay = getNextPlayer(symbol);
        Queries.update({
          id: player.id,
          boardInfo,
          winner,
          nextPlayer: nextToPlay,
        } as Game);

        socket
          .to(gameId)
          .emit(EVENTS.USER_PLAYED, { boardInfo, symbol, isWin });

        socket.to(gameId).emit(EVENTS.NEXT_TO_PLAY, nextToPlay);
      }
    });
  });
};

export default socket;
