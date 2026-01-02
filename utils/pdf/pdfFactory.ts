/**
 * FACTORY CENTRALIZADO - Responsável por selecionar o gerador correto
 * Escalável e fácil de manter - adicione novos tipos aqui
 */

import { BasePdfFormData } from "./base/types";
import { generatePdfIdoso, IdosoFormData, getIdosoFileName } from "./idoso/gerador";
import { generatePdfExCombatente, ExCombatenteFormData, getExCombatenteFileName } from "./excombatente/gerador";
import { generatePdfPCD, PCDFormData, getPCDFileName } from "./pcd/gerador";
import { generatePdfImovelCedido, ImovelCedidoFormData, getImovelCedidoFileName } from "./imovelcedido/gerador";
import { generatePdfTemploReligioso, getTemploReligiosoFileName, TemploReligiosoFormData } from "./temploligioso/gerador";
import { generatePdfTaxasMercantis, getTaxasMercantisFileName, TaxasMercantisFormData } from "./taxasmercantis/gerador";
import { generatePdfImunidade, getImunidadeFileName, ImunidadeFormData } from "./imunidade/gerador";

// Tipos suportados
export type FormType = 
  | "isencao-idoso"
  | "isencao-excombatente"
  | "isencao-pcd"
  | "isencao-imovel-cedido"
  | "isencao-templo-religioso"
  | "isencao-taxas-mercantis"
  | "imunidade-templo-religioso"
  | "imunidade-instituicoes"
  | "imunidade-sindicatos"
  | "imunidade-reciproca";

interface PdfGeneratorConfig {
  generador: (data: any) => Promise<Buffer>;
  getNomeArquivo: (data: any) => Promise<string>;
}

const generadores: Record<FormType, PdfGeneratorConfig> = {
  "isencao-idoso": {
    generador: generatePdfIdoso,
    getNomeArquivo: getIdosoFileName,
  },
  "isencao-excombatente": {
    generador: generatePdfExCombatente,
    getNomeArquivo: getExCombatenteFileName,
  },
  "isencao-pcd": {
    generador: generatePdfPCD,
    getNomeArquivo: getPCDFileName,
  },
  "isencao-imovel-cedido": {
    generador: generatePdfImovelCedido,
    getNomeArquivo: getImovelCedidoFileName,
  },
  "isencao-templo-religioso": {
    generador: generatePdfTemploReligioso,
    getNomeArquivo: getTemploReligiosoFileName,
  },
  "isencao-taxas-mercantis": {
    generador: generatePdfTaxasMercantis,
    getNomeArquivo: getTaxasMercantisFileName,
  },
  "imunidade-templo-religioso": {
    generador: (data: any) => {
      const imunidadeData: ImunidadeFormData = { ...data, tipoImunidade: "templo-religioso" };
      return generatePdfImunidade(imunidadeData);
    },
    getNomeArquivo: (data: any) => {
      const imunidadeData: ImunidadeFormData = { ...data, tipoImunidade: "templo-religioso" };
      return getImunidadeFileName(imunidadeData);
    },
  },
  "imunidade-instituicoes": {
    generador: (data: any) => {
      const imunidadeData: ImunidadeFormData = { ...data, tipoImunidade: "instituicoes" };
      return generatePdfImunidade(imunidadeData);
    },
    getNomeArquivo: (data: any) => {
      const imunidadeData: ImunidadeFormData = { ...data, tipoImunidade: "instituicoes" };
      return getImunidadeFileName(imunidadeData);
    },
  },
  "imunidade-sindicatos": {
    generador: (data: any) => {
      const imunidadeData: ImunidadeFormData = { ...data, tipoImunidade: "sindicatos" };
      return generatePdfImunidade(imunidadeData);
    },
    getNomeArquivo: (data: any) => {
      const imunidadeData: ImunidadeFormData = { ...data, tipoImunidade: "sindicatos" };
      return getImunidadeFileName(imunidadeData);
    },
  },
  "imunidade-reciproca": {
    generador: (data: any) => {
      const imunidadeData: ImunidadeFormData = { ...data, tipoImunidade: "reciproca" };
      return generatePdfImunidade(imunidadeData);
    },
    getNomeArquivo: (data: any) => {
      const imunidadeData: ImunidadeFormData = { ...data, tipoImunidade: "reciproca" };
      return getImunidadeFileName(imunidadeData);
    },
  },
};

/**
 * Resolve o tipo de formulário a partir dos dados
 */
function resolveFormType(data: BasePdfFormData): FormType {
  // Prioridade 1: slug do formulário se existir
  if (data.formularioSlug) {
    const slug = data.formularioSlug.toLowerCase();
    if (slug in generadores) {
      return slug as FormType;
    }
  }

  // Prioridade 2: tipoFormulario se existir
  if (data.tipoFormulario) {
    const tipo = data.tipoFormulario.toLowerCase();
    const match = Object.keys(generadores).find((key) =>
      tipo.includes(key.replace(/-/g, " "))
    );
    if (match) {
      return match as FormType;
    }
  }

  // Fallback padrão
  return "isencao-idoso";
}

/**
 * Gera PDF usando o gerador apropriado
 * @param data Dados do formulário
 * @returns Buffer do PDF gerado
 */
export async function generatePdf(data: BasePdfFormData): Promise<Buffer> {
  const formType = resolveFormType(data);
  const config = generadores[formType];

  if (!config) {
    throw new Error(
      `Tipo de formulário não suportado: ${formType}. Tipos disponíveis: ${Object.keys(
        generadores
      ).join(", ")}`
    );
  }

  return config.generador(data);
}

/**
 * Retorna o nome do arquivo de saída
 * @param data Dados do formulário
 * @returns Nome do arquivo com extensão .pdf
 */
export async function getPdfFileName(data: BasePdfFormData): Promise<string> {
  const formType = resolveFormType(data);
  const config = generadores[formType];

  if (!config) {
    throw new Error(
      `Tipo de formulário não suportado: ${formType}. Tipos disponíveis: ${Object.keys(
        generadores
      ).join(", ")}`
    );
  }

  return config.getNomeArquivo(data);
}

/**
 * Retorna todos os tipos de formulário suportados
 */
export function getSupportedFormTypes(): FormType[] {
  return Object.keys(generadores) as FormType[];
}

/**
 * Verifica se um tipo de formulário é suportado
 */
export function isFormTypeSupported(formType: string): formType is FormType {
  return formType in generadores;
}
