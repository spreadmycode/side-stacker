import socket from "./socket";

export const setPlayerInformations = (
  playerInfo: any,
  gameInfo: any,
  isPlayingWithBot: boolean = false
) => {
  localStorage.setItem("playerInfo", JSON.stringify(playerInfo));
  localStorage.setItem("gameId", gameInfo.gameId);

  if (!isPlayingWithBot) {
    socket.emit("join_game", { gameInfo, playerInfo });
  }
};

export const checkWinner = (
  board: Array<Array<string>>,
  symbol: string,
  winCount: number
) => {
  for (let row = 0; row < board.length; row++) {
    let rowCount = 0;
    let colCount = 0;

    for (let col = 0; col < board.length; col++) {
      //Check user row
      if (board[row][col] === symbol) {
        rowCount++;
      } else {
        rowCount = 0;
      }

      //Check user col
      if (board[col][row] === symbol) {
        colCount++;
      } else {
        colCount = 0;
      }

      if (rowCount === winCount || colCount === winCount) {
        return true;
      }
    }
  }
  return false;
};

export const playSymbolOnTheBoard = (
  row: number,
  col: number,
  board: Array<Array<string>>,
  winCount: number,
  isPlayingWithBot: boolean = false
) => {
  const currentPlayer = JSON.parse(localStorage.getItem("playerInfo")!);
  const gameId = localStorage.getItem("gameId");
  const newBoard = [...board];
  newBoard[row][col] = currentPlayer.symbol;
  let isWin = false;
  let botWin = false;
  let nextToPlay = "";

  if (isPlayingWithBot) {
    isWin = checkWinner(newBoard, currentPlayer.symbol, winCount);

    let row = 0;
    let col = 0;
    do {
      row = Math.floor(Math.random() * 7);
      col = Math.floor(Math.random() * 7);
      if (newBoard[row][col] === "_") {
        newBoard[row][col] = getNextPlayer(currentPlayer.symbol);
        botWin = checkWinner(
          newBoard,
          getNextPlayer(currentPlayer.symbol),
          winCount
        );
        break;
      }
    } while (1);

    nextToPlay = currentPlayer.symbol;
  } else {
    isWin = checkWinner(newBoard, currentPlayer.symbol, winCount);

    socket.emit("user_turn", {
      boardInfo: newBoard,
      symbol: currentPlayer.symbol,
      isWin,
      gameId,
    });

    if (currentPlayer.symbol === "X") {
      nextToPlay = "O";
    } else {
      nextToPlay = "X";
    }
  }

  return { newBoard, isWin, botWin, nextToPlay };
};

export const getNextPlayer = (currentPlayer: string) => {
  let nextPlayer = "";
  if (currentPlayer === "X") {
    nextPlayer = "O";
  } else if (currentPlayer === "O") {
    nextPlayer = "X";
  }

  return nextPlayer;
};
