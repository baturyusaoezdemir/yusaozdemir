"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function SnakeGame({ onExit }: { onExit: () => void }) {
  const [snake, setSnake] = useState([{ x: 5, y: 5 }]);
  const [food, setFood] = useState({ x: 8, y: 5 });
  const [dir, setDir] = useState("RIGHT");

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (["arrowup", "w"].includes(key)) setDir("UP");
      if (["arrowdown", "s"].includes(key)) setDir("DOWN");
      if (["arrowleft", "a"].includes(key)) setDir("LEFT");
      if (["arrowright", "d"].includes(key)) setDir("RIGHT");
      if (key === "q") onExit();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [onExit]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = { ...prev[0] };
        if (dir === "UP") head.y--;
        if (dir === "DOWN") head.y++;
        if (dir === "LEFT") head.x--;
        if (dir === "RIGHT") head.x++;

        const newSnake = [head, ...prev];
        if (head.x === food.x && head.y === food.y) {
          setFood({
            x: Math.floor(Math.random() * 10),
            y: Math.floor(Math.random() * 10),
          });
        } else {
          newSnake.pop();
        }

        if (head.x < 0 || head.x > 9 || head.y < 0 || head.y > 9) {
          onExit();
        }
        return newSnake;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [dir, food, onExit]);

  return (
    <div className="mt-2 grid grid-cols-10 gap-[1px] bg-green-500/20 p-1 rounded">
      {Array.from({ length: 10 * 10 }).map((_, i) => {
        const x = i % 10;
        const y = Math.floor(i / 10);
        const isSnake = snake.some((s) => s.x === x && s.y === y);
        const isFood = food.x === x && food.y === y;
        return (
          <div
            key={i}
            className={`w-4 h-4 ${
              isSnake
                ? "bg-green-400"
                : isFood
                ? "bg-red-500"
                : "bg-black"
            }`}
          />
        );
      })}
    </div>
  );
}

export default function TerminalEasterEgg({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [lines, setLines] = useState<string[]>([
    "Willkommen im Yusa-Terminal! Tippe 'help' für Befehle.",
  ]);
  const [input, setInput] = useState("");
  const [snakeMode, setSnakeMode] = useState(false);

  const handleCommand = (cmd: string) => {
    let output = "";
    switch (cmd.trim().toLowerCase()) {
      case "help":
        output = "Verfügbare Befehle: about, hobbies, clear, exit";
        break;
      case "about":
        output = "Yusa Özdemir – DevOps Engineer. Leidenschaft für Cloud, Automatisierung und Architektur.";
        break;
      case "hobbies":
        output = " 🎮 Gaming, 💻 Coding, 🏋️ Gym, ☕ Kaffee, 🎌 Anime,";
        break;
      case "clear":
        setLines([]);
        return;
      case "snake":
        setSnakeMode(true);
        return;
      case "exit":
        onClose();
        return;
      default:
        output = `Befehl nicht gefunden: ${cmd}`;
    }
    setLines((prev) => [...prev, `> ${cmd}`, output]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleCommand(input);
    setInput("");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 w-96 max-w-full rounded-xl bg-black text-green-400 font-mono text-sm shadow-2xl border border-green-500/30 overflow-hidden z-50"
        >
          <div className="bg-green-500/10 px-4 py-2 flex justify-between items-center">
            <span className="font-semibold">Yusa Terminal</span>
            <button onClick={onClose} className="text-green-400 hover:text-green-200">×</button>
          </div>

          <div className="p-4 h-60 overflow-y-auto">
            {lines.map((line, i) => (
              <div key={i} className="whitespace-pre-wrap">{line}</div>
            ))}
          </div>
          {snakeMode && (
            <SnakeGame onExit={() => setSnakeMode(false)} />
          )}
          <form onSubmit={handleSubmit} className="flex border-t border-green-500/30">
            <span className="px-2 text-green-500">{">"}</span>
            <input
              className="flex-1 bg-transparent outline-none text-green-400 px-2 py-2"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
            />
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
