/**
 * Interface base compartilhada para todos os geradores de PDF
 * Estenda esta interface específicas para cada tipo de processo
 */

export interface BasePdfFormData {
  // Campos básicos
  tipoSolicitacao?: string;
  processoAnterior?: string;
  certidaoAnterior?: string;
  nome: string;
  cpf: string;
  rg?: string;
  orgaoEmissor?: string;
  email: string;
  telefone: string;

  // Localização do imóvel
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  inscricaoImobiliaria?: string;
  inscricaoMercantil?: string;
  lote?: string;
  quadra?: string;

  // Procurador
  possuiProcurador?: boolean;
  nomeProcurador?: string;
  cpfProcurador?: string;
  rgProcurador?: string;
  orgaoEmissorProcurador?: string;
  emailProcurador?: string;
  telefoneProcurador?: string;

  // Contato e observações
  preferenciaAR?: boolean;
  preferenciaWhatsapp?: boolean;
  preferenciaEmail?: boolean;
  observacoes?: string;

  // Metadata
  createdAt?: Date | string;
  ipAddress?: string;
  formularioSlug?: string;
  tipoFormulario?: string;
}
