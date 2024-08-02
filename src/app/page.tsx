import { Button } from "@/components/ui/button";
import StartNewGameButton from "@/components/start-game-button";
import Link from "next/link";

export default function NewGame() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6 text-gray-800">
            Retros Against Humanity
          </h1>
          <p className="text-xl mb-8 text-gray-600">
            Unconventional retros for modern teams
          </p>
          <StartNewGameButton />
        </div>
      </div>
      <div className="mt-8 text-sm text-gray-500">
        Inspired by{" "}
        <Link
          href="https://www.boxuk.com/insight/retros-against-humanity/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Box UK&apos;s Retros Against Humanity
        </Link>
      </div>
    </main>
  );
}
