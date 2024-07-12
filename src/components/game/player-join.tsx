import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PlayerJoinProps {
  onJoin: (playerName: string) => void;
}

const PlayerJoin: React.FC<PlayerJoinProps> = ({ onJoin }) => {
  const [playerName, setPlayerName] = useState<string>("");

  const handleJoin = () => {
    if (playerName.trim()) {
      onJoin(playerName);
    }
  };

  return (
    <div className="mb-8 max-w-md mx-auto">
      <Input
        type="text"
        placeholder="Enter your name"
        value={playerName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPlayerName(e.target.value)
        }
        className="mb-4"
      />
      <Button onClick={handleJoin} className="w-full">
        Join Game
      </Button>
    </div>
  );
};

export default PlayerJoin;
