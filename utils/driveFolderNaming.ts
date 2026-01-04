const ACRONYMS: Record<string, string> = {
  iptu: "IPTU",
  pcd: "PCD",
  cpf: "CPF",
  rg: "RG",
  cnpj: "CNPJ",
};

function titleizeWord(word: string) {
  const lower = word.toLowerCase();
  if (ACRONYMS[lower]) return ACRONYMS[lower];
  if (!lower) return lower;
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export function formatDriveFormFolderName(formSlugOrName: string) {
  const raw = String(formSlugOrName || "").trim();
  if (!raw) return "Formularios";

  // Se vier como slug (isencao-idoso), transforma em "Isencao Idoso"
  const parts = raw
    .replace(/[_-]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) return "Formularios";
  return parts.map(titleizeWord).join(" ");
}

export function formatDriveRequerimentoFolderName(localFolderName: string) {
  const raw = String(localFolderName || "").trim();
  if (!raw) return "Requerimento";

  // Padrao local: "01 - requerimento Nome"
  const match = raw.match(/^(\d{1,3})\s*-\s*requerimento\s*(.*)$/i);
  if (match) {
    const num = match[1];
    const rest = (match[2] || "").trim();
    return rest ? `${num} - Requerimento ${rest}` : `${num} - Requerimento`;
  }

  // Fallback: apenas garante inicial maiuscula em "requerimento" se existir
  return raw.replace(/\brequerimento\b/gi, "Requerimento");
}
