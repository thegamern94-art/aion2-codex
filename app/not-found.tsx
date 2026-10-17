import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
      <p className="font-mono text-6xl font-bold text-amber-400">404</p>
      <h1 className="mt-4 text-xl font-semibold text-zinc-100">This rift collapsed</h1>
      <p className="mt-2 text-sm text-zinc-500">
        The page you were looking for doesn’t exist — it may have been dragged into the Abyss.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-md border border-amber-500/50 bg-amber-500/10 px-4 py-2 text-sm text-amber-300 transition hover:bg-amber-500/20"
      >
        Return to the Codex
      </Link>
    </div>
  );
}
