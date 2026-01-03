import puppeteer from "puppeteer";
import { baseStyles } from "../base/styles";
import {
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
} from "../base/helpers";
import { BasePdfFormData } from "../base/types";

export interface ExCombatenteFormData extends BasePdfFormData {
  perfilRequerente?: string;
  estadoCivil?: string;
  unicoImovel?: boolean;
  residenciaPropria?: boolean;
  anoInicio?: string;
  rendaAte2Salarios?: boolean;
  origemRenda?: string;
  origemRendaOutro?: string;
  nomeConjuge?: string;
  cpfConjuge?: string;
  rgConjuge?: string;
  telefoneConjuge?: string;
  emailConjuge?: string;
  origemRendaConjuge?: string;
  documentosAnexados?: string[];
  testemunha1Nome?: string;
  testemunha1Cpf?: string;
  testemunha1Rg?: string;
  testemunha1OrgaoEmissor?: string;
  testemunha1Telefone?: string;
  testemunha1Email?: string;
  testemunha2Nome?: string;
  testemunha2Cpf?: string;
  testemunha2Rg?: string;
  testemunha2OrgaoEmissor?: string;
  testemunha2Telefone?: string;
  testemunha2Email?: string;
  assinaturaRogo?: boolean;
}

function generatePdfHtml(data: ExCombatenteFormData): string {
  const logoBase64 = getLogoBASE64();
  const { data: dataFormatada, hora: horaFormatada } = formatDateTime(
    data.createdAt || new Date()
  );

  // Gera o HTML da seção de documentos anexados
  const documentosAnexadosHtml = (() => {
    const docs = data.documentosAnexados;
    if (Array.isArray(docs) && docs.length > 0) {
      return docs.map(
        (doc: string) => `
            <div class="info-item">
              <div class="info-label">Documento</div>
              <div class="info-value">${doc}</div>
            </div>
          `
      ).join("");
    } else {
      return `
            <div class="info-item">
              <div class="info-label"></div>
              <div class="info-value">Nenhum documento anexado</div>
            </div>
          `;
    }
  })();

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Requerimento de Isenção - Ex-combatente</title>
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
      <h3>Requerimento Digital de Isenção - Ex-combatente</h3>
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

  <div class="section">
    <div class="section-title">Elegibilidade</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Perfil do Requerente</div>
        <div class="info-value">${formatarPerfilRequerente(data.perfilRequerente)}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Estado Civil</div>
        <div class="info-value">${formatarEstadoCivil(data.estadoCivil)}</div>
      </div>
      <div class="info-item">
        <div class="info-label">É Único Imóvel?</div>
        <div class="info-value bool-value"><span class="${
          data.unicoImovel ? "sim" : "nao"
        }">${data.unicoImovel ? "Sim" : "Não"}</span></div>
      </div>
      <div class="info-item">
        <div class="info-label">É Residência Própria?</div>
        <div class="info-value bool-value"><span class="${
          data.residenciaPropria ? "sim" : "nao"
        }">${data.residenciaPropria ? "Sim" : "Não"}</span></div>
      </div>
      <div class="info-item">
        <div class="info-label">Ano de Início de Residência</div>
        <div class="info-value">${formatValueOptional(data.anoInicio)}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Renda até 2 Salários Mínimos?</div>
        <div class="info-value bool-value"><span class="${
          data.rendaAte2Salarios ? "sim" : "nao"
        }">${data.rendaAte2Salarios ? "Sim" : "Não"}</span></div>
      </div>
      <div class="info-item">
        <div class="info-label">Origem da Renda</div>
        <div class="info-value">${formatarOrigemRenda(data.origemRenda)}</div>
      </div>
      ${
        data.origemRenda === "outro"
          ? `
      <div class="info-item">
        <div class="info-label">Outra Origem da Renda</div>
        <div class="info-value">${formatValueOptional(data.origemRendaOutro)}</div>
      </div>
      `
          : ""
      }
    </div>
  </div>

  <div class="section">
    <div class="section-title">Dados do Cônjuge</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Nome do Cônjuge</div>
        <div class="info-value">${formatValueOptional(data.nomeConjuge)}</div>
      </div>
      <div class="info-item">
        <div class="info-label">CPF</div>
        <div class="info-value">${formatValueOptional(data.cpfConjuge)}</div>
      </div>
      <div class="info-item">
        <div class="info-label">RG</div>
        <div class="info-value">${formatValueOptional(data.rgConjuge)}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Telefone</div>
        <div class="info-value">${formatValueOptional(data.telefoneConjuge)}</div>
      </div>
      <div class="info-item">
        <div class="info-label">E-mail</div>
        <div class="info-value">${formatValueOptional(data.emailConjuge)}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Origem da Renda</div>
        <div class="info-value">${formatarOrigemRenda(data.origemRendaConjuge)}</div>
      </div>
    </div>
  </div>

  <div class="section">
  <div class="section-title">Testemunhas (Assinatura a Rogo)</div>
  <div class="info-grid" style="margin-bottom: 8px;">
    <div class="info-item">
      <div class="info-label">Assinatura a Rogo?</div>
      <div class="info-value bool-value"><span class="${data.assinaturaRogo ? "sim" : "nao"}">${data.assinaturaRogo ? "Sim" : "Não"}</span></div>
    </div>
  </div>
  
  <div style="margin-bottom: 8px;">
    <div style="font-weight: bold; font-size: 10px; margin-bottom: 4px;">Testemunha 1</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Nome</div>
        <div class="info-value">${formatValueOptional(data.testemunha1Nome)}</div>
      </div>
      <div class="info-item">
        <div class="info-label">CPF</div>
        <div class="info-value">${formatValueOptional(data.testemunha1Cpf)}</div>
      </div>
      <div class="info-item">
        <div class="info-label">RG</div>
        <div class="info-value">${formatValueOptional(data.testemunha1Rg)}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Órgão Emissor</div>
        <div class="info-value">${formatValueOptional(data.testemunha1OrgaoEmissor)}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Telefone</div>
        <div class="info-value">${formatValueOptional(data.testemunha1Telefone)}</div>
      </div>
      <div class="info-item">
        <div class="info-label">E-mail</div>
        <div class="info-value">${formatValueOptional(data.testemunha1Email)}</div>
      </div>
    </div>
  </div>

  <div>
    <div style="font-weight: bold; font-size: 10px; margin-bottom: 4px;">Testemunha 2</div>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Nome</div>
          <div class="info-value">${formatValueOptional(data.testemunha2Nome)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">CPF</div>
          <div class="info-value">${formatValueOptional(data.testemunha2Cpf)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">RG</div>
          <div class="info-value">${formatValueOptional(data.testemunha2Rg)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Órgão Emissor</div>
          <div class="info-value">${formatValueOptional(data.testemunha2OrgaoEmissor)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Telefone</div>
          <div class="info-value">${formatValueOptional(data.testemunha2Telefone)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">E-mail</div>
          <div class="info-value">${formatValueOptional(data.testemunha2Email)}</div>
        </div>
      </div>
    </div>
  </div>

    <!-- Nova seção: Documentos Anexados -->
  <div class="section">
    <div class="section-title">Documentos Anexados</div>
    <div class="info-grid">
      ${documentosAnexadosHtml}
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

  <div class="declaration-section" style="margin-top:150px;">
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

  <div class="page-footer">
    Documento gerado automaticamente em ${dataFormatada} às ${horaFormatada} | Sistema de Requerimento de Processos
  </div>

</body>
</html>
  `;
}

export async function generatePdfExCombatente(data: ExCombatenteFormData): Promise<Buffer> {
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

export async function getExCombatenteFileName(data: ExCombatenteFormData): Promise<string> {
  const nomeLimpo = sanitizeFileName(data.nome || "Requerimento");
  return `Requerimento_ExCombatente_${nomeLimpo}.pdf`;
}
