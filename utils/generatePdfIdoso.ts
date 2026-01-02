import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";

// Interface para os dados do formulário de idoso
export interface IdosoFormData {
    tipoSolicitacao?: string;
    processoAnterior?: string;
    certidaoAnterior?: string;
    nome: string;
    cpf: string;
    rg?: string;
    orgaoEmissor?: string;
    email: string;
    telefone: string;
    cep: string;
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    inscricaoImobiliaria?: string;
    lote?: string;
    quadra?: string;
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
    coproprietario?: boolean;
    origemRendaConjuge?: string;
    possuiProcurador?: boolean;
    nomeProcurador?: string;
    cpfProcurador?: string;
    rgProcurador?: string;
    orgaoEmissorProcurador?: string;
    emailProcurador?: string;
    telefoneProcurador?: string;
    assinaturaRogo?: boolean;
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
    documentosAnexados?: string[];
    preferenciaAR?: boolean;
    preferenciaWhatsapp?: boolean;
    preferenciaEmail?: boolean;
    observacoes?: string;
    createdAt?: Date | string;
    ipAddress?: string;
}

// Função auxiliar para formatar valor ou retornar placeholder
function formatValue(value: string | null | undefined): string {
    return value && value.trim() !== "" ? value : "-";
}

function formatValueOptional(value: string | null | undefined): string {
    return value && value.trim() !== "" ? value : "Nada informado";
}

// Função para formatar tipos e enums
function formatarTipoSolicitacao(tipo: string | undefined): string {
    if (!tipo) return "-";
    const tipos: { [key: string]: string } = {
        primeira: "Primeira Isenção",
        renovacao: "Renovação de Isenção",
        revisao: "Revisão de Isenção",
    };
    return tipos[tipo] || tipo;
}

function formatarPerfilRequerente(perfil: string | undefined): string {
    if (!perfil) return "-";
    const perfis: { [key: string]: string } = {
        requerente: "Requerente",
        conjuge: "Cônjuge",
        ambos: "Ambos",
    };
    const mapped = perfis[perfil?.toLowerCase()];
    return mapped || (perfil.charAt(0).toUpperCase() + perfil.slice(1).toLowerCase());
}

function formatarEstadoCivil(estado: string | undefined): string {
    if (!estado) return "-";
    const estados: { [key: string]: string } = {
        solteiro: "Solteiro(a)",
        casado: "Casado(a)",
        divorciado: "Divorciado(a)",
        viuvo: "Viúvo(a)",
        "uniao-estavel": "União Estável",
    };
    const mapped = estados[estado];
    return mapped || (estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase());
}

function formatarOrigemRenda(origem: string | undefined): string {
    if (!origem) return "-";
    const origens: { [key: string]: string } = {
        aposentadoria: "Aposentadoria",
        pensao: "Pensão",
        beneficio: "Benefício Social",
        trabalho: "Trabalho",
        outro: "Outro",
    };
    const mapped = origens[origem];
    return mapped || (origem.charAt(0).toUpperCase() + origem.slice(1).toLowerCase());
}

function formatarFormasContato(
    preferenciaAR?: boolean,
    preferenciaWhatsapp?: boolean,
    preferenciaEmail?: boolean
): string {
    const contatos: string[] = [];
    if (preferenciaAR) contatos.push("Carta de Recebimento (AR)");
    if (preferenciaWhatsapp) contatos.push("WhatsApp");
    if (preferenciaEmail) contatos.push("E-mail");
    return contatos.length > 0 ? contatos.join(", ") : "-";
}

