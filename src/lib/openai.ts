import OpenAI from "openai";

export const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

let cached: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY não está configurada no servidor. Defina a variável de ambiente e reinicie.",
    );
  }
  if (!cached) {
    cached = new OpenAI({ apiKey });
  }
  return cached;
}
