"use client";

import { useEffect, useState } from "react";

interface GameOverScreenProps {
  score: number;
  highScore: number;
  onRestart: () => void;
  onBackToMenu: () => void;
}

const GameOverScreen = ({ score, highScore, onRestart, onBackToMenu }: GameOverScreenProps) => {
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    setIsNewHighScore(score === highScore && score > 0);

    // Animate score counting
    let start = 0;
    const duration = 1000;
    const increment = score / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [score, highScore]);

  return (
    <div className="w-full h-full flex flex-col items-center bg-gradient-to-br from-red-900 via-purple-900 to-indigo-900 relative overflow-y-auto overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 right-20 w-40 h-40 bg-red-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-20 w-48 h-48 bg-purple-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/3 left-1/3 w-36 h-36 bg-pink-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-12 max-w-2xl w-full min-h-full">
        {/* Game Over Title */}
        <div className="mb-6 md:mb-8 text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 mb-2 animate-pulse-fast">
            GAME OVER
          </h1>
          {isNewHighScore && (
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 animate-bounce mt-4">
              🏆 NEW HIGH SCORE! 🏆
            </div>
          )}
        </div>

        {/* Score Display */}
        <div className="mb-6 md:mb-8 w-full max-w-md">
          <div className="bg-black/50 backdrop-blur-md px-6 md:px-8 py-5 md:py-6 rounded-2xl border-2 border-yellow-400 shadow-2xl mb-4">
            <div className="text-yellow-400 text-base md:text-lg font-bold mb-2 text-center">YOUR SCORE</div>
            <div className="text-white text-4xl sm:text-5xl md:text-6xl font-black text-center">{displayScore}</div>
          </div>

          {!isNewHighScore && highScore > 0 && (
            <div className="bg-black/30 backdrop-blur-sm px-5 md:px-6 py-3 md:py-4 rounded-xl border border-white/20 shadow-xl">
              <div className="text-white/70 text-xs md:text-sm font-bold mb-1 text-center">HIGH SCORE</div>
              <div className="text-white text-2xl md:text-3xl font-bold text-center">{highScore}</div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8 w-full max-w-md">
          <div className="bg-black/30 backdrop-blur-sm px-4 md:px-6 py-3 md:py-4 rounded-xl border border-cyan-400/30">
            <div className="text-cyan-400 text-xs font-bold mb-1">OBSTACLES</div>
            <div className="text-white text-xl md:text-2xl font-bold">{Math.floor(score / 10)}</div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm px-4 md:px-6 py-3 md:py-4 rounded-xl border border-yellow-400/30">
            <div className="text-yellow-400 text-xs font-bold mb-1">COINS</div>
            <div className="text-white text-xl md:text-2xl font-bold">{Math.floor((score % 10) === 0 ? 0 : score / 50)}</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-4 md:mb-6 w-full max-w-md">
          <button
            onClick={onRestart}
            className="group relative px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black text-lg md:text-xl rounded-full shadow-2xl hover:shadow-green-500/50 transform hover:scale-105 transition-all duration-200 w-full sm:w-auto"
          >
            <span className="relative z-10">PLAY AGAIN</span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>

          <button
            onClick={onBackToMenu}
            className="group relative px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black text-lg md:text-xl rounded-full shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-200 w-full sm:w-auto"
          >
            <span className="relative z-10">MAIN MENU</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>

        {/* Encouragement Message */}
        <div className="text-white/70 text-center text-xs sm:text-sm md:text-base max-w-md mb-6">
          {score < 100 && "Keep practicing! You'll get better!"}
          {score >= 100 && score < 500 && "Nice job! You're getting the hang of it!"}
          {score >= 500 && score < 1000 && "Great driving! Keep it up!"}
          {score >= 1000 && score < 2000 && "Impressive skills! You're a pro!"}
          {score >= 2000 && "LEGENDARY! You're unstoppable!"}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 pb-6 text-white/50 text-xs sm:text-sm text-center">
        Thanks for playing!
      </div>
    </div>
  );
};

export default GameOverScreen;
