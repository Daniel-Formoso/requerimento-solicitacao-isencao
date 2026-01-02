import { BasePdfFormData } from "../base/types";
import { generatePdfGenerico, getGenericoFileName } from "../imovelcedido/gerador";

export interface TemploReligiosoFormData extends BasePdfFormData {
  inscricaoMercantil?: string;
}

export async function generatePdfTemploReligioso(
  data: TemploReligiosoFormData
): Promise<Buffer> {
  return generatePdfGenerico(
    data,
    "Requerimento Digital de Isenção - Templo Religioso"
  );
}

export async function getTemploReligiosoFileName(
  data: TemploReligiosoFormData
): Promise<string> {
  return getGenericoFileName(data, "Requerimento_Templo");
}
