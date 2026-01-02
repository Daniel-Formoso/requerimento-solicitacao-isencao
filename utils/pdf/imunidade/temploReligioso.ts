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

export interface ImunidadeTemploFormData extends BasePdfFormData {
  inscricaoMercantil?: string;
  docEstatuto?: unknown;
  docAtaDiretoria?: unknown;
  docImovel?: unknown;
  docIptu?: unknown;
  docCroqui?: unknown;
  docCadastro?: unknown;
  docRgCpf?: unknown;
  docProcuracao?: unknown;
  docCpfProcurador?: unknown;
  docIdentidadeProcurador?: unknown;
  docPeticao?: unknown;
}

function renderDocs(data: ImunidadeTemploFormData) {
  const docs = [
    { label: "Estatuto da Entidade", value: data.docEstatuto },
    { label: "Ata da Diretoria", value: data.docAtaDiretoria },
    { label: "Documentação do Imóvel", value: data.docImovel },
    { label: "Comprovante de IPTU", value: data.docIptu },
    { label: "Croqui da Propriedade", value: data.docCroqui },
    { label: "Cadastro Imobiliário", value: data.docCadastro },
    { label: "RG/CPF do Responsável", value: data.docRgCpf },
    { label: "Procuração Autenticada", value: data.docProcuracao },
    { label: "CPF do Procurador", value: data.docCpfProcurador },
    { label: "Identidade do Procurador", value: data.docIdentidadeProcurador },
    { label: "Petição", value: data.docPeticao },
  ];

  return docs
    .map(
      (doc) => `
      <div class="info-item">
        <div class="info-label">${doc.label}</div>
        <div class="info-value">${doc.value ? "Anexado" : "Faltando"}</div>
      </div>
    `
    )
    .join("");
}

function generatePdfHtml(data: ImunidadeTemploFormData): string {
  const logoBase64 = getLogoBASE64();
  const { data: dataFormatada, hora: horaFormatada } = formatDateTime(
    data.createdAt || new Date()
  );

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Requerimento Digital de Imunidade – Templo Religioso</title>
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
      <h3>Requerimento Digital de Imunidade – Templo Religioso</h3>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Taxas</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Guia de Taxa</div>
        <div class="info-value">${data.possuiGuiaTaxa ? "Anexada" : "Não anexada"}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Comprovante de Pagamento</div>
        <div class="info-value">${data.possuiComprovanteTaxa ? "Anexado" : "Não anexado"}</div>
      </div>
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

export async function generatePdfImunidadeTemplo(
  data: ImunidadeTemploFormData
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

export async function getImunidadeTemploFileName(data: ImunidadeTemploFormData): Promise<string> {
  const nomeLimpo = sanitizeFileName(data.nome || "Requerimento_Templo");
  return `Requerimento_Imunidade_Templo_${nomeLimpo}.pdf`;
}
