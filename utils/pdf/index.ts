/**
 * Index central do módulo de geração de PDFs
 * Exporta tudo que é necessário para gerar PDFs
 */

// Factory centralizado
export { generatePdf, getPdfFileName, getSupportedFormTypes, isFormTypeSupported, type FormType } from "./pdfFactory";

// Tipos base
export type { BasePdfFormData } from "./base/types";

// Helpers
export {
  formatValue,
  formatValueOptional,
  formatarTipoSolicitacao,
  formatarPerfilRequerente,
  formatarEstadoCivil,
  formatarOrigemRenda,
  formatarFormasContato,
  getLogoBASE64,
  formatDateTime,
  sanitizeFileName,
} from "./base/helpers";

// Estilos base
export { baseStyles } from "./base/styles";

// Geradores específicos (se necessário uso direto)
export { generatePdfIdoso, type IdosoFormData, getIdosoFileName } from "./idoso/gerador";
export { generatePdfExCombatente, type ExCombatenteFormData, getExCombatenteFileName } from "./excombatente/gerador";
export { generatePdfPCD, type PCDFormData, getPCDFileName } from "./pcd/gerador";
export { generatePdfImovelCedido, type ImovelCedidoFormData, getImovelCedidoFileName } from "./imovelcedido/gerador";
export { generatePdfTemploReligioso, type TemploReligiosoFormData, getTemploReligiosoFileName } from "./temploligioso/gerador";
export { generatePdfTaxasMercantis, type TaxasMercantisFormData, getTaxasMercantisFileName } from "./taxasmercantis/gerador";
export { generatePdfImunidade, type ImunidadeFormData, getImunidadeFileName } from "./imunidade/gerador";
