import Game from "../../../components/game/game";

export default function JoinGame({ params }: { params: { id: string } }) {
  return (
    <main className="bg-gray-100">
      <Game gameId={params.id} />
    </main>
  );
}
