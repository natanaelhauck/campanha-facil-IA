import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">
        <p>Campanha Fácil IA · Plano inicial orientativo.</p>
        <nav aria-label="Links legais" className="flex items-center gap-4">
          <Link
            href="/privacidade"
            className="transition hover:text-stone-950"
          >
            Privacidade
          </Link>
          <Link href="/termos" className="transition hover:text-stone-950">
            Termos
          </Link>
        </nav>
      </div>
    </footer>
  );
}
