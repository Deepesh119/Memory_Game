import { useEffect, useState } from "react";
import "./App.css";

interface CardType {
  id: number;
  number: number;
}

const App = () => {
  const [gridSize, setGridSize] = useState<number>(2);
  const [totalAttempts, setTotalAttempts] = useState<number>(10);
  const [cards, setCards] = useState<CardType[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [won, setWon] = useState<boolean>(false);
  const [lost, setLost] = useState<boolean>(false);

  const handleChangeAttempts = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") return;
    const attemptsValue = Number(value);
    if (!isNaN(attemptsValue) && attemptsValue > 0) {
      setTotalAttempts(attemptsValue);
    }
  };

  const handleGridChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setGridSize(0);
      return;
    }

    const size = Number(value);
    if (!isNaN(size) && size >= 2 && size <= 7) {
      setGridSize(size);
    }
  };

  const initialGame = () => {
    const totalCards = gridSize * gridSize;
    const pairCounts = Math.floor(totalCards / 2);
    const numbers = Array.from({ length: pairCounts }, (_, n) => n + 1);

    const shuffledCards: CardType[] = [...numbers, ...numbers]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalCards)
      .map((number, idx) => ({
        id: idx,
        number,
      }));

    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    setWon(false);
    setLost(false);
    setTotalAttempts(10); 
  };

  const checkMatch = (firstId: number, secondId: number) => {
    const firstCard = cards[firstId];
    const secondCard = cards[secondId];
    if (!firstCard || !secondCard) return;

    if (firstCard.number === secondCard.number) {
      setSolved((prev) => [...prev, firstId, secondId]);
      setFlipped([]);
    } else {
      setTimeout(() => {
        setFlipped([]);
      }, 700);
    }
  };

  const handleClick = (newId: number) => {
    if (won || lost) return;
    if (flipped.includes(newId) || solved.includes(newId)) return;

    setTotalAttempts((prev) => Math.max(prev - 1, 0));

    if (flipped.length === 0) {
      setFlipped([newId]);
    } else if (flipped.length === 1) {
      const [firstId] = flipped;
      if (newId !== firstId) {
        setFlipped([firstId, newId]);
        checkMatch(firstId, newId);
      }
    }
  };

  const isFlipped = (id: number) => flipped.includes(id) || solved.includes(id);

  const handleReset = () => {
    initialGame();
  };

  useEffect(() => {
    if (cards.length > 0 && solved.length === cards.length) {
      setWon(true);
    }
  }, [solved, cards]);

  useEffect(() => {
    if (!won && totalAttempts <= 0) {
      setLost(true);
    }
  }, [totalAttempts, won]);

  useEffect(() => {
    initialGame();
  }, [gridSize]);

  return (
    <div className="wrapper">
      <div className="input_wrapper">
        <label>Grid Size</label>
        <input
          type="number"
          value={gridSize === 0 ? "" : gridSize}
          onChange={handleGridChange}
          className="input-focus"
          min={2}
          max={7}
        />

        <label>Total Attempts</label>
        <input
          type="number"
          value={totalAttempts}
          onChange={handleChangeAttempts}
          className="input-focus"
          min={1}
          disabled={lost}
        />
      </div>

      <div
        className="box-container"
        style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
      >
        {cards.map((data) => (
          <div
            key={data.id}
            className={isFlipped(data.id) ? "card-bg-fliped" : "boxes"}
            onClick={() => handleClick(data.id)}
          >
            {isFlipped(data.id) ? data.number : "X"}
          </div>
        ))}
      </div>

      {won && <div className="won_match">🎉 You have Won!</div>}
      {lost && <div className="won_match">😔 You Lost! Try Again</div>}

      <button className="btn-reset" onClick={handleReset}>
        {won || lost ? "Play Again" : "Reset"}
      </button>
    </div>
  );
};

export default App;
