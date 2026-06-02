"use client";

import { TEXT_TYPES } from "@/lib/textTypes";
import type { TextTypeId } from "@/types";
import { cn } from "@/lib/utils";
import { Mail, AtSign, Package, UserCircle } from "lucide-react";
import type { ComponentType } from "react";

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  Mail,
  Linkedin: AtSign,
  Package,
  UserCircle,
};

type Props = {
  value: TextTypeId;
  onChange: (id: TextTypeId) => void;
};

export function TypeSelect({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {TEXT_TYPES.map((t) => {
        const Icon = ICONS[t.icon] ?? Mail;
        const active = t.id === value;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={cn(
              "flex items-start gap-3 rounded-lg border p-4 text-left transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              active
                ? "border-accent bg-accent/10"
                : "border-border bg-surface hover:border-zinc-600",
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5 mt-0.5 shrink-0",
                active ? "text-accent" : "text-muted",
              )}
            />
            <div className="min-w-0">
              <div
                className={cn(
                  "text-sm font-medium",
                  active ? "text-foreground" : "text-foreground/90",
                )}
              >
                {t.label}
              </div>
              <div className="text-xs text-muted mt-0.5 leading-snug">
                {t.description}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
