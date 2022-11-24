import socket from "./socket";

export const setPlayerInformations = (playerInfo: any, gameInfo: any) => {
  localStorage.setItem("playerInfo", JSON.stringify(playerInfo));
  localStorage.setItem("gameId", gameInfo.gameId);

  socket.emit("join_game", { gameInfo, playerInfo });
};

export const checkWinner = (board: Array<Array<string>>, symbol: string, winCount: number) => {
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
};

export const playSymbolOnTheBoard = (row: number, col: number, board: Array<Array<string>>, winCount: number) => {
  const currentPlayer = JSON.parse(localStorage.getItem("playerInfo")!);
  const gameId = localStorage.getItem("gameId");
  const newBoard = [...board];
  newBoard[row][col] = currentPlayer.symbol;

  const isWin = checkWinner(newBoard, currentPlayer.symbol, winCount);

  socket.emit("user_turn", {
    boardInfo: newBoard,
    symbol: currentPlayer.symbol,
    isWin,
    gameId,
  });

  let nextToPlay = "";
  if (currentPlayer.symbol === "X") {
    nextToPlay = "O";
  } else {
    nextToPlay = "X";
  }

  return { newBoard, isWin, nextToPlay };
};