// Função para gerar o HTML do PDF
function generatePdfHtml(data: IdosoFormData): string {
    const logoPath = path.join(process.cwd(), "public", "assets", "brasao-vertical.png");
    const logoBase64 = fs.existsSync(logoPath)
        ? `data:image/png;base64,${fs.readFileSync(logoPath).toString("base64")}`
        : "";

    const dataEnvio = data.createdAt ? new Date(data.createdAt) : new Date();
    const dataFormatada = dataEnvio.toLocaleDateString("pt-BR");
    const horaFormatada = dataEnvio.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Requerimento de Isenção - Idoso</title>
  <style>
    @page {
      margin: 15mm;
      size: A4;
    }
    
    body {
      font-family: 'Arial', sans-serif;
      font-size: 11px;
      line-height: 1.3;
      color: #000;
      margin: 0;
      padding: 0;
      padding-bottom: 40px;
    }
    
    .header {
      display: flex;
      align-items: center;
      border-bottom: 3px solid #2b2862;
      padding-bottom: 12px;
      margin-bottom: 15px;
    }
    
    .header img {
      width: 70px;
      height: auto;
      margin-right: 20px;
      flex-shrink: 0;
    }
    
    .header-text {
      flex: 1;
      text-align: left;
    }
    
    .header-text h3 {
      margin: 2px 0;
      font-size: 12px;
      font-weight: bold;
      color: #2b2862;
      letter-spacing: 0.5px;
      line-height: 1.1;
    }

            .declaration-section {
          border: 1.5px solid #2b2862;
          border-radius: 6px;
          padding: 16px 18px 12px 18px;
          margin: 18px 0 10px 0;
          background: #f7f7fb;
          font-size: 11px;
          color: #222;
        }
        .declaration-title {
          font-size: 13px;
          font-weight: bold;
          color: #2b2862;
          margin-bottom: 7px;
          text-align: left;
          letter-spacing: 0.5px;
        }
        .declaration-text {
          font-size: 11px;
          margin-bottom: 10px;
          color: #222;
          font-style: italic;
        }
        .declaration-info {
          margin-bottom: 8px;
        }
        .declaration-item {
          margin-bottom: 2px;
        }
        .declaration-label {
          font-weight: bold;
          color: #2b2862;
          margin-right: 4px;
          font-size: 10px;
          text-transform: uppercase;
        }
        .declaration-value {
          color: #222;
          font-size: 10px;
        }
        .declaration-footer {
          font-size: 10px;
          color: #444;
          margin-top: 8px;
          text-align: left;
        }

    
    .section {
      margin-bottom: 12px;
      page-break-inside: avoid;
    }
    
    .section-title {
      background: #2b2862;
      color: white;
      padding: 6px 10px;
      font-weight: bold;
      font-size: 11px;
      margin-bottom: 8px;
      border-radius: 3px;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 15px;
      margin-bottom: 8px;
    }
    
    .info-item {
      border-bottom: 1px solid #ddd;
      padding-bottom: 4px;
    }
    
    .info-label {
      font-weight: bold;
      font-size: 9px;
      color: #2b2862;
      margin-bottom: 2px;
      text-transform: uppercase;
    }
    
    .info-value {
      font-size: 10px;
      color: #333;
      margin-top: 2px;
      word-wrap: break-word;
    }
    
    .full-width {
      grid-column: 1 / -1;
    }

    .bool-value {
      font-size: 10px;
      color: #333;
      font-weight: 500;
    }

    .sim {
      color: #28a745;
    }

    .nao {
      color: #dc3545;
    }
    
    .page-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 35px;
      border-top: 1px solid #d0d0d0;
      padding: 5px 15mm;
      font-size: 8px;
      color: #666;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      line-height: 1.2;
      background: #f9f9f9;
    }
    
    @media print {
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
      .page-footer {
        position: fixed;
        bottom: 0;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    ${logoBase64 ? `<img src="${logoBase64}" alt="Prefeitura">` : ""}
    <div class="header-text">
      <h3>Prefeitura Municipal de Nova Iguaçu</h3>
      <h3>Estado do Rio de Janeiro</h3>
      <h3>Requerimento Digital de Isenção - Idoso</h3>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Tipo de Solicitação</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Tipo de Solicitação</div>
        <div class="info-value">${formatarTipoSolicitacao(data.tipoSolicitacao)}</div>
      </div>
      ${data.tipoSolicitacao === 'renovacao' ? `
      <div class="info-item">
        <div class="info-label">Processo Anterior</div>
        <div class="info-value">${formatValueOptional(data.processoAnterior)}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Certidão Anterior</div>
        <div class="info-value">${formatValueOptional(data.certidaoAnterior)}</div>
      </div>
      ` : ''}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Dados do Contribuinte</div>
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
        <div class="info-value bool-value"><span class="${data.unicoImovel ? 'sim' : 'nao'}">${data.unicoImovel ? 'Sim' : 'Não'}</span></div>
      </div>
      <div class="info-item">
        <div class="info-label">É Residência Própria?</div>
        <div class="info-value bool-value"><span class="${data.residenciaPropria ? 'sim' : 'nao'}">${data.residenciaPropria ? 'Sim' : 'Não'}</span></div>
      </div>
      <div class="info-item">
        <div class="info-label">Ano de Início de Residência</div>
        <div class="info-value">${formatValueOptional(data.anoInicio)}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Renda até 2 Salários Mínimos?</div>
        <div class="info-value bool-value"><span class="${data.rendaAte2Salarios ? 'sim' : 'nao'}">${data.rendaAte2Salarios ? 'Sim' : 'Não'}</span></div>
      </div>
      <div class="info-item">
        <div class="info-label">Origem da Renda</div>
        <div class="info-value">${formatarOrigemRenda(data.origemRenda)}</div>
      </div>
      ${data.origemRenda === 'outro' ? `
      <div class="info-item">
        <div class="info-label">Outra Origem da Renda</div>
        <div class="info-value">${formatValueOptional(data.origemRendaOutro)}</div>
      </div>
      ` : ''}
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
        <div class="info-label">É Coproprietário?</div>
        <div class="info-value bool-value"><span class="${data.coproprietario ? 'sim' : 'nao'}">${data.coproprietario ? 'Sim' : 'Não'}</span></div>
      </div>
      <div class="info-item">
        <div class="info-label">Origem da Renda</div>
        <div class="info-value">${formatarOrigemRenda(data.origemRendaConjuge)}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Identificação do Procurador</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Possui Procurador?</div>
        <div class="info-value bool-value"><span class="${data.possuiProcurador ? 'sim' : 'nao'}">${data.possuiProcurador ? 'Sim' : 'Não'}</span></div>
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
    <div class="section-title">Testemunhas (Assinatura a Rogo)</div>
    <div class="info-grid" style="margin-bottom: 8px;">
      <div class="info-item">
        <div class="info-label">Assinatura a Rogo?</div>
        <div class="info-value bool-value"><span class="${data.assinaturaRogo ? 'sim' : 'nao'}">${data.assinaturaRogo ? 'Sim' : 'Não'}</span></div>
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

  <div class="section">
    <div class="section-title">Formas de Contato</div>
    <div class="info-grid">
      <div class="info-item full-width">
        <div class="info-label">Formas de Contato Preferidas</div>
        <div class="info-value">${formatarFormasContato(data.preferenciaAR, data.preferenciaWhatsapp, data.preferenciaEmail)}</div>
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

  <div class="declaration-section">
    <div class="declaration-title">Declaração de Concordância Eletrônica</div>
    <div class="declaration-text">
      "Declaro, sob as penas da lei, que as informações prestadas neste requerimento são verdadeiras e de minha inteira responsabilidade."
    </div>
    <div class="declaration-info">
      <div class="declaration-item">
        <span class="declaration-label">DATA E HORA:</span>
        <span class="declaration-value">${data.createdAt
            ? new Date(data.createdAt).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            })
            : "-"
        }</span>
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

// Gerador de PDF principal
export async function generatePDF(data: IdosoFormData): Promise<Buffer> {
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

// Função principal para gerar o PDF do requerimento
export async function generateRequerimentoPdf(
    data: IdosoFormData
): Promise<Buffer> {
    return generatePDF(data);
}
