import { useState, useEffect } from "react";
import WelcomeScreen from "./Welcome";
import socket from "../libs/socket";
import Box from "./Box";
import { getGameInfo } from "../libs/api";
import {
  getNextPlayer,
  playSymbolOnTheBoard,
  setPlayerInformations,
} from "../libs/helper";

const GameBoard = () => {
  const currentPlayer = JSON.parse(localStorage.getItem("playerInfo"));
  const gameId = localStorage.getItem("gameId");

  const [board, setBoard] = useState([[]]);
  const [player, setPlayer] = useState({});
  const [size] = useState(7);
  const [winCount] = useState(4);
  const [winner, setWinner] = useState("");
  const [nextPlayer, setNextPlayer] = useState("X");
  const [inPlay, setInPlay] = useState(false);
  const [isPlayingWithBot, setIsPlayingWithBot] = useState(false);

  const playAgain = () => {
    localStorage.clear();
    setPlayer({});
  };

  useEffect(() => {
    const grid = [...Array(size)].map((x) => Array(size).fill("_"));
    setBoard(grid);
  }, [size]);

  useEffect(() => {
    const getBoard = async () => {
      if (gameId) {
        if (gameId == "PLAY_WITH_BOT") {
          const player = currentPlayer;
          const gameInfo = {
            id: "PLAY_WITH_BOT",
            boardInfo: [...Array(7)].map((x) => Array(7).fill("_")),
            winner: "",
            inPlay: true,
            player1: player.symbol,
            player2: getNextPlayer(player.symbol),
            nextPlayer: player.symbol,
          };
          setBoard(gameInfo.boardInfo);
          setWinner(gameInfo.winner);
          setNextPlayer(gameInfo.nextPlayer);
          setInPlay(gameInfo.inPlay);
          setPlayerInformations(currentPlayer, { gameId, inPlay });
          setIsPlayingWithBot(true);
        } else {
          const gameInfo = await getGameInfo(gameId);
          if (gameInfo.boardInfo) {
            setBoard(gameInfo.boardInfo);
            setWinner(gameInfo.winner);
            setNextPlayer(gameInfo.nextPlayer);
            setInPlay(gameInfo.inPlay);
            setPlayerInformations(currentPlayer, { gameId, inPlay });
          }
        }
      }
    };

    getBoard();
    // eslint-disable-next-line
  }, [gameId]);

  const onClick = (row, col) => {
    if (
      board[row][col] === "_" &&
      nextPlayer === currentPlayer.symbol &&
      !winner &&
      inPlay
    ) {
      const { newBoard, isWin, botWin, nextToPlay } = playSymbolOnTheBoard(
        row,
        col,
        board,
        winCount,
        isPlayingWithBot
      );
      if (isWin) {
        setWinner(currentPlayer.symbol);
      }
      if (botWin) {
        setWinner(getNextPlayer(currentPlayer.symbol));
      }
      setBoard(newBoard);
      setNextPlayer(nextToPlay);
    }
  };

  useEffect(() => {
    socket.on("user_played", (data) => {
      const { boardInfo, symbol, isWin } = data;
      if (isWin) setWinner(symbol);

      const newBoard = [...boardInfo];
      setBoard(newBoard);
    });

    socket.on("next_to_play", (nextToPlay) => {
      setNextPlayer(nextToPlay);
    });

    socket.on("start_game", (inPlay) => {
      setInPlay(inPlay);
    });
  }, []);

  if (player?.id || currentPlayer?.id) {
    return (
      <div>
        <h5>Your Symbol is: {player.symbol || currentPlayer.symbol}</h5>
        <div className="wrapper">
          {board.map((item, row) =>
            item.map((data, col) => (
              <Box
                key={col}
                col={col}
                row={row}
                className={
                  nextPlayer !== currentPlayer.symbol || winner || !inPlay
                    ? "box box-not-allowed"
                    : "box"
                }
                data={data}
                onClick={() => onClick(row, col)}
              />
            ))
          )}
        </div>
        {!inPlay && currentPlayer.id === "player 1" && (
          <h6>
            Your gameId is: <br /> {gameId} <br />
            Send to you friend to play
          </h6>
        )}
        {winner && (
          <div>
            <h4>{`Game Over: Player ${winner} won`}</h4>
            <button onClick={playAgain}>Play Again</button>
          </div>
        )}
        {nextPlayer !== currentPlayer.symbol && !winner && (
          <h6>{`${nextPlayer} is playing...`}</h6>
        )}
      </div>
    );
  } else {
    return <WelcomeScreen setPlayer={setPlayer} />;
  }
};

export default GameBoard;
