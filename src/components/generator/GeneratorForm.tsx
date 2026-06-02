"use client";

import { useState, useCallback } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileText, Loader2, Sparkles } from "lucide-react";
import { getTextTypeConfig } from "@/lib/textTypes";
import type {
  FormStatus,
  HistoryItem,
  TextTypeId,
  TextTypeConfig,
} from "@/types";
import { TypeSelect } from "./TypeSelect";
import { DynamicFields } from "./DynamicFields";
import { ResultCard } from "./ResultCard";
import { useHistoryDispatch } from "@/hooks/useHistory";

type Props = {
  initialType?: TextTypeId;
  historyAvailable?: boolean;
};

function buildEmptyValues(config: TextTypeConfig): Record<string, string> {
  return config.fields.reduce<Record<string, string>>((acc, f) => {
    acc[f.name] = "";
    return acc;
  }, {});
}

export function GeneratorForm({ initialType = "email" }: Props) {
  const [type, setType] = useState<TextTypeId>(initialType);
  const config = getTextTypeConfig(type) as TextTypeConfig;
  const [values, setValues] = useState<Record<string, string>>(() =>
    buildEmptyValues(config),
  );
  const [status, setStatus] = useState<FormStatus>("idle");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const pushHistory = useHistoryDispatch();

  const isReady = config.fields.every((f) => {
    if (!f.required) return true;
    return (values[f.name] ?? "").trim().length > 0;
  });

  const handleTypeChange = useCallback(
    (newType: TextTypeId) => {
      if (newType === type) return;
      const newConfig = getTextTypeConfig(newType);
      if (!newConfig) return;
      const hasContent = Object.values(values).some((v) => v.trim().length > 0);
      if (hasContent && result) {
        const ok = confirm(
          "Trocar de tipo vai limpar o formulário e o resultado atual. Continuar?",
        );
        if (!ok) return;
      }
      setType(newType);
      setValues(buildEmptyValues(newConfig));
      setResult("");
      setError("");
      setStatus("idle");
    },
    [type, values, result],
  );

  const handleFieldChange = useCallback((name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isReady || status === "loading") return;

    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, fields: values }),
      });
      const data = (await res.json()) as { text?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Erro ao gerar texto.");
        setStatus("error");
        return;
      }
      const text = data.text ?? "";
      setResult(text);
      setStatus("success");

      const item: HistoryItem = {
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type,
        typeLabel: config.label,
        fields: { ...values },
        text,
        createdAt: Date.now(),
      };
      pushHistory(item);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro de rede ao gerar texto.";
      setError(message);
      setStatus("error");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-1">1. Escolha o tipo</h2>
            <p className="text-sm text-muted mb-3">
              Cada tipo tem campos otimizados para o contexto certo.
            </p>
            <TypeSelect value={type} onChange={handleTypeChange} />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">2. Preencha o contexto</h2>
            <DynamicFields
              config={config}
              values={values}
              onChange={handleFieldChange}
            />
          </div>

          {status === "error" && error && (
            <div
              role="alert"
              className="rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger"
            >
              {error}
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!isReady}
            loading={status === "loading"}
          >
            {status === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Gerando seu texto…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Gerar texto
              </>
            )}
          </Button>
        </form>
      </Card>

      <div className="flex flex-col gap-4">
        {status === "loading" && (
          <Card className="animate-pulse-soft">
            <div className="flex items-center gap-2 text-sm text-muted">
              <FileText className="h-4 w-4" />
              Gerando resultado…
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-3 rounded bg-surface-elevated w-full" />
              <div className="h-3 rounded bg-surface-elevated w-11/12" />
              <div className="h-3 rounded bg-surface-elevated w-10/12" />
              <div className="h-3 rounded bg-surface-elevated w-9/12" />
            </div>
          </Card>
        )}

        {status === "success" && result && (
          <ResultCard
            typeId={type}
            typeLabel={config.label}
            text={result}
            onRegenerate={() => {
              const fakeEvent = { preventDefault: () => {} } as unknown as React.FormEvent<HTMLFormElement>;
              void handleSubmit(fakeEvent);
            }}
          />
        )}

        {status === "idle" && !result && (
          <Card className="border-dashed bg-transparent">
            <div className="flex flex-col items-center justify-center text-center py-10 text-muted">
              <Sparkles className="h-8 w-8 mb-3 text-accent/60" />
              <p className="text-sm">
                Preencha os campos e clique em <strong className="text-foreground">Gerar texto</strong>.
                <br />
                O resultado aparece aqui.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
