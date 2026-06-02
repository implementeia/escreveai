"use client";

import type { TextTypeConfig } from "@/types";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";

type Props = {
  config: TextTypeConfig;
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
};

export function DynamicFields({ config, values, onChange }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {config.fields.map((field) => {
        const value = values[field.name] ?? "";
        const id = `field-${field.name}`;
        return (
          <div key={field.name} className="flex flex-col gap-1.5">
            <Label htmlFor={id}>
              {field.label}
              {field.required && <span className="text-accent ml-1">*</span>}
            </Label>
            {field.type === "text" && (
              <Input
                id={id}
                value={value}
                onChange={(e) => onChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                maxLength={500}
              />
            )}
            {field.type === "textarea" && (
              <Textarea
                id={id}
                value={value}
                onChange={(e) => onChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                maxLength={2000}
              />
            )}
            {field.type === "select" && (
              <Select
                id={id}
                value={value}
                onChange={(e) => onChange(field.name, e.target.value)}
                options={field.options ?? []}
                placeholder="Selecione…"
                required={field.required}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
