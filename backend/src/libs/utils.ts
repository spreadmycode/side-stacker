export const getNextPlayer = (currentPlayer: string) => {
  let nextPlayer = "";
  if (currentPlayer === "X") {
    nextPlayer = "O";
  } else if (currentPlayer === "O") {
    nextPlayer = "X";
  }

  return nextPlayer;
};
