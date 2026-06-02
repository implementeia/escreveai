export type TextTypeId = "email" | "linkedin" | "produto" | "bio";

export type FieldType = "text" | "textarea" | "select";

export type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  required: boolean;
};

export type TextTypeConfig = {
  id: TextTypeId;
  label: string;
  description: string;
  icon: string;
  fields: FieldConfig[];
};

export type GenerateRequest = {
  type: TextTypeId;
  fields: Record<string, string>;
};

export type GenerateResponse =
  | { text: string }
  | { error: string };

export type HistoryItem = {
  id: string;
  type: TextTypeId;
  typeLabel: string;
  fields: Record<string, string>;
  text: string;
  createdAt: number;
};

export type FormStatus = "idle" | "loading" | "success" | "error";
