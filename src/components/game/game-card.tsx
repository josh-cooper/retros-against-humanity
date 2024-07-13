import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface GameCardProps {
  id: string;
  content: string;
  isPrompt: boolean;
  isSelected: boolean;
  isBlank: boolean;
  onClick: (id: string) => void;
}

const GameCard: React.FC<GameCardProps> = ({
  id,
  content,
  isPrompt,
  isSelected,
  isBlank,
  onClick,
}) => {
  const [isNew, setIsNew] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsNew(false), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={isNew ? { scale: 0.8, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative w-48 h-64 rounded-lg shadow-lg cursor-pointer transition-transform transform hover:scale-105 ${
        isSelected ? "ring-4 ring-blue-500" : ""
      }`}
      onClick={() => onClick(id)}
    >
      <div
        className={`absolute inset-0 ${
          isPrompt
            ? "bg-black text-white"
            : "bg-gradient-to-br from-white to-gray-100 text-black"
        } rounded-lg flex flex-col justify-between p-4 overflow-hidden`}
      >
        <div className="flex-grow flex items-center justify-center">
          {isBlank ? (
            <span className="text-gray-400 font-semibold italic">
              Blank Card
            </span>
          ) : (
            <p
              className={`text-left ${
                isPrompt ? "text-lg" : "text-base"
              } font-bold leading-tight`}
            >
              {content}
            </p>
          )}
        </div>
        <div
          className={`text-xs font-bold ${
            isPrompt ? "text-white" : "text-gray-500"
          } mt-2`}
        >
          {"Retros Against Humanity"}
        </div>
      </div>
    </motion.div>
  );
};

export default GameCard;
