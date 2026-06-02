# AGENTS.md — EscreveAi

Gerador de textos com IA em PT-BR. Next.js 16 (App Router) + Tailwind v4 + OpenAI. Sem banco, sem auth, histórico em memória.

## Comandos

| Tarefa | Comando |
|---|---|
| Dev (porta 3010) | `npm run dev` |
| Build de produção | `npm run build` |
| Start (porta 3010) | `npm run start` |
| Lint | `npm run lint` |
| Typecheck (sem script no `package.json`) | `npx tsc --noEmit` |

Não existe script de teste nem framework de teste configurado.

## Variáveis de ambiente

Arquivo `.env.local` (criar a partir de `.env.example`, já está no `.gitignore`):

```
OPENAI_API_KEY=sk-...        # obrigatório para /api/generate funcionar
OPENAI_MODEL=gpt-4o-mini     # opcional, default gpt-4o-mini
```

O build **não** exige a chave, mas a API retorna 500 sem ela.

## Estrutura

```
src/
├── app/
│   ├── page.tsx              # landing (/  — hero + features)
│   ├── app/page.tsx          # gerador (/app)
│   └── api/generate/route.ts # POST handler (validação Zod + OpenAI)
├── components/
│   ├── ui/                   # Button, Input, Textarea, Select, Card, Label
│   ├── landing/              # Hero, Features, CtaBanner
│   └── generator/            # GeneratorForm, TypeSelect, DynamicFields, ResultCard, HistoryList
├── lib/
│   ├── textTypes.ts          # SINGLE SOURCE OF TRUTH: config dos 4 tipos
│   ├── prompts.ts            # system + user prompts por tipo + max_tokens
│   ├── openai.ts             # cliente OpenAI lazy (getOpenAIClient)
│   ├── rateLimit.ts          # in-memory, 10 req/min por IP
│   └── utils.ts              # cn(), formatRelativeTime()
├── hooks/useHistory.tsx      # Context + useHistory/useHistoryDispatch/useHistoryClear
└── types/index.ts            # TextTypeId, FieldConfig, GenerateRequest/Response, HistoryItem
```

> A pasta `app/app/` é intencional: rota raiz = landing, `/app` = gerador. O Next.js roteia por segmentos de pasta.

## Single source of truth

`src/lib/textTypes.ts` exporta `TEXT_TYPES: TextTypeConfig[]`. **Toda mudança em um tipo de texto** (campos, label, ícone) começa aí. Esse array dirige:
- o `TypeSelect` (UI)
- o `DynamicFields` (renderiza inputs)
- a validação Zod em `app/api/generate/route.ts` (campos por tipo)

Para adicionar um novo tipo: editar `textTypes.ts`, adicionar a entrada em `TEXT_TYPES`, criar o schema Zod em `route.ts`, e adicionar o template de prompt em `prompts.ts`.

Os 4 tipos atuais: `email`, `linkedin`, `produto`, `bio`. Tom (campo global, presente nos 4 tipos): `Formal | Casual | Divertido | Persuasivo`.

## API `/api/generate`

`runtime = "nodejs"`. Ordem do handler:
1. **Rate limit** (`lib/rateLimit.ts`) — 10 req/min por IP, janela de 60s. 429 com `Retry-After` se exceder.
2. **Chave da OpenAI** — 500 se ausente.
3. **Parse JSON** — 400 se inválido.
4. **Validação Zod** com `discriminatedUnion("type", ...)` — 400 se inválido.
5. **OpenAI chat completion** — `gpt-4o-mini`, `temperature: 0.7`, `max_tokens` por tipo (250..600).

Resposta: `{ text: string }` em 200 ou `{ error: string }` em 4xx/5xx.

## Gotchas (coisas que custaram a descobrir)

- **Cliente OpenAI é lazy** (`getOpenAIClient()` em `lib/openai.ts`). Instanciar `new OpenAI({ apiKey })` no topo do módulo faz o build falhar quando `OPENAI_API_KEY` não está definida. Mantenha lazy.
- **Versão do `lucide-react` instalada é 1.17** (não a linha 0.x comum). Ela **não exporta** `Linkedin` nem `Card`. Use `AtSign` para o tipo LinkedIn e `FileText` onde antes seria `Card`. Não troque a versão sem testar — outras quebras de tipo podem aparecer.
- **Histórico é volátil** — Context API em `useHistory.tsx`, máximo 5 itens, FIFO. Sem `localStorage`. Some ao recarregar a página.
- **Rate limit é in-memory** — não sobrevive a restart, não escala entre instâncias. Aceitável para um projeto sem auth.
- **Validação Zod é per-tipo** — se mudar os campos em `textTypes.ts`, atualize o schema correspondente em `route.ts`. Esquecer causa 400 silencioso.
- **Botão muda de tipo confirma reset** — `handleTypeChange` chama `confirm()` se já houver conteúdo. Em testes/snapshots isso pode travar.
- **Porta fixa 3010** — definida em `package.json` (`next dev -p 3010` / `next start -p 3010`). Se 3010 estiver ocupada, Next.js não cai pra 3000 silenciosamente; ele usa a próxima livre e loga um warning. Para forçar, libere a 3010 antes.
- **`useHistory` é `.tsx`** (não `.ts`) porque exporta o componente `HistoryProvider`. Importe de `@/hooks/useHistory` sem extensão.

## Convenções

- Alias de import: `@/*` → `./src/*` (definido em `tsconfig.json`).
- Tailwind v4 com tokens em `globals.css` via `@theme inline` (cores: `background`, `surface`, `surface-elevated`, `border`, `muted`, `accent`, `accent-hover`, `danger`).
- Componentes interativos são `"use client"`. Layouts e páginas de servidor não têm a diretiva.
- Idioma da UI: PT-BR (`<html lang="pt-BR">`). Sem i18n.
- Cores hardcoded no `tailwind.config`? Não — tudo via tokens CSS no `globals.css`. Use classes como `bg-accent`, `text-muted`, `border-border` em vez de `sky-500` etc.

## Verificação antes de commit

```
npm run lint
npx tsc --noEmit
npm run build
```

Se algum dos três falhar, não commite.
