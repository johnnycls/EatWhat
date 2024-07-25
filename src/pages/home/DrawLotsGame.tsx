import { Button } from "primereact/button";
import React, { useState } from "react";

const TIME_FOR_DRAWING_ONCE = 100;
const TOTAL_DRAWING_TIME = 3000;

type Lot = {
  name: string;
  weight: number;
  isActive: boolean;
};

const weightedRandomDraw = (lots: Lot[]): string => {
  const totalWeight = lots.reduce((sum, lot) => sum + lot.weight, 0);
  let randomNum = Math.random() * totalWeight;

  for (const lot of lots) {
    if (randomNum < lot.weight) {
      return lot.name;
    }
    randomNum -= lot.weight;
  }

  return lots[lots.length - 1].name;
};

const DrawLotsGame: React.FC<{
  lots: Lot[];
  drawLabel?: string;
  drawingLabel?: string;
  winnerLabel?: string;
}> = ({
  lots,
  drawLabel = "食乜",
  drawingLabel = "諗緊",
  winnerLabel = "今日食",
}) => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentName, setCurrentName] = useState<string>("");
  const [winner, setWinner] = useState<string>("");

  const startDrawing = (): void => {
    setIsDrawing(true);
    setWinner("");
    const drawInterval = setInterval(() => {
      setCurrentName(weightedRandomDraw(lots));
    }, TIME_FOR_DRAWING_ONCE);

    setTimeout(() => {
      clearInterval(drawInterval);
      const finalWinner = weightedRandomDraw(lots);
      setCurrentName(finalWinner);
      setWinner(finalWinner);
      setIsDrawing(false);
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
