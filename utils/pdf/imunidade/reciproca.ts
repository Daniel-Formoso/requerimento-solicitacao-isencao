import puppeteer from "puppeteer";
import { baseStyles } from "../base/styles";
import {
  formatValue,
  formatValueOptional,
  formatarTipoSolicitacao,
  formatarFormasContato,
  getLogoBASE64,
  formatDateTime,
  sanitizeFileName,
} from "../base/helpers";
import { BasePdfFormData } from "../base/types";

export interface ImunidadeReciprocaFormData extends BasePdfFormData {
  possuiGuiaTaxa?: boolean;
  possuiComprovanteTaxa?: boolean;
  inscricaoMercantil?: string;
  preferenciaAR?: boolean;
  preferenciaWhatsapp?: boolean;
  preferenciaEmail?: boolean;
  observacoes?: string;
  documentosAnexados?: string[];
  nomesArquivos?: Record<string, string>;
}

function renderDocs(data: ImunidadeReciprocaFormData) {
  const anexados = new Set((data.documentosAnexados || []).map((d) => d?.trim()));
  const nomesArquivos = data.nomesArquivos || {};
  const docs = [
    { label: "Guia de Pagamento", field: "guia" },
    { label: "Comprovante de Pagamento", field: "comprovante" },
    { label: "Ofício Assinado do Órgão Público", field: "docOficio" },
    { label: "Estatuto Social e alterações", field: "docEstatuto" },
    { label: "Ata de Eleição da diretoria", field: "docAtaDiretoria" },
    { label: "Documento do imóvel", field: "docImovel" },
    { label: "Registro de IPTU do imóvel", field: "docIptu" },
    { label: "Croqui de localização", field: "docCroqui" },
    { label: "Registro de cadastro imobiliário", field: "docCadastro" },
    { label: "Identificação (RG/CPF)", field: "docRgCpf" },
    { label: "Comprovante de residência", field: "docComprovanteResidencia" },
    { label: "Cartão CNPJ", field: "docCartaoCnpj" },
    { label: "Folha de pagamento", field: "docFolhaPagamento" },
    { label: "Declaração de entidade", field: "docDeclaracaoEntidade" },
    { label: "Demonstração e Balanço", field: "docDemonstracao" },
    { label: "Certidão Negativa/Positiva", field: "docCertidaoNegativa" },
    { label: "Procuração Autenticada", field: "docProcuracao" },
    { label: "CPF do Procurador", field: "docCpfProcurador" },
    { label: "Identidade do Procurador", field: "docIdentidadeProcurador" },
    { label: "Petição", field: "docPeticao" },
  ];

  return docs
    .map((doc) => {
      const anexado = anexados.has(doc.label) || Boolean(nomesArquivos[doc.field]);
      return `
      <div class="info-item">
        <div class="info-label">${doc.label}</div>
        <div class="info-value">${anexado ? "Anexado" : "Faltando"}</div>
      </div>
    `;
    })
    .join("");
}

