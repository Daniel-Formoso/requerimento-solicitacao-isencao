import { generatePdfIdoso, getIdosoFileName } from "./idoso/gerador";
import { generatePdfExCombatente, getExCombatenteFileName } from "./excombatente/gerador";
import { generatePdfPCD, getPCDFileName } from "./pcd/gerador";
import { generatePdfImovelCedido, getImovelCedidoFileName } from "./imovelcedido/gerador";
import { generatePdfTaxasMercantis, getTaxasMercantisFileName } from "./taxasmercantis/gerador";
import { generatePdfImunidadeTemplo, getImunidadeTemploFileName } from "./imunidade/temploReligioso";
import { generatePdfImunidadeInstituicoes, getImunidadeInstituicoesFileName } from "./imunidade/instituicoes";
import { generatePdfImunidadeSindicatos, getImunidadeSindicatosFileName } from "./imunidade/sindicatos";
import { generatePdfImunidadeReciproca, getImunidadeReciprocaFileName } from "./imunidade/reciproca";
import { BasePdfFormData } from "./base/types";

export type FormSlug =
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

interface PdfRoute {
  generator: (data: any) => Promise<Buffer>;
  fileName: (data: any) => Promise<string>;
}

const routes: Record<FormSlug, PdfRoute> = {
  "isencao-idoso": {
    generator: generatePdfIdoso,
    fileName: getIdosoFileName,
  },
  "isencao-excombatente": {
    generator: generatePdfExCombatente,
    fileName: getExCombatenteFileName,
  },
  "isencao-pcd": {
    generator: generatePdfPCD,
    fileName: getPCDFileName,
  },
  "isencao-imovel-cedido": {
    generator: generatePdfImovelCedido,
    fileName: getImovelCedidoFileName,
  },
  "isencao-templo-religioso": {
    generator: generatePdfImunidadeTemplo,
    fileName: getImunidadeTemploFileName,
  },
  "isencao-taxas-mercantis": {
    generator: generatePdfTaxasMercantis,
    fileName: getTaxasMercantisFileName,
  },
  "imunidade-templo-religioso": {
    generator: generatePdfImunidadeTemplo,
    fileName: getImunidadeTemploFileName,
  },
  "imunidade-instituicoes": {
    generator: generatePdfImunidadeInstituicoes,
    fileName: getImunidadeInstituicoesFileName,
  },
  "imunidade-sindicatos": {
    generator: generatePdfImunidadeSindicatos,
    fileName: getImunidadeSindicatosFileName,
  },
  "imunidade-reciproca": {
    generator: generatePdfImunidadeReciproca,
    fileName: getImunidadeReciprocaFileName,
  },
};

export function resolveFormSlug(data: BasePdfFormData): FormSlug {
  if (!data.formularioSlug) {
    throw new Error("formularioSlug é obrigatório para gerar o PDF");
  }

  const slug = data.formularioSlug.toLowerCase() as FormSlug;
  if (!routes[slug]) {
    throw new Error(`Tipo de formulário não suportado: ${slug}`);
  }

  return slug;
}

export function getPdfConfig(slug: FormSlug): PdfRoute {
  const config = routes[slug];
  if (!config) {
    throw new Error(`Gerador não encontrado para slug: ${slug}`);
  }
  return config;
}

export function getSupportedFormSlugs(): FormSlug[] {
  return Object.keys(routes) as FormSlug[];
}

export function isFormSlugSupported(slug: string): slug is FormSlug {
  return slug in routes;
}
