import { Button } from "primereact/button";
import React, { useEffect, useRef, useState } from "react";

const TIME_FOR_DRAWING_ONCE = 100;
const TOTAL_DRAWING_TIME = 3000;

type Lot = {
  name: string;
  weight: number;
};

const createStarBurst = () => {
  const colors = ["#FFD700", "#FF6347", "#00CED1", "#FF69B4", "#32CD32"];
  const burstPoints = 10;
  const starsPerBurst = 20;

  for (let i = 0; i < burstPoints; i++) {
    const centerX = Math.random() * window.innerWidth;
    const centerY = Math.random() * window.innerHeight;

    for (let j = 0; j < starsPerBurst; j++) {
      const star = document.createElement("div");
      const color = colors[Math.floor(Math.random() * colors.length)];
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 250 + 100;

      star.style.cssText = `
        position: fixed;
        width: 6px;
        height: 6px;
        background-color: ${color};
        left: ${centerX}px;
        top: ${centerY}px;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        opacity: 1;
        z-index: 1000;
      `;
      document.body.appendChild(star);
      animateStar(star, angle, distance);
    }
  }
};

const animateStar = (star: HTMLDivElement, angle: number, distance: number) => {
  const duration = 2000;
  const startTime = performance.now();

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const easedProgress = easeOutCubic(progress);

    const currentDistance = easedProgress * distance;
    const x = Math.cos(angle) * currentDistance;
    const y = Math.sin(angle) * currentDistance;

    star.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${
      1 - easedProgress * 0.5
    })`;
    star.style.opacity = `${1 - easedProgress}`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      star.remove();
    }
  };

  requestAnimationFrame(animate);
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

      const starBurstInterval = setInterval(() => {
        createStarBurst();
      }, 500);

      setTimeout(() => {
        clearInterval(starBurstInterval);
      }, 1500);
    }, TOTAL_DRAWING_TIME);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
  }, []);

  return (
    <>
      <div className="absolute -z-10">
        <canvas ref={canvasRef} />
      </div>

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
