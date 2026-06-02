"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useHistory, useHistoryClear } from "@/hooks/useHistory";
import { Check, Copy, Trash2, Clock } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

function copyInline(setFlag: (v: boolean) => void) {
  setFlag(true);
  setTimeout(() => setFlag(false), 2000);
}

export function HistoryList() {
  const items = useHistory();
  const clear = useHistoryClear();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <Card>
        <h2 className="text-lg font-semibold mb-1">Histórico</h2>
        <p className="text-sm text-muted">
          Os últimos 5 textos que você gerar aparecem aqui (somente nesta sessão).
        </p>
      </Card>
    );
  }

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      copyInline((v) => {
        if (!v) setCopiedId(null);
      });
    } catch {
      // silent fail
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Histórico</h2>
          <p className="text-xs text-muted">
            Últimos {items.length} de 5 — em memória, perdido ao recarregar.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={clear} aria-label="Limpar histórico">
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">Limpar</span>
        </Button>
      </div>

      <ul className="flex flex-col gap-3">
        {items.map((item) => {
          const isExpanded = expanded === item.id;
          const preview = item.text.length > 160 && !isExpanded
            ? item.text.slice(0, 160).trimEnd() + "…"
            : item.text;
          return (
            <li
              key={item.id}
              className="rounded-lg border border-border bg-background/40 p-3"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="inline-flex items-center rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-medium text-accent shrink-0">
                    {item.typeLabel}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-muted">
                    <Clock className="h-3 w-3" />
                    {formatRelativeTime(item.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(item.id, item.text)}
                    aria-label="Copiar item do histórico"
                  >
                    {copiedId === item.id ? (
                      <Check className="h-3.5 w-3.5 text-accent" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  {item.text.length > 160 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpanded(isExpanded ? null : item.id)}
                    >
                      {isExpanded ? "Recolher" : "Ver completo"}
                    </Button>
                  )}
                </div>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">
                {preview}
              </p>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
