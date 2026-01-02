import { BasePdfFormData } from "../base/types";
import { generatePdfGenerico, getGenericoFileName } from "../imovelcedido/gerador";

export interface TaxasMercantisFormData extends BasePdfFormData {
  inscricaoMercantil?: string;
}

export async function generatePdfTaxasMercantis(
  data: TaxasMercantisFormData
): Promise<Buffer> {
  return generatePdfGenerico(
    data,
    "Requerimento Digital de Isenção - Taxas Mercantis"
  );
}

export async function getTaxasMercantisFileName(
  data: TaxasMercantisFormData
): Promise<string> {
  return getGenericoFileName(data, "Requerimento_TaxasMercantis");
}
