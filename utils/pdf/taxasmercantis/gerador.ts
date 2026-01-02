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

export interface TaxasMercantisFormData extends BasePdfFormData {
  inscricaoMercantil?: string;
  possuiGuiaTaxa?: boolean;
  possuiComprovanteTaxa?: boolean;
  documentosAnexados?: string[];
  docEstatuto?: unknown;
  docAtaDiretoria?: unknown;
  docImovel?: unknown;
  docIptu?: unknown;
  docCroqui?: unknown;
  docCadastro?: unknown;
  docRgCpf?: unknown;
  docComprovanteResidencia?: unknown;
  docCartaoCnpj?: unknown;
  docFolhaPagamento?: unknown;
  docDeclaracaoEntidade?: unknown;
  docDemonstracao?: unknown;
  docCertidaoNegativa?: unknown;
  docProcuracao?: unknown;
  docCpfProcurador?: unknown;
  docIdentidadeProcurador?: unknown;
  docPeticao?: unknown;
}

function renderDocs(data: TaxasMercantisFormData) {
  const anexados = new Set((data.documentosAnexados || []).map((d) => d?.trim()));
  const docs = [
    { label: "Estatuto da Entidade", field: "docEstatuto" },
    { label: "Ata da Diretoria", field: "docAtaDiretoria" },
    { label: "Documentação do Imóvel", field: "docImovel" },
    { label: "Comprovante de IPTU", field: "docIptu" },
    { label: "Croqui da Propriedade", field: "docCroqui" },
    { label: "Cadastro Imobiliário", field: "docCadastro" },
    { label: "RG/CPF do Responsável", field: "docRgCpf" },
    { label: "Comprovante de Residência", field: "docComprovanteResidencia" },
    { label: "Cartão CNPJ", field: "docCartaoCnpj" },
    { label: "Folha de Pagamento", field: "docFolhaPagamento" },
    { label: "Declaração da Entidade", field: "docDeclaracaoEntidade" },
    { label: "Demonstração Financeira", field: "docDemonstracao" },
    { label: "Certidão Negativa de Débitos", field: "docCertidaoNegativa" },
    { label: "Procuração Autenticada", field: "docProcuracao" },
    { label: "CPF do Procurador", field: "docCpfProcurador" },
    { label: "Identidade do Procurador", field: "docIdentidadeProcurador" },
    { label: "Petição", field: "docPeticao" },
  ];

  return docs
    .map((doc) => {
      const anexado = anexados.has(doc.label) || Boolean((data as any)[doc.field]);
      return `
      <div class="info-item">
        <div class="info-label">${doc.label}</div>
        <div class="info-value">${anexado ? "Anexado" : "Faltando"}</div>
      </div>
    `;
    })
    .join("");
}

