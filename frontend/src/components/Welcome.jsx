import { useState } from "react";
import CreateGame from "./CreateGame";
import JoinGame from "./JoinGame";

const WelcomeScreen = ({ setPlayer }) => {
  const [createGame, setCreateGame] = useState(false);
  const [joinGame, setJoinGame] = useState(false);

  return (
    <div>
      <h1>Side Stacker Game</h1>
      {createGame && <CreateGame setPlayer={setPlayer} />}
      {joinGame && <JoinGame setPlayer={setPlayer} />}
      {!createGame && !joinGame && (
        <div>
          <button onClick={() => setCreateGame(true)}>Create game</button>
          <button onClick={() => setJoinGame(true)}>Join game</button>
        </div>
      )}
    </div>
  );
};

export default WelcomeScreen;
