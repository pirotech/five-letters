import { Game } from '@/app/game';

export default function Home() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between"
      style={{ backgroundColor: '#fcfcfc', height: '100%' }}
    >
      <Game />
    </main>
  );
}
