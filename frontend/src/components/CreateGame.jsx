import { createGameInfo } from "../libs/api";
import { setPlayerInformations } from "../libs/helper";

const CreateGame = ({ setPlayer }) => {
  const createNewGame = async (symbol) => {
    const { data: gameInfo } = await createGameInfo(symbol);
    if (gameInfo) {
      const playerInfo = { symbol, id: "player 1" };
      setPlayerInformations(playerInfo, { gameId: gameInfo.id, inPlay: false });
      setPlayer(playerInfo);
    }
  };

  return (
    <div>
      <div>
        <h4>Select your <b>Symbol</b></h4>
      </div>
      <button onClick={() => createNewGame("X")}>X</button>
      <button onClick={() => createNewGame("O")}>O</button>
    </div>
  );
};

export default CreateGame;