function generatePdfHtml(data: TaxasMercantisFormData): string {
  const logoBase64 = getLogoBASE64();
  const { data: dataFormatada, hora: horaFormatada } = formatDateTime(
    data.createdAt || new Date()
  );

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Requerimento Digital de Isenção – Taxas Mercantis</title>
  <style>
    ${baseStyles}
  </style>
</head>
<body>
  <div class="header">
    ${logoBase64 ? `<img src="${logoBase64}" alt="Prefeitura">` : ""}
    <div class="header-text">
      <h3>Prefeitura Municipal de Nova Iguaçu</h3>
      <h3>Estado do Rio de Janeiro</h3>
      <h3>Requerimento Digital de Isenção – Taxas Mercantis</h3>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Taxas</div>
    <div class="info-grid">
      <div class="info-item"><div class="info-label">Guia de Taxa</div><div class="info-value">${data.possuiGuiaTaxa ? "Anexada" : "Não anexada"}</div></div>
      <div class="info-item"><div class="info-label">Comprovante de Pagamento</div><div class="info-value">${data.possuiComprovanteTaxa ? "Anexado" : "Não anexado"}</div></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Identificação</div>
    <div class="info-grid">
      <div class="info-item"><div class="info-label">Tipo de Solicitação</div><div class="info-value">${formatarTipoSolicitacao(data.tipoSolicitacao)}</div></div>
      <div class="info-item"><div class="info-label">Nome</div><div class="info-value">${formatValue(data.nome)}</div></div>
      <div class="info-item"><div class="info-label">CPF</div><div class="info-value">${formatValue(data.cpf)}</div></div>
      <div class="info-item"><div class="info-label">RG</div><div class="info-value">${formatValueOptional(data.rg)}</div></div>
      <div class="info-item"><div class="info-label">Órgão Emissor</div><div class="info-value">${formatValueOptional(data.orgaoEmissor)}</div></div>
      <div class="info-item"><div class="info-label">E-mail</div><div class="info-value">${formatValue(data.email)}</div></div>
      <div class="info-item"><div class="info-label">Telefone</div><div class="info-value">${formatValue(data.telefone)}</div></div>
      ${
        data.tipoSolicitacao === "renovacao"
          ? `
      <div class="info-item"><div class="info-label">Processo Anterior</div><div class="info-value">${formatValueOptional(data.processoAnterior)}</div></div>
      <div class="info-item"><div class="info-label">Certidão Anterior</div><div class="info-value">${formatValueOptional(data.certidaoAnterior)}</div></div>
      `
          : ""
      }
    </div>
  </div>

  <div class="section">
    <div class="section-title">Localização do Imóvel</div>
    <div class="info-grid">
      <div class="info-item"><div class="info-label">Inscrição Imobiliária</div><div class="info-value">${formatValueOptional(data.inscricaoImobiliaria)}</div></div>
      <div class="info-item"><div class="info-label">Inscrição Mercantil</div><div class="info-value">${formatValueOptional(data.inscricaoMercantil)}</div></div>
      <div class="info-item"><div class="info-label">Endereço</div><div class="info-value">${formatValue(data.rua)}, ${formatValue(data.numero)}</div></div>
      <div class="info-item"><div class="info-label">Complemento</div><div class="info-value">${formatValueOptional(data.complemento)}</div></div>
      <div class="info-item"><div class="info-label">Bairro</div><div class="info-value">${formatValue(data.bairro)}</div></div>
      <div class="info-item"><div class="info-label">Cidade/UF</div><div class="info-value">${formatValue(data.cidade)} - ${formatValue(data.estado)}</div></div>
      <div class="info-item"><div class="info-label">CEP</div><div class="info-value">${formatValue(data.cep)}</div></div>
      <div class="info-item"><div class="info-label">Lote / Quadra</div><div class="info-value">${formatValueOptional(data.lote)} ${formatValueOptional(data.quadra)}</div></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Documentos</div>
    <div class="info-grid">${renderDocs(data)}</div>
  </div>

  <div class="section">
    <div class="section-title">Procurador</div>
    <div class="info-grid">
      <div class="info-item"><div class="info-label">Possui Procurador?</div><div class="info-value">${data.possuiProcurador ? "Sim" : "Não"}</div></div>
      ${
        data.possuiProcurador
          ? `
      <div class="info-item"><div class="info-label">Nome</div><div class="info-value">${formatValueOptional(data.nomeProcurador)}</div></div>
      <div class="info-item"><div class="info-label">CPF</div><div class="info-value">${formatValueOptional(data.cpfProcurador)}</div></div>
      <div class="info-item"><div class="info-label">Telefone</div><div class="info-value">${formatValueOptional(data.telefoneProcurador)}</div></div>
      <div class="info-item"><div class="info-label">E-mail</div><div class="info-value">${formatValueOptional(data.emailProcurador)}</div></div>
      `
          : ""
      }
    </div>
  </div>

  <div class="section">
    <div class="section-title">Preferências e Observações</div>
    <div class="info-grid">
      <div class="info-item"><div class="info-label">Formas de Contato</div><div class="info-value">${formatarFormasContato({
        preferenciaAR: data.preferenciaAR,
        preferenciaWhatsapp: data.preferenciaWhatsapp,
        preferenciaEmail: data.preferenciaEmail,
      })}</div></div>
      ${
        data.observacoes
          ? `<div class="info-item"><div class="info-label">Observações</div><div class="info-value">${formatValue(data.observacoes)}</div></div>`
          : ""
      }
    </div>
  </div>

  <div class="section declaration">
    <div class="section-title">Declaração</div>
    <div class="declaration-text">"Declaro, sob as penas da lei, que as informações prestadas neste requerimento são verdadeiras e de minha inteira responsabilidade."</div>
    <div class="declaration-info">
      <div class="declaration-item"><span class="declaration-label">DATA E HORA:</span><span class="declaration-value">${dataFormatada} às ${horaFormatada}</span></div>
      <div class="declaration-item"><span class="declaration-label">E-MAIL INFORMADO:</span><span class="declaration-value">${formatValue(data.email)}</span></div>
      <div class="declaration-item"><span class="declaration-label">ENDEREÇO IP:</span><span class="declaration-value">${formatValue(data.ipAddress)}</span></div>
      <div class="declaration-item"><span class="declaration-label">RESPONSÁVEL:</span><span class="declaration-value">${formatValue(data.nome)}</span></div>
    </div>
    <div class="declaration-footer">O responsável concordou eletronicamente com os termos acima no momento do envio do requerimento. Este registro possui validade legal conforme Lei nº 9.800/99 e MP nº 2.200-2/2001.</div>
  </div>

  <div class="page-footer">Documento gerado automaticamente em ${dataFormatada} às ${horaFormatada} | Sistema de Requerimento de Processos</div>
</body>
</html>
  `;
}

export async function generatePdfTaxasMercantis(
  data: TaxasMercantisFormData
): Promise<Buffer> {
  const htmlContent = generatePdfHtml(data);
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });

  try {
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "15mm",
        right: "15mm",
        bottom: "15mm",
        left: "15mm",
      },
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}

export async function getTaxasMercantisFileName(
  data: TaxasMercantisFormData
): Promise<string> {
  const nomeLimpo = sanitizeFileName(data.nome || "Requerimento");
  return `Requerimento_TaxasMercantis_${nomeLimpo}.pdf`;
}
