export interface Game {
  id: string;
  boardInfo: Array<Array<string>>;
  winner: string;
  inPlay: boolean;
  player1: string;
  player2: string;
  nextPlayer: string;
}
