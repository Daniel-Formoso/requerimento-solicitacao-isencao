/**
 * Index central do módulo de geração de PDFs
 * Exporta tudo que é necessário para gerar PDFs
 */

// Factory centralizado
export { generatePdf, getPdfFileName, getSupportedFormTypes, isFormTypeSupported } from "./pdfFactory";

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
export { generatePdfImunidadeTemplo, getImunidadeTemploFileName, type ImunidadeTemploFormData } from "./imunidade/temploReligioso";
export { generatePdfImunidadeInstituicoes, getImunidadeInstituicoesFileName, type ImunidadeInstituicoesFormData } from "./imunidade/instituicoes";
export { generatePdfImunidadeSindicatos, getImunidadeSindicatosFileName, type ImunidadeSindicatosFormData } from "./imunidade/sindicatos";
export { generatePdfImunidadeReciproca, getImunidadeReciprocaFileName, type ImunidadeReciprocaFormData } from "./imunidade/reciproca";
