import "./App.css";
import GameBoard from "./components/GameBoard";

const App = () => {
  return (
    <div className="App">
      <header className="App-container">
        <GameBoard />
      </header>
    </div>
  );
};

export default App;
