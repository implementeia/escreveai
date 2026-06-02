import { NextResponse } from "next/server";
import { z } from "zod";
import { buildPrompt } from "@/lib/prompts";
import { getOpenAIClient, OPENAI_MODEL } from "@/lib/openai";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 8192;

const TOM_VALUES = ["Formal", "Casual", "Divertido", "Persuasivo"] as const;

const emailFields = z.object({
  destinatario: z.string().min(1).max(500),
  assunto: z.string().min(1).max(500),
  tom: z.enum(TOM_VALUES),
});

const linkedinFields = z.object({
  tema: z.string().min(1).max(500),
  objetivo: z.string().min(1).max(2000),
  tom: z.enum(TOM_VALUES),
});

const produtoFields = z.object({
  nomeProduto: z.string().min(1).max(200),
  publico: z.string().min(1).max(500),
  diferenciais: z.string().min(1).max(2000),
  tom: z.enum(TOM_VALUES),
});

const bioFields = z.object({
  nome: z.string().min(1).max(200),
  cargo: z.string().min(1).max(200),
  experiencia: z.string().min(1).max(2000),
  tom: z.enum(TOM_VALUES),
});

const bodySchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("email"), fields: emailFields }),
  z.object({ type: z.literal("linkedin"), fields: linkedinFields }),
  z.object({ type: z.literal("produto"), fields: produtoFields }),
  z.object({ type: z.literal("bio"), fields: bioFields }),
]);

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Limite de requisições atingido. Tente novamente em ${rl.resetInSeconds}s.` },
      {
        status: 429,
        headers: {
          "Retry-After": String(rl.resetInSeconds),
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Servidor sem chave da OpenAI configurada." },
      { status: 500 },
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "Payload muito grande." },
      { status: 413 },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos. Verifique os campos e tente novamente." },
      { status: 400 },
    );
  }

  const { system, user, maxTokens } = buildPrompt({
    type: parsed.data.type,
    fields: parsed.data.fields as Record<string, string>,
  });

  try {
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      temperature: 0.7,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });

    const text = completion.choices[0]?.message?.content?.trim();
    if (!text) {
      return NextResponse.json(
        { error: "A IA não retornou conteúdo. Tente novamente." },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { text },
      {
        status: 200,
        headers: { "X-RateLimit-Remaining": String(rl.remaining) },
      },
    );
  } catch (err) {
    console.error("[api/generate] erro OpenAI:", err);
    return NextResponse.json(
      { error: "Falha ao gerar texto. Tente novamente em instantes." },
      { status: 502 },
    );
  }
}

export function GET() {
  return NextResponse.json(
    { message: "Use POST com { type, fields }." },
    { status: 405, headers: { Allow: "POST" } },
  );
}
