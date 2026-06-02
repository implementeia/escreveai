"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Check, Copy, RefreshCw } from "lucide-react";
import type { TextTypeId } from "@/types";

type Props = {
  typeId: TextTypeId;
  typeLabel: string;
  text: string;
  onRegenerate: () => void;
};

export function ResultCard({ typeId, typeLabel, text, onRegenerate }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } finally {
        document.body.removeChild(ta);
      }
    }
  };

  return (
    <Card className="animate-fade-in">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="inline-flex items-center rounded-full bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent">
          {typeLabel}
        </span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onRegenerate}
            aria-label="Gerar novamente"
            title="Gerar novamente"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Gerar de novo</span>
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleCopy}
            aria-label="Copiar texto"
            data-testid="copy-button"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copiar
              </>
            )}
          </Button>
        </div>
      </div>
      <div
        className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/95"
        data-testid={`result-${typeId}`}
      >
        {text}
      </div>
    </Card>
  );
}
