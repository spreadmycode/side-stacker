const baseUrl = process.env.REACT_APP_API_BASE_URL;

export const getGameInfo = async (gameId: string) => {
  const data = await fetch(`${baseUrl}/api/game?gameId=${gameId}`);
  return data.json();
};

export const createGameInfo = async (symbol: string) => {
  const data = { symbol };
  const response = await fetch(`${baseUrl}/api/game`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return response.json();
};
