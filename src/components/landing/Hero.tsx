import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-[-20%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-4xl px-4 pt-20 pb-16 text-center sm:pt-28 sm:pb-24">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs font-medium text-muted backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          Gerador de textos com IA · PT-BR
        </span>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl">
          Escreva qualquer texto em{" "}
          <span className="text-accent">segundos</span> com IA.
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base text-muted sm:text-lg">
          Emails profissionais, posts de LinkedIn, descrições de produto e bios.
          Escolha o tipo, preencha o contexto e copie o resultado pronto para usar.
        </p>

        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/app"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Começar grátis
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center rounded-lg border border-border bg-surface/60 px-6 py-3 text-sm font-medium text-foreground/90 transition-colors hover:bg-surface"
          >
            Ver tipos de texto
          </a>
        </div>

        <p className="mt-6 text-xs text-muted">
          Sem cadastro. Sua chave da OpenAI fica no servidor.
        </p>
      </div>
    </section>
  );
}
