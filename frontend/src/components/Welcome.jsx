import { useState } from "react";
import BotGame from "./BotGame";
import CreateGame from "./CreateGame";
import JoinGame from "./JoinGame";

const WelcomeScreen = ({ setPlayer }) => {
  const [botGame, setBotGame] = useState(false);
  const [createGame, setCreateGame] = useState(false);
  const [joinGame, setJoinGame] = useState(false);

  return (
    <div>
      <h1>Side Stacker Game</h1>
      {botGame && <BotGame setPlayer={setPlayer} />}
      {createGame && <CreateGame setPlayer={setPlayer} />}
      {joinGame && <JoinGame setPlayer={setPlayer} />}
      {!botGame && !createGame && !joinGame && (
        <div>
          <button onClick={() => setBotGame(true)}>Create game</button>
          <button onClick={() => setCreateGame(true)}>Create game</button>
          <button onClick={() => setJoinGame(true)}>Join game</button>
        </div>
      )}
    </div>
  );
};

export default WelcomeScreen;
