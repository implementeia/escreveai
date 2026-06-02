import type { TextTypeConfig } from "@/types";

export const TEXT_TYPES: TextTypeConfig[] = [
  {
    id: "email",
    label: "Email profissional",
    description: "Mensagens claras e bem estruturadas para qualquer contexto.",
    icon: "Mail",
    fields: [
      {
        name: "tom",
        label: "Tom",
        type: "select",
        options: ["Formal", "Casual", "Divertido", "Persuasivo"],
        required: true,
      },
      {
        name: "destinatario",
        label: "Para quem",
        type: "text",
        placeholder: "Ex: gerente de projetos, cliente, equipe…",
        required: true,
      },
      {
        name: "assunto",
        label: "Assunto",
        type: "text",
        placeholder: "Ex: alinhamento de cronograma, proposta comercial…",
        required: true,
      },
    ],
  },
  {
    id: "linkedin",
    label: "Post de LinkedIn",
    description: "Posts que geram engajamento e posicionamento profissional.",
    icon: "Linkedin",
    fields: [
      {
        name: "tom",
        label: "Tom",
        type: "select",
        options: ["Formal", "Casual", "Divertido", "Persuasivo"],
        required: true,
      },
      {
        name: "tema",
        label: "Tema",
        type: "text",
        placeholder: "Ex: liderança em times remotos, lançamento de produto…",
        required: true,
      },
      {
        name: "objetivo",
        label: "Objetivo",
        type: "textarea",
        placeholder: "Ex: gerar networking, posicionar como referência, divulgar vagas…",
        required: true,
      },
    ],
  },
  {
    id: "produto",
    label: "Descrição de produto",
    description: "Textos persuasivos que destacam valor e convertem.",
    icon: "Package",
    fields: [
      {
        name: "tom",
        label: "Tom",
        type: "select",
        options: ["Formal", "Casual", "Divertido", "Persuasivo"],
        required: true,
      },
      {
        name: "nomeProduto",
        label: "Nome do produto",
        type: "text",
        placeholder: "Ex: TaskFlow Pro",
        required: true,
      },
      {
        name: "publico",
        label: "Público-alvo",
        type: "text",
        placeholder: "Ex: PMEs que precisam organizar tarefas…",
        required: true,
      },
      {
        name: "diferenciais",
        label: "Diferenciais",
        type: "textarea",
        placeholder: "Liste os principais benefícios e o que diferencia do mercado…",
        required: true,
      },
    ],
  },
  {
    id: "bio",
    label: "Bio profissional",
    description: "Bios curtas para LinkedIn, sites e apresentações.",
    icon: "UserCircle",
    fields: [
      {
        name: "tom",
        label: "Tom",
        type: "select",
        options: ["Formal", "Casual", "Divertido", "Persuasivo"],
        required: true,
      },
      {
        name: "nome",
        label: "Nome",
        type: "text",
        placeholder: "Ex: Mariana Souza",
        required: true,
      },
      {
        name: "cargo",
        label: "Cargo",
        type: "text",
        placeholder: "Ex: Engenheira de software sênior",
        required: true,
      },
      {
        name: "experiencia",
        label: "Experiência",
        type: "textarea",
        placeholder: "Resumo da trajetória, conquistas e áreas de atuação…",
        required: true,
      },
    ],
  },
];

export function getTextTypeConfig(id: string): TextTypeConfig | undefined {
  return TEXT_TYPES.find((t) => t.id === id);
}
