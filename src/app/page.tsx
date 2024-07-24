import { Button } from "@/components/ui/button";
import StartNewGameButton from "@/components/start-game-button";

export default function NewGame() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-6 text-gray-800">
          Retros Against Humanity
        </h1>
        <p className="text-xl mb-8 text-gray-600">
          Unconventional retros for modern teams
        </p>
        <StartNewGameButton />
      </div>
    </main>
  );
}
