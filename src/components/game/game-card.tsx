import { Edit } from "lucide-react";

interface GameCardProps {
  id: string;
  content: string;
  isPrompt: boolean;
  isSelected: boolean;
  isBlank: boolean;
  onClick: (id: string) => void;
}

import React, { HTMLAttributes } from "react";

interface ExtendedDivProps extends HTMLAttributes<HTMLDivElement> {
  xmlns?: string;
}

const ExtendedDiv: React.FC<ExtendedDivProps> = (props) => <div {...props} />;

const GameCard: React.FC<GameCardProps> = ({
  id,
  content,
  isPrompt,
  isSelected,
  isBlank,
  onClick,
}) => (
  <div
    className={`relative w-48 h-64 rounded-lg shadow-lg cursor-pointer transition-transform transform hover:scale-105 ${
      isSelected ? "ring-4 ring-blue-500" : ""
    }`}
    onClick={() => onClick(id)}
  >
    <svg className="absolute inset-0" viewBox="0 0 192 256">
      <rect
        width="192"
        height="256"
        rx="16"
        fill={isPrompt ? "#1a1a1a" : "#ffffff"}
      />
      <foreignObject x="16" y="16" width="160" height="224">
        <ExtendedDiv xmlns="http://www.w3.org/1999/xhtml">
          <p
            className={`font-bold text-lg ${
              isPrompt ? "text-white" : "text-black"
            }`}
          >
            Retros Against Humanity
          </p>
          {isBlank ? (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-2xl font-bold text-black">[BLANK]</p>
              <Edit className="mt-2" />
            </div>
          ) : (
            <p
              className={`mt-4 text-sm ${
                isPrompt ? "text-white" : "text-black"
              }`}
            >
              {content}
            </p>
          )}
        </ExtendedDiv>
      </foreignObject>
    </svg>
  </div>
);

export default GameCard;
