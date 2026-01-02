import { BasePdfFormData } from "../base/types";
import { generatePdfGenerico, getGenericoFileName } from "../imovelcedido/gerador";

export interface ImunidadeFormData extends BasePdfFormData {
  inscricaoMercantil?: string;
  tipoImunidade?: "templo-religioso" | "instituicoes" | "sindicatos" | "reciproca";
}

export async function generatePdfImunidade(
  data: ImunidadeFormData
): Promise<Buffer> {
  let titulo = "Requerimento Digital de Imunidade";

  if (data.tipoImunidade === "templo-religioso") {
    titulo = "Requerimento Digital de Imunidade - Templo Religioso";
  } else if (data.tipoImunidade === "instituicoes") {
    titulo = "Requerimento Digital de Imunidade - Instituições Sem Fins Lucrativos";
  } else if (data.tipoImunidade === "sindicatos") {
    titulo = "Requerimento Digital de Imunidade - Sindicatos";
  } else if (data.tipoImunidade === "reciproca") {
    titulo = "Requerimento Digital de Imunidade Recíproca";
  }

  return generatePdfGenerico(data, titulo);
}

export async function getImunidadeFileName(
  data: ImunidadeFormData
): Promise<string> {
  let prefixo = "Requerimento_Imunidade";

  if (data.tipoImunidade === "templo-religioso") {
    prefixo = "Requerimento_Imunidade_Templo";
  } else if (data.tipoImunidade === "instituicoes") {
    prefixo = "Requerimento_Imunidade_Instituicoes";
  } else if (data.tipoImunidade === "sindicatos") {
    prefixo = "Requerimento_Imunidade_Sindicatos";
  } else if (data.tipoImunidade === "reciproca") {
    prefixo = "Requerimento_Imunidade_Reciproca";
  }

  return getGenericoFileName(data, prefixo);
}
