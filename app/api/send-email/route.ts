import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

// Configuração do transporter usando Gmail/Google Workspace
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Data e hora
    const dataEnvio = new Date();
    const dataFormatada = dataEnvio.toLocaleDateString("pt-BR");
    const horaFormatada = dataEnvio.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // URL base para os botões
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Preparar caminhos e checar existência de logo WebP e PNG
    const logoWebpPath = path.join(process.cwd(), "public", "assets", "logo.webp");
    const logoPngPath = path.join(process.cwd(), "public", "assets", "logo.png");
    const hasWebp = fs.existsSync(logoWebpPath);
    const hasPng = fs.existsSync(logoPngPath);
    const logoWebpCid = hasWebp ? `logo-webp-${Date.now()}@requerimento` : null;
    const logoPngCid = hasPng ? `logo-png-${Date.now()}@requerimento` : null;

    // Não usar data URI inline (alguns clientes bloqueiam); usar CID attachments
    const htmlBody = montarCorpoEmail(data, null, logoWebpCid, logoPngCid, baseUrl, dataFormatada, horaFormatada);

    // Assunto do e-mail
    const assunto = `Novo Requerimento: ${data.nome || "Solicitação"} - ${data.tipoFormulario || "Isenção/Imunidade"} | ${dataFormatada} ${horaFormatada}`;

    // Configurar e enviar o e-mail
    const attachments: any[] = [];
    if (hasWebp) {
      attachments.push({ filename: "logo.webp", path: logoWebpPath, cid: logoWebpCid, contentDisposition: "inline" });
    }
    if (hasPng) {
      attachments.push({ filename: "logo.png", path: logoPngPath, cid: logoPngCid, contentDisposition: "inline" });
    }

    const mailOptions: any = {
      from: `"Requerimento Isenção/Imunidade" <${process.env.GMAIL_USER || ""}>`,
      to: process.env.EMAIL_DESTINO || process.env.GMAIL_USER,
      subject: assunto,
      html: htmlBody,
      attachments,
    };

    console.log("Enviando e-mail...");
    const info = await transporter.sendMail(mailOptions);
    console.log("E-mail enviado com sucesso:", info?.messageId);

    return NextResponse.json(
      { success: true, message: "E-mail enviado com sucesso!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao enviar e-mail", error: String(error) },
      { status: 500 }
    );
  }
}

// Função auxiliar para formatar valor ou retornar traços
function formatValue(value: string | null | undefined): string {
  return value && value.trim() !== "" ? value : "-----";
}

// Função auxiliar para formatar valor opcional (exibe "Nada informado" com opacidade)
function formatValueOptional(value: string | null | undefined): string {
  return value && value.trim() !== "" 
    ? value 
    : '<span style="color: #999; font-style: italic;">Nada informado</span>';
}

// Função auxiliar para status de anexo simples
function formatAttachmentStatusSimple(url: string | null | undefined | boolean): string {
  return url
    ? '<span style="color: #28a745;">✅ Anexado</span>'
    : '<span style="color: #d32f2f;">❌ Não anexado</span>';
}

// Função auxiliar para formatar formas de contato
function formatFormasContato(formasContato: string[]): string {
  if (!formasContato || formasContato.length === 0) return "-----";
  const labels: Record<string, string> = {
    preferenciaAR: "Carta de Recebimento (AR)",
    preferenciaEmail: "E-mail",
    preferenciaWhatsapp: "WhatsApp",
  };
  // Separar as opções com espaço extra para evitar confusão visual
  return formasContato.map((c: string) => labels[c] || c).join('&nbsp;&nbsp;&nbsp;');
}

