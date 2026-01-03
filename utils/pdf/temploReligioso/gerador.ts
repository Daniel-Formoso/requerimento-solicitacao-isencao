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

export interface TemploReligiosoFormData extends BasePdfFormData {
  inscricaoMercantil?: string;
  documentosAnexados?: string[];
}

function renderDocumentos(data: TemploReligiosoFormData) {
  const itens: { label: string; status: string }[] = [];

  if (data.documentosAnexados?.length) {
    data.documentosAnexados.forEach((doc) => {
      itens.push({ label: doc, status: "Anexado" });
    });
  }

  if (!itens.length) {
    itens.push({ label: "Documentos enviados pelo formulário", status: "Vide anexos" });
  }

  return itens
    .map(
      (item) => `
      <div class="info-item">
        <div class="info-label">${item.label}</div>
        <div class="info-value">${item.status}</div>
      </div>
    `
    )
    .join("");
}

function generatePdfHtml(data: TemploReligiosoFormData): string {
  const logoBase64 = getLogoBASE64();
  const { data: dataFormatada, hora: horaFormatada } = formatDateTime(
    data.createdAt || new Date()
  );

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Requerimento Digital de Isenção - Templo Religioso</title>
  <style>
    ${baseStyles}
  </style>
</head>
<body>
  <div class="">
    ${logoBase64 ? `<img src="${logoBase64}" alt="Prefeitura">` : ""}
    <div class="header-text">
      <h3>Prefeitura Municipal de Nova Iguaçu</h3>
      <h3>Estado do Rio de Janeiro</h3>
      <h3>Requerimento Digital de Isenção - Templo Religioso</h3>
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
    <div class="section-title">Identificação do Imóvel</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Inscrição Imobiliária</div>
        <div class="info-value">${formatValueOptional(data.inscricaoImobiliaria)}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Inscrição Mercantil</div>
        <div class="info-value">${formatValueOptional(data.inscricaoMercantil)}</div>
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

  <div class="section">
    <div class="section-title">Documentos</div>
    <div class="info-grid">
      ${renderDocumentos(data)}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Contato e Preferências</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Preferências de Contato</div>
        <div class="info-value">${formatarFormasContato(
          data.preferenciaAR,
          data.preferenciaWhatsapp,
          data.preferenciaEmail
        )}</div>
      </div>
      ${
        data.observacoes
          ? `
      <div class="info-item">
        <div class="info-label">Observações</div>
        <div class="info-value">${formatValue(data.observacoes)}</div>
      </div>
      `
          : ""
      }
    </div>
  </div>

  <div class="section declaration">
    <div class="section-title">Declaração</div>
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
        <span class="declaration-label">RESPONSÁVEL:</span>
        <span class="declaration-value">${formatValue(data.nome)}</span>
      </div>
    </div>
    <div class="declaration-footer">
      O responsável concordou eletronicamente com os termos acima no momento do envio do requerimento.<br>
      Este registro possui validade legal conforme Lei nº 9.800/99 e MP nº 2.200-2/2001.
    </div>
  </div>

  <div class="page-footer">
    Documento gerado automaticamente em ${dataFormatada} às ${horaFormatada} | Sistema de Requerimento de Processos
  </div>

</body>
</html>
  `;
}

export async function generatePdfTemploReligioso(
  data: TemploReligiosoFormData
): Promise<Buffer> {
  const htmlContent = generatePdfHtml(data);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

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

export async function getTemploReligiosoFileName(
  data: TemploReligiosoFormData
): Promise<string> {
  const nomeLimpo = sanitizeFileName(data.nome || "Requerimento_Templo");
  return `Requerimento_Templo_Religioso_${nomeLimpo}.pdf`;
}
