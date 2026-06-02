import { Mail, AtSign, Package, UserCircle, Globe, Copy } from "lucide-react";
import type { ComponentType } from "react";

const FEATURES: Array<{
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}> = [
  {
    icon: Mail,
    title: "4 tipos de texto",
    description:
      "Email profissional, post de LinkedIn, descrição de produto e bio profissional — com campos otimizados para cada caso.",
  },
  {
    icon: Globe,
    title: "Português do Brasil natural",
    description:
      "Prompts calibrados para gerar PT-BR com tom, gramática e tamanho adequados ao contexto.",
  },
  {
    icon: Copy,
    title: "Copia e cola direto",
    description:
      "Resultado pronto em segundos, com um clique para copiar. Sem login, sem banco, sem fricção.",
  },
];

const TYPES: Array<{
  icon: ComponentType<{ className?: string }>;
  title: string;
  hint: string;
}> = [
  { icon: Mail, title: "Email profissional", hint: "destinatário · assunto · tom" },
  { icon: AtSign, title: "Post de LinkedIn", hint: "tema · objetivo · tom" },
  { icon: Package, title: "Descrição de produto", hint: "nome · público · diferenciais" },
  { icon: UserCircle, title: "Bio profissional", hint: "nome · cargo · experiência · tom" },
];

export function Features() {
  return (
    <section id="features" className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-24">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-base font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted leading-relaxed">
                {f.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight">
          Tipos de texto disponíveis
        </h2>
        <p className="mt-1 text-sm text-muted">
          Os campos aparecem dinamicamente conforme o tipo escolhido.
        </p>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TYPES.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.title}
                className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4"
              >
                <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-elevated text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium">{t.title}</div>
                  <div className="text-xs text-muted mt-0.5">{t.hint}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
