import Link from "next/link";
import { Button } from "./Button";

export function Header() {
  return (
    <header className="border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="text-base font-bold text-stone-950">
          Campanha Facil IA
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/criar-campanha"
            className="hidden text-sm font-medium text-stone-700 hover:text-stone-950 sm:inline"
          >
            Criar campanha
          </Link>
          <Button href="/criar-campanha" className="px-4 py-2">
            Comecar
          </Button>
        </nav>
      </div>
    </header>
  );
}
