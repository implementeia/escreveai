import Link from "next/link";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { CtaBanner } from "@/components/landing/CtaBanner";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <>
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <Sparkles className="h-4 w-4" />
          </span>
          EscreveAi
        </Link>
        <Link
          href="/app"
          className="inline-flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Abrir app
        </Link>
      </header>

      <main>
        <Hero />
        <Features />
        <CtaBanner />
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted sm:flex-row">
          <div>EscreveAi — gerador de textos com IA.</div>
          <div>
            Construído com Next.js, Tailwind e OpenAI.
          </div>
        </div>
      </footer>
    </>
  );
}