function generatePdfHtml(data: ImunidadeReciprocaFormData): string {
  const logoBase64 = getLogoBASE64();
  const { data: dataFormatada, hora: horaFormatada } = formatDateTime(
    data.createdAt || new Date()
  );

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Requerimento Digital de Imunidade – Imunidade Recíproca</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="header">
    ${logoBase64 ? `<img src="${logoBase64}" alt="Prefeitura">` : ""}
    <div class="header-text">
      <h3>Prefeitura Municipal de Nova Iguaçu</h3>
      <h3>Estado do Rio de Janeiro</h3>
      <h3>Requerimento Digital de Imunidade – Imunidade Recíproca</h3>
    </div>
  </div>

 <div class="section">
     <div class="section-title">Tipo de Solicitação</div>
     <div class="info-grid">
       <div class="info-item">
         <div class="info-label">Tipo de Solicitação</div>
         <div class="info-value">${formatarTipoSolicitacao(data.tipoSolicitacao)}</div>
       </div>
       ${
         data.tipoSolicitacao === "renovacao"
           ? `
       <div class="info-item">
         <div class="info-label">Processo Anterior</div>
         <div class="info-value">${formatValueOptional(data.processoAnterior)}</div>
       </div>
       <div class="info-item">
         <div class="info-label">Certidão Anterior</div>
         <div class="info-value">${formatValueOptional(data.certidaoAnterior)}</div>
       </div>
       `
           : ""
       }
     </div>
   </div>
 
   <div class="section">
     <div class="section-title">Identificação do Requerente</div>
     <div class="info-grid">
       <div class="info-item">
         <div class="info-label">Nome Completo</div>
         <div class="info-value">${formatValue(data.nome)}</div>
       </div>
       <div class="info-item">
         <div class="info-label">CPF</div>
         <div class="info-value">${formatValue(data.cpf)}</div>
       </div>
       <div class="info-item">
         <div class="info-label">RG</div>
         <div class="info-value">${formatValueOptional(data.rg)}</div>
       </div>
       <div class="info-item">
         <div class="info-label">Órgão Expedidor</div>
         <div class="info-value">${formatValueOptional(data.orgaoEmissor)}</div>
       </div>
       <div class="info-item">
         <div class="info-label">E-mail</div>
         <div class="info-value">${formatValue(data.email)}</div>
       </div>
       <div class="info-item">
         <div class="info-label">Telefone</div>
         <div class="info-value">${formatValue(data.telefone)}</div>
       </div>
     </div>
   </div>
 
   <div class="section">
     <div class="section-title">Identificação do Procurador</div>
     <div class="info-grid">
       <div class="info-item">
         <div class="info-label">Possui Procurador?</div>
         <div class="info-value bool-value"><span class="${
           data.possuiProcurador ? "sim" : "nao"
         }">${data.possuiProcurador ? "Sim" : "Não"}</span></div>
       </div>
       <div class="info-item">
         <div class="info-label">Nome do Procurador</div>
         <div class="info-value">${formatValueOptional(data.nomeProcurador)}</div>
       </div>
       <div class="info-item">
         <div class="info-label">CPF</div>
         <div class="info-value">${formatValueOptional(data.cpfProcurador)}</div>
       </div>
       <div class="info-item">
         <div class="info-label">RG</div>
         <div class="info-value">${formatValueOptional(data.rgProcurador)}</div>
       </div>
       <div class="info-item">
         <div class="info-label">Órgão Expedidor</div>
         <div class="info-value">${formatValueOptional(data.orgaoEmissorProcurador)}</div>
       </div>
       <div class="info-item">
         <div class="info-label">E-mail</div>
         <div class="info-value">${formatValueOptional(data.emailProcurador)}</div>
       </div>
       <div class="info-item">
         <div class="info-label">Telefone</div>
         <div class="info-value">${formatValueOptional(data.telefoneProcurador)}</div>
       </div>
     </div>
   </div>
 
   <div class="section">
     <div class="section-title">Identificação do Imóvel</div>
     <div class="info-grid">
       <div class="info-item">
         <div class="info-label">Inscrição Imobiliária</div>
         <div class="info-value">${formatValue(data.inscricaoImobiliaria)}</div>
       </div>
       <div class="info-item">
         <div class="info-label">CEP</div>
         <div class="info-value">${formatValue(data.cep)}</div>
       </div>
       <div class="info-item">
         <div class="info-label">Endereço</div>
         <div class="info-value">${formatValue(data.rua)}</div>
       </div>
       <div class="info-item">
         <div class="info-label">Número</div>
         <div class="info-value">${formatValue(data.numero)}</div>
       </div>
       <div class="info-item">
         <div class="info-label">Complemento</div>
         <div class="info-value">${formatValueOptional(data.complemento)}</div>
       </div>
       <div class="info-item">
         <div class="info-label">Bairro</div>
         <div class="info-value">${formatValue(data.bairro)}</div>
       </div>
       <div class="info-item">
         <div class="info-label">Cidade</div>
         <div class="info-value">${formatValue(data.cidade)}</div>
       </div>
       <div class="info-item">
         <div class="info-label">Estado</div>
         <div class="info-value">${formatValue(data.estado)}</div>
       </div>
       <div class="info-item">
         <div class="info-label">Lote</div>
         <div class="info-value">${formatValueOptional(data.lote)}</div>
       </div>
       <div class="info-item">
         <div class="info-label">Quadra</div>
         <div class="info-value">${formatValueOptional(data.quadra)}</div>
       </div>
     </div>
   </div>
 
 
 
   <!-- Nova seção: Documentos Anexados -->
   <div class="section">
     <div class="section-title">Documentos Anexados</div>
     <div class="info-grid">
       ${renderDocs(data)}
     </div>
   </div>
 
  <div class="section">
    <div class="section-title">Formas de Contato</div>
    <div class="info-grid">
      <div class="info-item full-width">
        <div class="info-label">Formas de Contato Preferidas</div>
        <div class="info-value">${formatarFormasContato(
          data.preferenciaAR,
          data.preferenciaWhatsapp,
          data.preferenciaEmail
        )}</div>
      </div>
    </div>
  </div>
 
   <div class="section">
     <div class="section-title">Observações</div>
     <div class="info-grid">
       <div class="info-item full-width">
         <div class="info-value">${formatValueOptional(data.observacoes)}</div>
       </div>
     </div>
   </div>
 
 
   <div class="declaration-section" style="margin-top:32px;">
     <div class="declaration-title">Declaração de Concordância Eletrônica</div>
     <div class="declaration-text">
       "Declaro, sob as penas da lei, que as informações prestadas neste requerimento são verdadeiras e de minha inteira responsabilidade."
     </div>
     <div class="declaration-info">
       <div class="declaration-item">
         <span class="declaration-label">DATA E HORA:</span>
         <span class="declaration-value">${dataFormatada} às ${horaFormatada}</span>
       </div>
       <div class="declaration-item">
         <span class="declaration-label">E-MAIL INFORMADO:</span>
         <span class="declaration-value">${formatValue(data.email)}</span>
       </div>
       <div class="declaration-item">
         <span class="declaration-label">ENDEREÇO IP:</span>
         <span class="declaration-value">${formatValue(data.ipAddress)}</span>
       </div>
       <div class="declaration-item">
         <span class="declaration-label">CONTRIBUINTE:</span>
         <span class="declaration-value">${formatValue(data.nome)}</span>
       </div>
     </div>
     <div class="declaration-footer">
       O contribuinte concordou eletronicamente com os termos acima no momento do envio do requerimento.<br>
       Este registro possui validade legal conforme Lei nº 9.800/99 e MP nº 2.200-2/2001.
     </div>
   </div>

  <div class="page-footer">Documento gerado automaticamente em ${dataFormatada} às ${horaFormatada} | Sistema de Requerimento de Processos</div>
</body>
</html>
  `;
}

export async function generatePdfImunidadeReciproca(
  data: ImunidadeReciprocaFormData
): Promise<Buffer> {
  const htmlContent = generatePdfHtml(data);
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });

  try {
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "15mm", right: "15mm", bottom: "15mm", left: "15mm" },
    });
    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}

export async function getImunidadeReciprocaFileName(
  data: ImunidadeReciprocaFormData
): Promise<string> {
  const nomeLimpo = sanitizeFileName(data.nome || "Requerimento_Reciproca");
  return `Requerimento_Imunidade_Reciproca_${nomeLimpo}.pdf`;
}
