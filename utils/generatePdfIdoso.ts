/**
 * COMPATIBILIDADE - Este arquivo foi substituído pela nova estrutura
 * Re-exporta os geradores do novo sistema para manter compatibilidade com código antigo
 * 
 * Este arquivo existe apenas para manter backward compatibility
 * Novo código deve importar de @/utils/pdf
 */

export { generatePdfIdoso as generateRequerimentoPdf, type IdosoFormData } from "./pdf/idoso/gerador";
export { getIdosoFileName } from "./pdf/idoso/gerador";
