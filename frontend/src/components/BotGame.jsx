import { getNextPlayer, setPlayerInformations } from "../libs/helper";

const BotGame = ({ setPlayer }) => {
  const createNewGame = async (symbol) => {
    const gameInfo = {
      id: "PLAY_WITH_BOT",
      boardInfo: [...Array(7)].map((x) => Array(7).fill("_")),
      winner: "",
      inPlay: true,
      player1: symbol,
      player2: getNextPlayer(symbol),
      nextPlayer: symbol,
    };
    const playerInfo = { symbol, id: "player 1" };
    setPlayerInformations(
      playerInfo,
      { gameId: gameInfo.id, inPlay: true },
      true
    );
    setPlayer(playerInfo);
  };

  return (
    <div>
      <div>
        <h4>
          Select your <b>Symbol</b>
        </h4>
      </div>
      <button onClick={() => createNewGame("X")}>X</button>
      <button onClick={() => createNewGame("O")}>O</button>
    </div>
  );
};

export default BotGame;
