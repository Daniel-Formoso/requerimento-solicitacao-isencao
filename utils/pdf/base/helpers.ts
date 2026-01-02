import path from "path";
import fs from "fs";

/**
 * Funções utilitárias compartilhadas para todos os geradores de PDF
 */

export function formatValue(value: string | null | undefined): string {
  return value && value.trim() !== "" ? value : "-";
}

export function formatValueOptional(value: string | null | undefined): string {
  return value && value.trim() !== "" ? value : "Nada informado";
}

export function formatarTipoSolicitacao(tipo: string | undefined): string {
  if (!tipo) return "-";
  const tipos: { [key: string]: string } = {
    primeira: "Primeira Isenção",
    renovacao: "Renovação de Isenção",
    revisao: "Revisão de Isenção",
  };
  return tipos[tipo] || tipo;
}

export function formatarPerfilRequerente(perfil: string | undefined): string {
  if (!perfil) return "-";
  const perfis: { [key: string]: string } = {
    requerente: "Requerente",
    conjuge: "Cônjuge",
    ambos: "Ambos",
  };
  const mapped = perfis[perfil?.toLowerCase()];
  return mapped || (perfil.charAt(0).toUpperCase() + perfil.slice(1).toLowerCase());
}

export function formatarEstadoCivil(estado: string | undefined): string {
  if (!estado) return "-";
  const estados: { [key: string]: string } = {
    solteiro: "Solteiro(a)",
    casado: "Casado(a)",
    divorciado: "Divorciado(a)",
    viuvo: "Viúvo(a)",
    "uniao-estavel": "União Estável",
  };
  const mapped = estados[estado];
  return mapped || (estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase());
}

export function formatarOrigemRenda(origem: string | undefined): string {
  if (!origem) return "-";
  const origens: { [key: string]: string } = {
    aposentadoria: "Aposentadoria",
    pensao: "Pensão",
    beneficio: "Benefício Social",
    trabalho: "Trabalho",
    outro: "Outro",
  };
  const mapped = origens[origem];
  return mapped || (origem.charAt(0).toUpperCase() + origem.slice(1).toLowerCase());
}

export function formatarFormasContato(
  preferenciaAR?: boolean,
  preferenciaWhatsapp?: boolean,
  preferenciaEmail?: boolean
): string {
  const contatos: string[] = [];
  if (preferenciaAR) contatos.push("Carta de Recebimento (AR)");
  if (preferenciaWhatsapp) contatos.push("WhatsApp");
  if (preferenciaEmail) contatos.push("E-mail");
  return contatos.length > 0 ? contatos.join(", ") : "-";
}

export function getLogoBASE64(): string {
  const logoPath = path.join(process.cwd(), "public", "assets", "brasao-vertical.png");
  return fs.existsSync(logoPath)
    ? `data:image/png;base64,${fs.readFileSync(logoPath).toString("base64")}`
    : "";
}

export function formatDateTime(date: Date | string): { data: string; hora: string } {
  const dateObj = date instanceof Date ? date : new Date(date);
  const data = dateObj.toLocaleDateString("pt-BR");
  const hora = dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return { data, hora };
}

export function sanitizeFileName(fileName: string): string {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_\-\s]/g, "")
    .replace(/\s+/g, "_");
}