// Função para gerar lista de documentos anexados
function generateDocumentsList(data: any, baseUrl: string): string {
  // Lista fixa de documentos esperados para o formulário de idoso
  const documentosEsperados = [
    "Certidão de Nascimento/Casamento",
    "Comprovante de pagamento das taxas",
    "RG e CPF",
    "Comprovante de residência",
    "Comprovante de rendimentos",
    "Escritura do imóvel",
    "Declaração de único imóvel",
    "Ficha de inscrição do IPTU",
    "Procuração Autenticada",
    "CPF do Procurador",
    "Identidade do Procurador",
    "Petição",
  ];

  // Array de documentos realmente anexados
  const documentosAnexados = data.documentosAnexados || [];

  // Monta a lista de documentos com status
  const lista = documentosEsperados
    .map((nomeDoc, index) => {
      const anexado = documentosAnexados.includes(nomeDoc);
      return `
        <tr style="background-color: ${index % 2 === 0 ? '#f9f9f9' : '#ffffff'};">
          <td style="padding: 10px 15px; border-bottom: 1px solid #eee;">📄 ${nomeDoc}</td>
          <td style="padding: 10px 15px; border-bottom: 1px solid #eee; text-align: center;">
            ${formatAttachmentStatusSimple(anexado)}
          </td>
          <td style="padding: 10px 15px; border-bottom: 1px solid #eee; text-align: center;">
            ${anexado ? `<a href="#" style="display: inline-flex; justify-content: center; align-items: center; padding: 8px 16px; background: linear-gradient(135deg, #28245B 0%, #1a1a4e 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: 600; box-shadow: 0 2px 4px rgba(40, 36, 91, 0.3);" download>Baixar</a>` : '<span style="color: #999;">-</span>'}
          </td>
        </tr>
      `;
    })
    .join('');

  if (!lista) {
    return `
      <tr>
        <td colspan="3" style="padding: 12px; text-align: center; color: #666;">
          Nenhum documento foi anexado.
        </td>
      </tr>
    `;
  }
  return lista;
}

