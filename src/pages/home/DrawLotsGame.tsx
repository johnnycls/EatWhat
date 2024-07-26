import { Button } from "primereact/button";
import React, { useState } from "react";

const TIME_FOR_DRAWING_ONCE = 100;
const TOTAL_DRAWING_TIME = 3000;

type Lot = {
  name: string;
  weight: number;
};

const weightedRandomDraw = (lots: Lot[]): Lot => {
  const totalWeight = lots.reduce((sum, lot) => sum + lot.weight, 0);
  let randomNum = Math.random() * totalWeight;

  for (const lot of lots) {
    if (randomNum < lot.weight) {
      return lot;
    }
    randomNum -= lot.weight;
  }

  return lots[lots.length - 1];
};

const DrawLotsGame: React.FC<{
  lots: Lot[];
  drawLabel?: string;
  drawingLabel?: string;
  winnerLabel?: string;
  onWin?: (lot: Lot) => void;
}> = ({
  lots,
  drawLabel = "食乜好",
  drawingLabel = "諗緊",
  winnerLabel = "今日食",
  onWin = () => {},
}) => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentName, setCurrentName] = useState<string>("");
  const [winner, setWinner] = useState<string>("");

  const startDrawing = (): void => {
    setIsDrawing(true);
    setWinner("");
    const drawInterval = setInterval(() => {
      setCurrentName(weightedRandomDraw(lots).name);
    }, TIME_FOR_DRAWING_ONCE);

    setTimeout(() => {
      clearInterval(drawInterval);
      const finalWinner = weightedRandomDraw(lots);
      setCurrentName(finalWinner.name);
      setWinner(finalWinner.name);
      setIsDrawing(false);
      onWin(finalWinner);
    }, TOTAL_DRAWING_TIME);
  };

  return (
    <>
      <Button onClick={startDrawing} disabled={isDrawing}>
        {isDrawing ? drawingLabel : drawLabel}
      </Button>
      <div>
        {isDrawing && <div>{currentName}</div>}
        {winner && <div>{`${winnerLabel}${winner}!`}</div>}
      </div>
    </>
  );
};

export default DrawLotsGame;
