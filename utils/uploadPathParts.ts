export type UploadPathParts = {
  dateFolder: string;
  formulario: string;
  requerimentoFolderName: string;
};

export function extractUploadPathParts(localFilePath: string): UploadPathParts | null {
  if (!localFilePath) return null;

  // Normaliza para facilitar split independente do SO
  const normalized = String(localFilePath).replace(/\\/g, "/");
  const parts = normalized.split("/").filter(Boolean);

  const uploadsIndex = parts.lastIndexOf("uploads");
  if (uploadsIndex === -1) return null;

  const dateFolder = parts[uploadsIndex + 1];
  const formulario = parts[uploadsIndex + 2];
  const requerimentoFolderName = parts[uploadsIndex + 3];

  if (!dateFolder || !formulario || !requerimentoFolderName) return null;

  return { dateFolder, formulario, requerimentoFolderName };
}