// Função para montar o corpo do e-mail em HTML
function montarCorpoEmail(
  data: any,
  logoInlineSrc: string | null,
  logoWebpCid: string | null,
  logoPngCid: string | null,
  baseUrl: string,
  dataFormatada: string,
  horaFormatada: string
): string {
  const { tipoFormulario } = data;

  // Formas de contato
  const formasContato = [];
  if (data.preferenciaAR) formasContato.push("preferenciaAR");
  if (data.preferenciaWhatsapp) formasContato.push("preferenciaWhatsapp");
  if (data.preferenciaEmail) formasContato.push("preferenciaEmail");

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="700" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          
          <!-- HEADER -->
          <tr>
            <td style="background: linear-gradient(135deg, #2b2862 0%, #1a1a4e 100%); padding: 30px; text-align: center;">
              ${(() => {
                if (logoInlineSrc) {
                  return `<img src="${logoInlineSrc}" alt="Prefeitura" width="120" style="display:block; width:120px; height:auto; margin:0 auto 15px;">`;
                }
                const displayCid = logoPngCid || logoWebpCid;
                if (displayCid) {
                  return `<img src="cid:${displayCid}" alt="Prefeitura" width="120" style="display:block; width:120px; height:auto; margin:0 auto 15px;">`;
                }
                return `<div style="color:#ffffff; font-weight:600; margin-bottom:15px;">Prefeitura</div>`;
              })()}
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">
                ${tipoFormulario || "Requerimento de Isenção/Imunidade"}
              </h1>
              <p style="color: #c5c5e0; margin: 10px 0 0 0; font-size: 14px;">
                Um novo requerimento foi recebido através do sistema online.
              </p>
            </td>
          </tr>

          <!-- BLOCO DE BOTÕES E INFO -->
          <tr>
            <td style="padding: 25px 30px; background: #f8f9fa;">
              <div style="margin-bottom: 20px;">
                <h3 style="color: #2b2862; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
                  Documentos Prontos para Anexar ao Processo
                </h3>
                <div style="margin-bottom: 15px;">
                  <a href="${baseUrl}/api/generate-pdf?data=${encodeURIComponent(JSON.stringify(data))}" style="display: inline-block; margin-right: 10px; margin-bottom: 10px; padding: 12px 24px; background: #28d160; color: #fff; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;">
                    BAIXAR REQUERIMENTO
                  </a>
                  <a href="${baseUrl}/api/download-zip?id=${data.id}" style="display: inline-block; margin-bottom: 10px; padding: 12px 24px; background: #ff6b00; color: #fff; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;">
                    BAIXAR DOCUMENTOS ANEXADOS (ZIP)
                  </a>
                </div>
                <div style="font-size: 13px; color: #555; background: #fffbe6; border-radius: 6px; padding: 12px; border-left: 4px solid #ffc107;">
                  <strong>Como usar:</strong> Clique em "Baixar Requerimento" para gerar o PDF do seu requerimento ou em "Baixar Documentos Anexados" para baixar todos os documentos em um arquivo ZIP.
                </div>
              </div>
            </td>
          </tr>

          <!-- INFO DE RECEBIMENTO -->
          <tr>
            <td style="padding: 15px 30px; border-top: 1px solid #eee; border-bottom: 1px solid #eee;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                <strong>Recebido em:</strong> ${dataFormatada} às ${horaFormatada}
              </p>
            </td>
          </tr>

          <!-- SEÇÃO: TAXA DE PAGAMENTO -->
          <tr>
            <td style="padding: 25px 30px;">
                <h2 style="color: #2b2862; font-size: 16px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #2b2862; display: flex; align-items: center;">
                Taxa de Pagamento
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #ddd; border-radius: 6px; overflow: hidden;">
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Guia de Pagamento</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd; text-align: right;">${data.possuiGuiaTaxa ? '<span style="color: #28a745;">✅ Anexado</span>' : '<span style="color: #dc3545;">❌ Não anexado</span>'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 15px; font-weight: 600;">Comprovante de Pagamento</td>
                  <td style="padding: 10px 15px; text-align: right;">${data.possuiComprovanteTaxa ? '<span style="color: #28a745;">✅ Anexado</span>' : '<span style="color: #dc3545;">❌ Não anexado</span>'}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- SEÇÃO: DADOS DO CONTRIBUINTE -->
          <tr>
            <td style="padding: 0 30px 25px 30px;">
                <h2 style="color: #2b2862; font-size: 16px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #2b2862;">
                Dados do Contribuinte
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #ddd; border-radius: 6px; overflow: hidden;">
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Nome do Processo</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValue(formatarTipoSolicitacao(data.tipoSolicitacao))}</td>
                </tr>
                ${data.tipoSolicitacao === 'renovacao' ? `
                <tr>
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Processo Anterior</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValueOptional(data.processoAnterior)}</td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Certidão Anterior</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValueOptional(data.certidaoAnterior)}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Nome Completo</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValue(data.nome)}</td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">CPF/CNPJ</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValue(data.cpf)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Identidade</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValueOptional(data.rg)}</td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Órgão Expedidor</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValueOptional(data.orgaoEmissor)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">E-mail</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValue(data.email)}</td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Telefone</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValue(data.telefone)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">CEP</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValue(data.cep)}</td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Endereço</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValue(data.rua)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Número</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValue(data.numero)}</td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Complemento</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValueOptional(data.complemento)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Bairro</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValue(data.bairro)}</td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Cidade</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValue(data.cidade)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 15px; font-weight: 600;">Estado</td>
                  <td style="padding: 10px 15px;">${formatValue(data.estado)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- SEÇÃO: DADOS DO PROCURADOR -->
          <tr>
            <td style="padding: 0 30px 25px 30px;">
              <h2 style="color: #2b2862; font-size: 16px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #2b2862;">
                Identificação do Procurador
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #ddd; border-radius: 6px; overflow: hidden;">
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Possui Procurador?</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${data.possuiProcurador ? 'Sim' : 'Não'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Nome do Procurador</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValueOptional(data.nomeProcurador)}</td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">CPF do Procurador</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValueOptional(data.cpfProcurador)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">RG do Procurador</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValueOptional(data.rgProcurador)}</td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Órgão Emissor</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValueOptional(data.orgaoEmissorProcurador)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">E-mail do Procurador</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValueOptional(data.emailProcurador)}</td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px 15px; font-weight: 600;">Telefone do Procurador</td>
                  <td style="padding: 10px 15px;">${formatValueOptional(data.telefoneProcurador)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- SEÇÃO: IDENTIFICAÇÃO DO IMÓVEL -->
          <tr>
            <td style="padding: 0 30px 25px 30px;">
                <h2 style="color: #2b2862; font-size: 16px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #2b2862;">
                Identificação do Imóvel
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #ddd; border-radius: 6px; overflow: hidden;">
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Inscrição Imobiliária</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValue(data.inscricaoImobiliaria)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">CEP</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValue(data.cep)}</td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Endereço</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValue(data.rua)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Número</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValue(data.numero)}</td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Complemento</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValueOptional(data.complemento)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Bairro</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValue(data.bairro)}</td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Cidade</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValue(data.cidade)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Estado</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValue(data.estado)}</td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Lote</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValueOptional(data.lote)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 15px; font-weight: 600;">Quadra</td>
                  <td style="padding: 10px 15px;">${formatValueOptional(data.quadra)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- SEÇÃO: QUESTIONÁRIO DE ELEGIBILIDADE -->
          <tr>
            <td style="padding: 0 30px 25px 30px;">
                <h2 style="color: #2b2862; font-size: 16px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #2b2862;">
                Questionário de Elegibilidade
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #ddd; border-radius: 6px; overflow: hidden;">
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Perfil do Requerente</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValue(formatarPerfilRequerente(data.perfilRequerente))}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Estado Civil</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValue(formatarEstadoCivil(data.estadoCivil))}</td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">É único imóvel?</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${data.unicoImovel ? 'Sim' : 'Não'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">É residência própria?</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${data.residenciaPropria ? 'Sim' : 'Não'}</td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Ano de Início de Residência</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValueOptional(data.anoInicio)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Renda até 2 Salários Mínimos?</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${data.rendaAte2Salarios ? 'Sim' : 'Não'}</td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px 15px; font-weight: 600; ${data.origemRenda === 'outro' ? 'border-bottom: 1px solid #ddd;' : ''}">Origem da Renda</td>
                  <td style="padding: 10px 15px; ${data.origemRenda === 'outro' ? 'border-bottom: 1px solid #ddd;' : ''}">${formatValue(formatarOrigemRenda(data.origemRenda))}</td>
                </tr>
                ${data.origemRenda === 'outro' ? `
                <tr>
                  <td style="padding: 10px 15px; font-weight: 600;">Outra Origem da Renda (Especificar)</td>
                  <td style="padding: 10px 15px;">${formatValueOptional(data.origemRendaOutro)}</td>
                </tr>
                ` : ''}
              </table>
              
              ${data.nomeConjuge ? `
              <h3 style="color: #2b2862; font-size: 15px; margin: 20px 0 15px 0; padding-bottom: 8px; border-bottom: 1px solid #ccc;">
                Dados do Cônjuge
              </h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #ddd; border-radius: 6px; overflow: hidden;">
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Nome do Cônjuge</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValueOptional(data.nomeConjuge)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">CPF</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValueOptional(data.cpfConjuge)}</td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">RG</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValueOptional(data.rgConjuge)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Telefone</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValueOptional(data.telefoneConjuge)}</td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">E-mail</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValueOptional(data.emailConjuge)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">É coproprietário?</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${data.coproprietario ? 'Sim' : 'Não'}</td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px 15px; font-weight: 600;">Origem da Renda</td>
                  <td style="padding: 10px 15px;">${formatValue(formatarOrigemRenda(data.origemRendaConjuge))}</td>
                </tr>
              </table>
              ` : ''}
            </td>
          </tr>

          <!-- SEÇÃO: TESTEMUNHAS (ASSINATURA A ROGO) -->
          <tr>
            <td style="padding: 0 30px 25px 30px;">
              <h2 style="color: #2b2862; font-size: 16px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #2b2862;">
                Testemunhas (Assinatura a Rogo)
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #ddd; border-radius: 6px; overflow: hidden; margin-bottom: 20px;">
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Assinatura a Rogo?</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${data.assinaturaRogo ? 'Sim' : 'Não'}</td>
                </tr>
              </table>
              
              <h3 style="color: #2b2862; font-size: 14px; margin: 0 0 10px 0; font-weight: 600;">Testemunha 1</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #ddd; border-radius: 6px; overflow: hidden; margin-bottom: 20px;">
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Nome</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValueOptional(data.testemunha1Nome)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">CPF</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValueOptional(data.testemunha1Cpf)}</td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">RG</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValueOptional(data.testemunha1Rg)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Órgão Emissor</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValueOptional(data.testemunha1OrgaoEmissor)}</td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Telefone</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValueOptional(data.testemunha1Telefone)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 15px; font-weight: 600;">E-mail</td>
                  <td style="padding: 10px 15px;">${formatValueOptional(data.testemunha1Email)}</td>
                </tr>
              </table>
              
              <h3 style="color: #2b2862; font-size: 14px; margin: 0 0 10px 0; font-weight: 600;">Testemunha 2</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #ddd; border-radius: 6px; overflow: hidden;">
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Nome</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValueOptional(data.testemunha2Nome)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">CPF</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValueOptional(data.testemunha2Cpf)}</td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">RG</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValueOptional(data.testemunha2Rg)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Órgão Emissor</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValueOptional(data.testemunha2OrgaoEmissor)}</td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #ddd;">Telefone</td>
                  <td style="padding: 10px 15px; border-bottom: 1px solid #ddd;">${formatValueOptional(data.testemunha2Telefone)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 15px; font-weight: 600;">E-mail</td>
                  <td style="padding: 10px 15px;">${formatValueOptional(data.testemunha2Email)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- SEÇÃO: DOCUMENTAÇÃO -->
          <tr>
            <td style="padding: 0 30px 25px 30px;">
              <h2 style="color: #2b2862; font-size: 16px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #2b2862;">
                Documentação
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #ddd; border-radius: 6px; overflow: hidden;">
                <tr style="background-color: #2b2862;">
                  <td style="padding: 10px 15px; font-weight: 600; color: #ffffff;">Nome do Documento</td>
                  <td style="padding: 10px 15px; font-weight: 600; color: #ffffff; text-align: center;">Status</td>
                  <td style="padding: 10px 15px; font-weight: 600; color: #ffffff; text-align: center;">Ação</td>
                </tr>
                ${generateDocumentsList(data, baseUrl)}
              </table>
            </td>
          </tr>

          <!-- SEÇÃO: FORMAS DE CONTATO -->
          <tr>
            <td style="padding: 0 30px 25px 30px;">
              <h2 style="color: #2b2862; font-size: 16px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #2b2862;">
                <span style="margin-right: 8px;">📞</span> Formas de Contato
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #ddd; border-radius: 6px; overflow: hidden;">
                <tr style="background-color: #f9f9f9;">
                  <td style="padding: 10px 15px; font-weight: 600;">Formas de Contato Preferidas</td>
                  <td style="padding: 10px 15px;">${formatFormasContato(formasContato)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- SEÇÃO: OBSERVAÇÕES -->
          <tr>
            <td style="padding: 0 30px 25px 30px;">
              <h2 style="color: #2b2862; font-size: 16px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #2b2862;">
                <span style="margin-right: 8px;">📝</span> Observações
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #ddd; border-radius: 6px; overflow: hidden;">
                <tr>
                  <td style="padding: 10px 15px; background-color: #f9f9f9;">${formatValueOptional(data.observacoes)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- RESUMO DE DOCUMENTOS ANEXADOS -->
          <tr>
            <td style="padding: 0 30px 25px 30px;">
              <h2 style="color: #2b2862; font-size: 16px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #2b2862;">
                <span style="margin-right: 8px;">📋</span> Resumo de Documentos Anexados
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #ddd; border-radius: 6px; overflow: hidden;">
                <tr style="background-color: #2b2862;">
                  <td style="padding: 10px 15px; font-weight: 600; color: #ffffff;">Nome do Documento</td>
                  <td style="padding: 10px 15px; font-weight: 600; color: #ffffff; text-align: center;">Status</td>
                  <td style="padding: 10px 15px; font-weight: 600; color: #ffffff; text-align: center;">Ação</td>
                </tr>
                ${generateDocumentsList(data, baseUrl)}
              </table>
            </td>
          </tr>

          <!-- RODAPÉ -->
          <tr>
            <td style="background-color: #2b2862; padding: 20px 30px; text-align: center;">
              <p style="color: #ffffff; margin: 0; font-size: 14px; line-height: 1.6;">
                <strong>Requerimento Digital de Isenção e Imunidade</strong><br>
                Prefeitura Municipal de Nova Iguaçu<br>
                Rua Athaide Pimenta de Moraes, 528 - Centro, Nova Iguaçu, Rio de Janeiro - CEP: 26.210-190<br>
              </p>
              <p style="color: #c5c5e0; margin: 15px 0 0 0; font-size: 12px;">
                Este é um e-mail automático. Por favor, não responda.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Funções auxiliares para formatação
function formatarTipoSolicitacao(tipo: string): string {
  if (!tipo) return "-----";
  const tipos: { [key: string]: string } = {
    primeira: "Primeira Isenção",
    renovacao: "Renovação de Isenção",
    revisao: "Revisão de Isenção",
  };
  return tipos[tipo] || tipo;
}

function formatarPerfilRequerente(perfil: string): string {
  if (!perfil) return "-----";
  const perfis: { [key: string]: string } = {
    requerente: "Requerente",
    conjuge: "Cônjuge",
    ambos: "Ambos",
  };
  const mapped = perfis[perfil?.toLowerCase()];
  return mapped || (perfil.charAt(0).toUpperCase() + perfil.slice(1).toLowerCase());
}

function formatarEstadoCivil(estado: string): string {
  if (!estado) return "-----";
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

function formatarOrigemRenda(origem: string): string {
  if (!origem) return "-----";
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
