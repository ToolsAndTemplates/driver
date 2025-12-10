"use client";

import { useEffect, useRef, useState } from "react";

interface GameCanvasProps {
  onGameOver: (score: number) => void;
}

interface Car {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  tilt: number;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  type: "car" | "cone";
}

interface Coin {
  x: number;
  y: number;
  radius: number;
  collected: boolean;
  rotation: number;
}

interface PowerUp {
  x: number;
  y: number;
  width: number;
  height: number;
  type: "shield" | "magnet" | "boost";
  collected: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

const GameCanvas = ({ onGameOver }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [shield, setShield] = useState(false);
  const [magnet, setMagnet] = useState(false);
  const [boost, setBoost] = useState(false);

  const gameStateRef = useRef({
    isRunning: true,
    isPaused: false,
    car: { x: 0, y: 0, width: 40, height: 70, speed: 8, tilt: 0 } as Car,
    obstacles: [] as Obstacle[],
    coins: [] as Coin[],
    powerUps: [] as PowerUp[],
    particles: [] as Particle[],
    keys: { left: false, right: false },
    roadOffset: 0,
    lastObstacleTime: 0,
    lastCoinTime: 0,
    lastPowerUpTime: 0,
    score: 0,
    distance: 0,
    baseSpeed: 3,
    touchStartX: 0,
    shield: { active: false, endTime: 0 },
    magnet: { active: false, endTime: 0 },
    boost: { active: false, endTime: 0 },
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = Math.min(window.innerWidth, 600);
      canvas.height = window.innerHeight;
      gameStateRef.current.car.x = canvas.width / 2 - gameStateRef.current.car.width / 2;
      gameStateRef.current.car.y = canvas.height - gameStateRef.current.car.height - 50;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") gameStateRef.current.keys.left = true;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") gameStateRef.current.keys.right = true;
      if (e.key === " " || e.key === "p" || e.key === "P") {
        e.preventDefault();
        gameStateRef.current.isPaused = !gameStateRef.current.isPaused;
        setIsPaused(gameStateRef.current.isPaused);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") gameStateRef.current.keys.left = false;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") gameStateRef.current.keys.right = false;
    };

    // Touch controls
    const handleTouchStart = (e: TouchEvent) => {
      gameStateRef.current.touchStartX = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touchX = e.touches[0].clientX;
      const diff = touchX - gameStateRef.current.touchStartX;

      if (diff > 10) {
        gameStateRef.current.keys.right = true;
        gameStateRef.current.keys.left = false;
      } else if (diff < -10) {
        gameStateRef.current.keys.left = true;
        gameStateRef.current.keys.right = false;
      } else {
        gameStateRef.current.keys.left = false;
        gameStateRef.current.keys.right = false;
      }

      gameStateRef.current.touchStartX = touchX;
    };

    const handleTouchEnd = () => {
      gameStateRef.current.keys.left = false;
      gameStateRef.current.keys.right = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd);

    // Game loop
    let animationFrameId: number;

    const drawRoad = () => {
      const roadWidth = canvas.width * 0.7;
      const roadX = (canvas.width - roadWidth) / 2;

      // Road background with gradient
      const gradient = ctx.createLinearGradient(roadX, 0, roadX + roadWidth, 0);
      gradient.addColorStop(0, "#2c2c2c");
      gradient.addColorStop(0.5, "#353535");
      gradient.addColorStop(1, "#2c2c2c");
      ctx.fillStyle = gradient;
      ctx.fillRect(roadX, 0, roadWidth, canvas.height);

      // Road edges with white lines
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(roadX, 0, 5, canvas.height);
      ctx.fillRect(roadX + roadWidth - 5, 0, 5, canvas.height);

      // Lane markings with glow effect
      ctx.shadowBlur = 5;
      ctx.shadowColor = "#ffeb3b";
      ctx.fillStyle = "#ffeb3b";
      const laneWidth = 8;
      const laneHeight = 40;
      const laneGap = 30;
      const offset = gameStateRef.current.roadOffset;

      for (let i = -1; i < canvas.height / (laneHeight + laneGap) + 1; i++) {
        const y = i * (laneHeight + laneGap) + offset;
        ctx.fillRect(roadX + roadWidth / 2 - laneWidth / 2, y, laneWidth, laneHeight);
      }
      ctx.shadowBlur = 0;

      // Grass sides with texture
      const grassGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grassGradient.addColorStop(0, "#2e7d32");
      grassGradient.addColorStop(1, "#1b5e20");
      ctx.fillStyle = grassGradient;
      ctx.fillRect(0, 0, roadX, canvas.height);
      ctx.fillRect(roadX + roadWidth, 0, canvas.width - roadX - roadWidth, canvas.height);
    };

    const drawCar = (car: Car, hasShield: boolean) => {
      ctx.save();
      ctx.translate(car.x + car.width / 2, car.y + car.height / 2);
      ctx.rotate(car.tilt);
      ctx.translate(-(car.x + car.width / 2), -(car.y + car.height / 2));

      // Shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillRect(car.x + 2, car.y + car.height + 2, car.width - 4, 6);

      // Shield effect
      if (hasShield) {
        ctx.strokeStyle = "#00e5ff";
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#00e5ff";
        ctx.beginPath();
        ctx.arc(car.x + car.width / 2, car.y + car.height / 2, car.width, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Car body with gradient
      const carGradient = ctx.createLinearGradient(car.x, car.y, car.x, car.y + car.height);
      carGradient.addColorStop(0, "#ff1744");
      carGradient.addColorStop(1, "#c51162");
      ctx.fillStyle = carGradient;
      ctx.fillRect(car.x, car.y, car.width, car.height);

      // Car top (windshield area)
      ctx.fillStyle = "#c51162";
      ctx.fillRect(car.x + 5, car.y + 5, car.width - 10, 20);

      // Windshield with reflection
      const windshieldGradient = ctx.createLinearGradient(car.x + 8, car.y + 8, car.x + 8, car.y + 22);
      windshieldGradient.addColorStop(0, "#b3e5fc");
      windshieldGradient.addColorStop(1, "#64b5f6");
      ctx.fillStyle = windshieldGradient;
      ctx.fillRect(car.x + 8, car.y + 8, car.width - 16, 14);

      // Wheels with highlights
      ctx.fillStyle = "#212121";
      ctx.fillRect(car.x - 3, car.y + 10, 6, 15);
      ctx.fillRect(car.x + car.width - 3, car.y + 10, 6, 15);
      ctx.fillRect(car.x - 3, car.y + car.height - 25, 6, 15);
      ctx.fillRect(car.x + car.width - 3, car.y + car.height - 25, 6, 15);

      // Wheel highlights
      ctx.fillStyle = "#424242";
      ctx.fillRect(car.x - 2, car.y + 11, 2, 6);
      ctx.fillRect(car.x + car.width - 2, car.y + 11, 2, 6);

      // Headlights with glow
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#ffeb3b";
      ctx.fillStyle = "#ffeb3b";
      ctx.fillRect(car.x + 5, car.y + car.height - 5, 10, 3);
      ctx.fillRect(car.x + car.width - 15, car.y + car.height - 5, 10, 3);
      ctx.shadowBlur = 0;

      ctx.restore();
    };

    const drawObstacle = (obstacle: Obstacle) => {
      if (obstacle.type === "car") {
        // Obstacle car with gradient
        const obstacleGradient = ctx.createLinearGradient(obstacle.x, obstacle.y, obstacle.x, obstacle.y + obstacle.height);
        obstacleGradient.addColorStop(0, "#1976d2");
        obstacleGradient.addColorStop(1, "#0d47a1");
        ctx.fillStyle = obstacleGradient;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        // Windshield
        ctx.fillStyle = "#64b5f6";
        ctx.fillRect(obstacle.x + 8, obstacle.y + obstacle.height - 22, obstacle.width - 16, 14);

        // Wheels
        ctx.fillStyle = "#212121";
        ctx.fillRect(obstacle.x - 3, obstacle.y + 10, 6, 12);
        ctx.fillRect(obstacle.x + obstacle.width - 3, obstacle.y + 10, 6, 12);
        ctx.fillRect(obstacle.x - 3, obstacle.y + obstacle.height - 22, 6, 12);
        ctx.fillRect(obstacle.x + obstacle.width - 3, obstacle.y + obstacle.height - 22, 6, 12);
      } else {
        // Traffic cone with 3D effect
        ctx.fillStyle = "#ff6f00";
        ctx.shadowBlur = 3;
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.beginPath();
        ctx.moveTo(obstacle.x + obstacle.width / 2, obstacle.y);
        ctx.lineTo(obstacle.x, obstacle.y + obstacle.height);
        ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;

        // Cone stripes
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(obstacle.x + 5, obstacle.y + obstacle.height * 0.3, obstacle.width - 10, 3);
        ctx.fillRect(obstacle.x + 5, obstacle.y + obstacle.height * 0.6, obstacle.width - 10, 3);
      }
    };

    const drawCoin = (coin: Coin) => {
      if (coin.collected) return;

      ctx.save();
      ctx.translate(coin.x, coin.y);
      ctx.rotate(coin.rotation);

      // Outer glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#ffd700";

      // Outer circle
      ctx.fillStyle = "#ffd700";
      ctx.beginPath();
      ctx.arc(0, 0, coin.radius, 0, Math.PI * 2);
      ctx.fill();

      // Inner circle
      ctx.fillStyle = "#ffed4e";
      ctx.beginPath();
      ctx.arc(0, 0, coin.radius - 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;

      // Dollar sign
      ctx.fillStyle = "#ffd700";
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("$", 0, 0);

      ctx.restore();
    };

    const drawPowerUp = (powerUp: PowerUp) => {
      if (powerUp.collected) return;

      ctx.save();
      ctx.translate(powerUp.x + powerUp.width / 2, powerUp.y + powerUp.height / 2);

      // Glow effect
      ctx.shadowBlur = 20;

      if (powerUp.type === "shield") {
        ctx.shadowColor = "#00e5ff";
        ctx.fillStyle = "#00e5ff";
        ctx.strokeStyle = "#00bcd4";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, powerUp.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("🛡", 0, 0);
      } else if (powerUp.type === "magnet") {
        ctx.shadowColor = "#ff4081";
        ctx.fillStyle = "#ff4081";
        ctx.strokeStyle = "#f50057";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, powerUp.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("🧲", 0, 0);
      } else if (powerUp.type === "boost") {
        ctx.shadowColor = "#76ff03";
        ctx.fillStyle = "#76ff03";
        ctx.strokeStyle = "#64dd17";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, powerUp.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("⚡", 0, 0);
      }

      ctx.shadowBlur = 0;
      ctx.restore();
    };

    const drawParticle = (particle: Particle) => {
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.life;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    const createParticles = (x: number, y: number, color: string, count: number = 10) => {
      for (let i = 0; i < count; i++) {
        gameStateRef.current.particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          life: 1,
          color,
          size: Math.random() * 4 + 2,
        });
      }
    };

    const checkCollision = (rect1: any, rect2: any) => {
      return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
      );
    };

    const checkCoinCollision = (car: Car, coin: Coin) => {
      if (coin.collected) return false;
      const carCenterX = car.x + car.width / 2;
      const carCenterY = car.y + car.height / 2;
      const distance = Math.sqrt(
        Math.pow(carCenterX - coin.x, 2) + Math.pow(carCenterY - coin.y, 2)
      );
      return distance < coin.radius + 20;
    };

    const gameLoop = () => {
      if (!gameStateRef.current.isRunning) return;
      if (gameStateRef.current.isPaused) {
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }

      const currentTime = Date.now();

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw road
      drawRoad();

      // Update road offset
      const currentSpeed = gameStateRef.current.boost.active
        ? gameStateRef.current.baseSpeed * 1.5
        : gameStateRef.current.baseSpeed;
      gameStateRef.current.roadOffset += currentSpeed * 2;
      if (gameStateRef.current.roadOffset > 70) {
        gameStateRef.current.roadOffset = 0;
      }

      // Update car position
      const car = gameStateRef.current.car;
      const roadWidth = canvas.width * 0.7;
      const roadX = (canvas.width - roadWidth) / 2;

      if (gameStateRef.current.keys.left) {
        car.x -= car.speed;
        car.tilt = -0.1;
      } else if (gameStateRef.current.keys.right) {
        car.x += car.speed;
        car.tilt = 0.1;
      } else {
        car.tilt *= 0.9;
      }

      // Keep car on road
      car.x = Math.max(roadX + 5, Math.min(car.x, roadX + roadWidth - car.width - 5));

      // Update power-ups
      if (gameStateRef.current.shield.active && currentTime > gameStateRef.current.shield.endTime) {
        gameStateRef.current.shield.active = false;
        setShield(false);
      }
      if (gameStateRef.current.magnet.active && currentTime > gameStateRef.current.magnet.endTime) {
        gameStateRef.current.magnet.active = false;
        setMagnet(false);
      }
      if (gameStateRef.current.boost.active && currentTime > gameStateRef.current.boost.endTime) {
        gameStateRef.current.boost.active = false;
        setBoost(false);
      }

      // Spawn obstacles
      if (currentTime - gameStateRef.current.lastObstacleTime > 1500) {
        const obstacleType = Math.random() > 0.3 ? "car" : "cone";
        const width = obstacleType === "car" ? 40 : 30;
        const height = obstacleType === "car" ? 60 : 40;
        const lanes = 3;
        const laneWidth = (roadWidth - 20) / lanes;
        const lane = Math.floor(Math.random() * lanes);

        gameStateRef.current.obstacles.push({
          x: roadX + 10 + lane * laneWidth + (laneWidth - width) / 2,
          y: -height,
          width,
          height,
          speed: currentSpeed + Math.random() * 2,
          type: obstacleType,
        });
        gameStateRef.current.lastObstacleTime = currentTime;
      }

      // Spawn coins
      if (currentTime - gameStateRef.current.lastCoinTime > 2000) {
        const lanes = 3;
        const laneWidth = (roadWidth - 20) / lanes;
        const lane = Math.floor(Math.random() * lanes);

        gameStateRef.current.coins.push({
          x: roadX + 10 + lane * laneWidth + laneWidth / 2,
          y: -20,
          radius: 15,
          collected: false,
          rotation: 0,
        });
        gameStateRef.current.lastCoinTime = currentTime;
      }

      // Spawn power-ups
      if (currentTime - gameStateRef.current.lastPowerUpTime > 15000) {
        const powerUpTypes: ("shield" | "magnet" | "boost")[] = ["shield", "magnet", "boost"];
        const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        const lanes = 3;
        const laneWidth = (roadWidth - 20) / lanes;
        const lane = Math.floor(Math.random() * lanes);

        gameStateRef.current.powerUps.push({
          x: roadX + 10 + lane * laneWidth + laneWidth / 2 - 15,
          y: -30,
          width: 30,
          height: 30,
          type,
          collected: false,
        });
        gameStateRef.current.lastPowerUpTime = currentTime;
      }

      // Update and draw obstacles
      gameStateRef.current.obstacles = gameStateRef.current.obstacles.filter((obstacle) => {
        obstacle.y += obstacle.speed;

        // Check collision
        if (checkCollision(car, obstacle)) {
          if (gameStateRef.current.shield.active) {
            // Shield protects - create particles and remove obstacle
            createParticles(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2, "#00e5ff", 15);
            gameStateRef.current.shield.active = false;
            setShield(false);
            return false;
          } else {
            gameStateRef.current.isRunning = false;
            createParticles(car.x + car.width / 2, car.y + car.height / 2, "#ff1744", 30);
            onGameOver(gameStateRef.current.score);
            return false;
          }
        }

        if (obstacle.y < canvas.height) {
          drawObstacle(obstacle);
          return true;
        }

        // Obstacle passed, increase score
        gameStateRef.current.score += 10;
        gameStateRef.current.distance += 1;
        return false;
      });

      // Update and draw coins
      gameStateRef.current.coins = gameStateRef.current.coins.filter((coin) => {
        coin.y += currentSpeed;
        coin.rotation += 0.05;

        // Magnet effect
        if (gameStateRef.current.magnet.active && !coin.collected) {
          const dx = car.x + car.width / 2 - coin.x;
          const dy = car.y + car.height / 2 - coin.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            coin.x += dx * 0.1;
            coin.y += dy * 0.1;
          }
        }

        // Check collection
        if (checkCoinCollision(car, coin)) {
          coin.collected = true;
          gameStateRef.current.score += 50;
          createParticles(coin.x, coin.y, "#ffd700", 12);
        }

        if (coin.y < canvas.height + 50 && !coin.collected) {
          drawCoin(coin);
          return true;
        }
        return false;
      });

      // Update and draw power-ups
      gameStateRef.current.powerUps = gameStateRef.current.powerUps.filter((powerUp) => {
        powerUp.y += currentSpeed;

        // Check collection
        if (!powerUp.collected && checkCollision(car, powerUp)) {
          powerUp.collected = true;
          createParticles(powerUp.x + powerUp.width / 2, powerUp.y + powerUp.height / 2,
            powerUp.type === "shield" ? "#00e5ff" : powerUp.type === "magnet" ? "#ff4081" : "#76ff03", 15);

          if (powerUp.type === "shield") {
            gameStateRef.current.shield = { active: true, endTime: currentTime + 10000 };
            setShield(true);
          } else if (powerUp.type === "magnet") {
            gameStateRef.current.magnet = { active: true, endTime: currentTime + 8000 };
            setMagnet(true);
          } else if (powerUp.type === "boost") {
            gameStateRef.current.boost = { active: true, endTime: currentTime + 5000 };
            setBoost(true);
          }
        }

        if (powerUp.y < canvas.height && !powerUp.collected) {
          drawPowerUp(powerUp);
          return true;
        }
        return false;
      });

      // Update and draw particles
      gameStateRef.current.particles = gameStateRef.current.particles.filter((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.2; // Gravity
        particle.life -= 0.02;

        if (particle.life > 0) {
          drawParticle(particle);
          return true;
        }
        return false;
      });

      // Draw car
      drawCar(car, gameStateRef.current.shield.active);

      // Update score display
      setScore(gameStateRef.current.score);
      setDistance(gameStateRef.current.distance);
      setSpeed(Math.round(currentSpeed * 10) / 10);

      // Increase difficulty over time
      if (gameStateRef.current.distance > 0 && gameStateRef.current.distance % 20 === 0) {
        gameStateRef.current.baseSpeed = Math.min(8, gameStateRef.current.baseSpeed + 0.05);
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, [onGameOver]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200">
      <canvas
        ref={canvasRef}
        className="border-4 border-gray-800 shadow-2xl"
      />

      {/* HUD */}
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-6 py-4 rounded-lg border-2 border-yellow-400 shadow-lg">
        <div className="text-yellow-400 font-bold text-lg">SCORE</div>
        <div className="text-white text-3xl font-bold">{score}</div>
      </div>

      <div className="absolute top-4 right-4 space-y-2">
        <div className="bg-black/70 backdrop-blur-sm px-6 py-4 rounded-lg border-2 border-green-400 shadow-lg">
          <div className="text-green-400 font-bold text-lg">DISTANCE</div>
          <div className="text-white text-3xl font-bold">{distance}m</div>
        </div>
        <div className="bg-black/70 backdrop-blur-sm px-6 py-4 rounded-lg border-2 border-purple-400 shadow-lg">
          <div className="text-purple-400 font-bold text-lg">SPEED</div>
          <div className="text-white text-3xl font-bold">{speed}x</div>
        </div>
      </div>

      {/* Power-ups indicator */}
      {(shield || magnet || boost) && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {shield && (
            <div className="bg-cyan-500/90 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-cyan-300 shadow-lg animate-pulse">
              <span className="text-white font-bold text-sm">🛡 SHIELD</span>
            </div>
          )}
          {magnet && (
            <div className="bg-pink-500/90 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-pink-300 shadow-lg animate-pulse">
              <span className="text-white font-bold text-sm">🧲 MAGNET</span>
            </div>
          )}
          {boost && (
            <div className="bg-lime-500/90 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-lime-300 shadow-lg animate-pulse">
              <span className="text-white font-bold text-sm">⚡ BOOST</span>
            </div>
          )}
        </div>
      )}

      {/* Pause overlay */}
      {isPaused && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <h2 className="text-6xl font-black text-white mb-4">PAUSED</h2>
            <p className="text-white text-xl">Press SPACE or P to resume</p>
          </div>
        </div>
      )}

      {/* Mobile controls hint */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <div className="inline-block bg-black/70 backdrop-blur-sm px-6 py-3 rounded-full text-white text-sm">
          <span className="hidden md:inline">Arrow Keys/A/D to move • SPACE/P to pause</span>
          <span className="md:hidden">Touch and drag to move</span>
        </div>
      </div>
    </div>
  );
};

export default GameCanvas;
