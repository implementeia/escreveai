"use client";

import { HistoryProvider } from "@/hooks/useHistory";
import { GeneratorForm } from "@/components/generator/GeneratorForm";
import { HistoryList } from "@/components/generator/HistoryList";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AppPage() {
  return (
    <HistoryProvider>
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
        <header className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para a home
          </Link>
          <div className="text-sm font-semibold tracking-tight">EscreveAi</div>
        </header>

        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Gerador de textos
          </h1>
          <p className="mt-2 text-muted max-w-2xl">
            Escolha o tipo, preencha o contexto e a IA escreve o texto pronto pra copiar.
          </p>
        </div>

        <GeneratorForm />
        <div className="mt-8">
          <HistoryList />
        </div>
      </div>
    </HistoryProvider>
  );
}
