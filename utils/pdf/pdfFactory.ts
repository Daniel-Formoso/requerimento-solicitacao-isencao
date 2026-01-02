/**
 * FACTORY CENTRALIZADO - Responsável por selecionar o gerador correto
 * Escalável e fácil de manter - adicione novos tipos aqui
 */

import { BasePdfFormData } from "./base/types";
import {
  FormSlug,
  getPdfConfig,
  getSupportedFormSlugs,
  isFormSlugSupported,
  resolveFormSlug,
} from "./router";

/**
 * Gera PDF usando o gerador apropriado (obrigatório informar formularioSlug)
 */
export async function generatePdf(data: BasePdfFormData): Promise<Buffer> {
  const slug = resolveFormSlug(data);
  const config = getPdfConfig(slug);
  return config.generator(data);
}

/**
 * Retorna o nome do arquivo de saída (obrigatório informar formularioSlug)
 */
export async function getPdfFileName(data: BasePdfFormData): Promise<string> {
  const slug = resolveFormSlug(data);
  const config = getPdfConfig(slug);
  return config.fileName(data);
}

export function getSupportedFormTypes(): FormSlug[] {
  return getSupportedFormSlugs();
}

export function isFormTypeSupported(formType: string): formType is FormSlug {
  return isFormSlugSupported(formType);
}
