import { Game } from "../models/Game.model";
import Repository from "./repository";

const Queries = {
  get: async (id: string) => {
    const game = await Repository.findByPk(id);
    if (game) return game;
    return null;
  },

  create: async (game: Game) => {
    const createdGame = await Repository.create(game);
    return createdGame;
  },

  update: async (game: Game) => {
    const updatedGame = await Repository.update(game);
    return updatedGame;
  },
};

export default Queries;
