import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Configurar o transporter do Nodemailer com Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Carregar logo local e otimizar antes de enviar como anexo com CID
    const logoPath = path.join(process.cwd(), "public", "assets", "logo.png");
    let logoCid: string | null = null;
    let logoBuffer: Buffer | null = null;
    let logoFilename = "logo.png";
    try {
      const originalBuffer = fs.readFileSync(logoPath);
      console.log(`Logo original carregada: ${logoPath} (${originalBuffer.length} bytes)`);

      try {
        const optimizedBuffer = await sharp(originalBuffer)
          .resize({ width: 300 })
          .png({ compression: 9 })
          .toBuffer();

        logoBuffer = optimizedBuffer;
        logoFilename = "logo.png";
        console.log(`Logo otimizada gerada: ${logoFilename} (${logoBuffer.length} bytes)`);
      } catch (optErr) {
        console.warn("Falha na otimização da logo, usando original:", optErr?.message || optErr);
        logoBuffer = originalBuffer;
      }

      logoCid = "logo_requerimento_novaiguacu";
    } catch (error) {
      console.error("Erro ao carregar logo:", error);
    }

    // Montar o corpo do e-mail em HTML (passa o CID, não base64)
    const htmlBody = montarCorpoEmail(data, logoCid);

    // Configurar as opções do e-mail
    const mailOptions: any = {
      from: process.env.GMAIL_USER,
      to: process.env.EMAIL_DESTINO || process.env.GMAIL_USER,
      subject: `Novo Requerimento - ${data.tipoFormulario || "Solicitação"}`,
      html: htmlBody,
    };

    if (logoBuffer && logoCid) {
      mailOptions.attachments = [
        {
          filename: logoFilename,
          content: logoBuffer,
          cid: logoCid,
          contentDisposition: "inline",
        },
      ];
      console.log(`Attachment preparado: cid=${logoCid}, filename=${logoFilename}, tamanho=${logoBuffer.length}`);
    }

    // Enviar o e-mail
    console.log("Enviando e-mail... attachments=", mailOptions.attachments ? mailOptions.attachments.length : 0);
    const info = await transporter.sendMail(mailOptions);
    console.log("E-mail enviado, messageId=", info && info.messageId ? info.messageId : JSON.stringify(info));

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

// Função para montar o corpo do e-mail em HTML
function montarCorpoEmail(data: any, logoCid: string | null): string {
  const { tipoFormulario } = data;

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 700px;
          margin: 0 auto;
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #2E3B6B 0%, #3d4d7a 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
          position: relative;
        }
        .header-logo {
          width: 180px;
          height: auto;
          margin-bottom: 20px;
        }
        .header h1 {
          margin: 0 0 10px 0;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .header p {
          margin: 0;
          font-size: 14px;
          opacity: 0.95;
          font-weight: 300;
        }
        .info-bar {
          background-color: #2E3B6B;
          color: white;
          padding: 15px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
        }
        .info-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .info-icon {
          font-size: 16px;
        }
        .content {
          padding: 30px;
          background-color: #fafafa;
        }
        .section {
          background-color: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .section-title {
          color: #2E3B6B;
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 18px;
          padding-bottom: 12px;
          border-bottom: 2px solid #2E3B6B;
          display: flex;
          align-items: center;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .section-title-icon {
          margin-right: 10px;
          font-size: 18px;
        }
        .data-row {
          display: flex;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .data-row:last-child {
          border-bottom: none;
        }
        .data-label {
          font-weight: 600;
          color: #555;
          min-width: 220px;
          flex-shrink: 0;
          font-size: 14px;
        }
        .data-value {
          color: #333;
          word-break: break-word;
          font-size: 14px;
        }
        .status-anexado {
          color: #28a745;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }
        .status-nao-anexado {
          color: #dc3545;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }
        .footer {
          background: linear-gradient(135deg, #2E3B6B 0%, #3d4d7a 100%);
          color: white;
          padding: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
        }
        .footer-left {
          text-align: left;
          flex: 1;
        }
        .footer-right {
          text-align: right;
        }
        .footer-logo {
          width: 120px;
          height: auto;
        }
        .footer p {
          margin: 5px 0;
          line-height: 1.6;
        }
        .footer strong {
          font-size: 14px;
          display: block;
          margin-bottom: 10px;
        }
        .document-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .document-item {
          padding: 12px 15px;
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
          margin-bottom: 8px;
          border-radius: 6px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background-color 0.2s;
        }
        .document-item:hover {
          background-color: #e9ecef;
        }
        .document-name {
          font-weight: 500;
          color: #2E3B6B;
        }
        .buttons {
          background-color: white;
          padding: 20px 30px;
          text-align: center;
          border-bottom: 1px solid #e0e0e0;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          margin: 0 8px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s;
        }
        .button-primary {
          background-color: #28a745;
          color: white;
        }
        .button-secondary {
          background-color: #ffc107;
          color: #333;
        }
        .alert-box {
          background-color: #fff3cd;
          border: 1px solid #ffc107;
          border-left: 4px solid #ffc107;
          border-radius: 6px;
          padding: 15px;
          margin: 20px 30px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        .alert-icon {
          font-size: 20px;
          margin-top: 2px;
        }
        .alert-text {
          font-size: 13px;
          color: #856404;
          line-height: 1.5;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          ${logoCid ? `<img src="cid:${logoCid}" alt="Prefeitura de Nova Iguaçu" class="header-logo" />` : ''}
          <h1>${tipoFormulario || "Requerimento Geral de Processos"}</h1>
          <p>Um novo requerimento foi recebido através do sistema online.</p>
        </div>
        
        <div class="alert-box">
          <span class="alert-icon"><LightbulbIcon /></span>
          <div class="alert-text">
            <strong>Como usar:</strong> Clique em "Baixar Requerimento" para abrir o documento formatado no navegador e salvar como PDF (Ctrl+P). Use "Baixar Documentos Anexados" para visualizar os arquivos do processo.
          </div>
        </div>
        <div class="content">
  `;

  // Seção de Taxa de Pagamento
  if (data.possuiGuiaTaxa !== undefined || data.possuiComprovanteTaxa !== undefined) {
    html += `
      <div class="section">
        <div class="section-title"><span class="section-title-icon">💳</span> Taxa de Pagamento</div>
        <div class="data-row">
          <span class="data-label">Guia de Pagamento</span>
          <span class="${data.possuiGuiaTaxa ? 'status-anexado' : 'status-nao-anexado'}">
            ${data.possuiGuiaTaxa ? '✓ Anexado' : '✗ Não anexado'}
          </span>
        </div>
        <div class="data-row">
          <span class="data-label">Comprovante de Pagamento</span>
          <span class="${data.possuiComprovanteTaxa ? 'status-anexado' : 'status-nao-anexado'}">
            ${data.possuiComprovanteTaxa ? '✓ Anexado' : '✗ Não anexado'}
          </span>
        </div>
      </div>
    `;
  }

  // Seção 1: Dados do Requerente
  html += `
    <div class="section">
      <div class="section-title"><span class="section-title-icon">👤</span> Dados do Contribuinte</div>
  `;

  html += `<div class="data-row"><span class="data-label">Tipo de Solicitação:</span><span class="data-value">${data.tipoSolicitacao ? formatarTipoSolicitacao(data.tipoSolicitacao) : "----------"}</span></div>`;
  html += `<div class="data-row"><span class="data-label">Processo Anterior:</span><span class="data-value">${formatarValor(data.processoAnterior)}</span></div>`;
  html += `<div class="data-row"><span class="data-label">Certidão Anterior:</span><span class="data-value">${formatarValor(data.certidaoAnterior)}</span></div>`;
  html += `<div class="data-row"><span class="data-label">Nome:</span><span class="data-value">${formatarValor(data.nome)}</span></div>`;
  html += `<div class="data-row"><span class="data-label">CPF:</span><span class="data-value">${formatarValor(data.cpf)}</span></div>`;
  html += `<div class="data-row"><span class="data-label">RG:</span><span class="data-value">${formatarValor(data.rg)}</span></div>`;
  html += `<div class="data-row"><span class="data-label">Órgão Emissor:</span><span class="data-value">${formatarValor(data.orgaoEmissor)}</span></div>`;
  html += `<div class="data-row"><span class="data-label">Telefone:</span><span class="data-value">${formatarValor(data.telefone)}</span></div>`;
  html += `<div class="data-row"><span class="data-label">E-mail:</span><span class="data-value">${formatarValor(data.email)}</span></div>`;

  html += `</div>`;

  // Seção 2: Dados do Imóvel
  html += `
    <div class="section">
      <div class="section-title"><span class="section-title-icon">🏠</span> Dados do Imóvel</div>
  `;

  html += `<div class="data-row"><span class="data-label">Inscrição Imobiliária:</span><span class="data-value">${formatarValor(data.inscricaoImobiliaria)}</span></div>`;
  html += `<div class="data-row"><span class="data-label">Inscrição Mercantil:</span><span class="data-value">${formatarValor(data.inscricaoMercantil)}</span></div>`;
  html += `<div class="data-row"><span class="data-label">CEP:</span><span class="data-value">${formatarValor(data.cep)}</span></div>`;
  html += `<div class="data-row"><span class="data-label">Logradouro:</span><span class="data-value">${formatarValor(data.rua)}</span></div>`;
  html += `<div class="data-row"><span class="data-label">Número:</span><span class="data-value">${formatarValor(data.numero)}</span></div>`;
  html += `<div class="data-row"><span class="data-label">Complemento:</span><span class="data-value">${formatarValor(data.complemento)}</span></div>`;
  html += `<div class="data-row"><span class="data-label">Bairro:</span><span class="data-value">${formatarValor(data.bairro)}</span></div>`;
  html += `<div class="data-row"><span class="data-label">Cidade:</span><span class="data-value">${formatarValor(data.cidade)}</span></div>`;
  html += `<div class="data-row"><span class="data-label">Estado:</span><span class="data-value">${formatarValor(data.estado)}</span></div>`;
  html += `<div class="data-row"><span class="data-label">Lote:</span><span class="data-value">${formatarValor(data.lote)}</span></div>`;
  html += `<div class="data-row"><span class="data-label">Quadra:</span><span class="data-value">${formatarValor(data.quadra)}</span></div>`;

  html += `</div>`;

  // Seção 3: Questionário de Elegibilidade (para formulários de isenção)
  html += `
    <div class="section">
      <div class="section-title"><span class="section-title-icon">📋</span> Informações de Elegibilidade</div>
  `;

  html += `<div class="data-row"><span class="data-label">Perfil do Requerente:</span><span class="data-value">${data.perfilRequerente ? formatarPerfilRequerente(data.perfilRequerente) : "----------"}</span></div>`;
  html += `<div class="data-row"><span class="data-label">Estado Civil:</span><span class="data-value">${data.estadoCivil ? formatarEstadoCivil(data.estadoCivil) : "----------"}</span></div>`;
  html += `<div class="data-row"><span class="data-label">Único Imóvel:</span><span class="data-value">${formatarValor(data.unicoImovel)}</span></div>`;
  html += `<div class="data-row"><span class="data-label">Residência Própria:</span><span class="data-value">${formatarValor(data.residenciaPropria)}</span></div>`;
  html += `<div class="data-row"><span class="data-label">Ano de Início de Residência:</span><span class="data-value">${formatarValor(data.anoInicio)}</span></div>`;
  html += `<div class="data-row"><span class="data-label">Renda até 2 Salários Mínimos:</span><span class="data-value">${formatarValor(data.rendaAte2Salarios)}</span></div>`;
  html += `<div class="data-row"><span class="data-label">Origem da Renda:</span><span class="data-value">${data.origemRenda ? formatarOrigemRenda(data.origemRenda) : "----------"}</span></div>`;
  html += `<div class="data-row"><span class="data-label">Outra Origem da Renda:</span><span class="data-value">${formatarValor(data.origemRendaOutro)}</span></div>`;

  html += `</div>`;

  // Seção 4: Dados do Cônjuge
  html += `
    <div class="section">
      <div class="section-title"><span class="section-title-icon">👥</span> Dados do Cônjuge</div>
  `;

  html += `<div class="data-row"><span class="data-label">Nome:</span><span class="data-value">${formatarValor(data.nomeConjuge)}</span></div>`;
  html += `<div class="data-row"><span class="data-label">CPF:</span><span class="data-value">${formatarValor(data.cpfConjuge)}</span></div>`;
  html += `<div class="data-row"><span class="data-label">RG:</span><span class="data-value">${formatarValor(data.rgConjuge)}</span></div>`;
  html += `<div class="data-row"><span class="data-label">Telefone:</span><span class="data-value">${formatarValor(data.telefoneConjuge)}</span></div>`;
  html += `<div class="data-row"><span class="data-label">E-mail:</span><span class="data-value">${formatarValor(data.emailConjuge)}</span></div>`;
  html += `<div class="data-row"><span class="data-label">Coproprietário:</span><span class="data-value">${formatarValor(data.coproprietario)}</span></div>`;
  html += `<div class="data-row"><span class="data-label">Origem da Renda:</span><span class="data-value">${data.origemRendaConjuge ? formatarOrigemRenda(data.origemRendaConjuge) : "----------"}</span></div>`;

  html += `</div>`;

  // Seção 5: Dados do Procurador
  html += `
    <div class="section">
      <div class="section-title"><span class="section-title-icon">⚖️</span> Dados do Procurador</div>
  `;

  html += `<div class="data-row"><span class="data-label">Nome:</span><span class="data-value">${formatarValor(data.nomeProcurador)}</span></div>`;
  html += `<div class="data-row"><span class="data-label">CPF:</span><span class="data-value">${formatarValor(data.cpfProcurador)}</span></div>`;
  html += `<div class="data-row"><span class="data-label">RG:</span><span class="data-value">${formatarValor(data.rgProcurador)}</span></div>`;
  html += `<div class="data-row"><span class="data-label">Órgão Emissor:</span><span class="data-value">${formatarValor(data.orgaoEmissorProcurador)}</span></div>`;
  html += `<div class="data-row"><span class="data-label">Telefone:</span><span class="data-value">${formatarValor(data.telefoneProcurador)}</span></div>`;
  html += `<div class="data-row"><span class="data-label">E-mail:</span><span class="data-value">${formatarValor(data.emailProcurador)}</span></div>`;

  html += `</div>`;

  // Seção 6: Assinatura a Rogo
  html += `
    <div class="section">
      <div class="section-title"><span class="section-title-icon">✍️</span> Assinatura a Rogo</div>
  `;

  html += `
    <div style="margin-bottom: 15px;">
      <strong>Testemunha 1:</strong>
      <div class="data-row"><span class="data-label">Nome:</span><span class="data-value">${formatarValor(data.testemunha1Nome)}</span></div>
      <div class="data-row"><span class="data-label">CPF:</span><span class="data-value">${formatarValor(data.testemunha1Cpf)}</span></div>
      <div class="data-row"><span class="data-label">RG:</span><span class="data-value">${formatarValor(data.testemunha1Rg)}</span></div>
      <div class="data-row"><span class="data-label">Órgão Emissor:</span><span class="data-value">${formatarValor(data.testemunha1OrgaoEmissor)}</span></div>
      <div class="data-row"><span class="data-label">Telefone:</span><span class="data-value">${formatarValor(data.testemunha1Telefone)}</span></div>
      <div class="data-row"><span class="data-label">E-mail:</span><span class="data-value">${formatarValor(data.testemunha1Email)}</span></div>
    </div>
  `;

  html += `
    <div>
      <strong>Testemunha 2:</strong>
      <div class="data-row"><span class="data-label">Nome:</span><span class="data-value">${formatarValor(data.testemunha2Nome)}</span></div>
      <div class="data-row"><span class="data-label">CPF:</span><span class="data-value">${formatarValor(data.testemunha2Cpf)}</span></div>
      <div class="data-row"><span class="data-label">RG:</span><span class="data-value">${formatarValor(data.testemunha2Rg)}</span></div>
      <div class="data-row"><span class="data-label">Órgão Emissor:</span><span class="data-value">${formatarValor(data.testemunha2OrgaoEmissor)}</span></div>
      <div class="data-row"><span class="data-label">Telefone:</span><span class="data-value">${formatarValor(data.testemunha2Telefone)}</span></div>
      <div class="data-row"><span class="data-label">E-mail:</span><span class="data-value">${formatarValor(data.testemunha2Email)}</span></div>
    </div>
  `;

  html += `</div>`;

  // Seção 7: Preferências de Comunicação
  html += `
    <div class="section">
      <div class="section-title"><span class="section-title-icon">📞</span> Formas de Contato</div>
  `;

  const preferencias = [];
  if (data.preferenciaAR) preferencias.push("Carta com AR");
  if (data.preferenciaWhatsapp) preferencias.push("WhatsApp");
  if (data.preferenciaEmail) preferencias.push("E-mail");

  html += `<div class="data-row"><span class="data-label">Preferências:</span><span class="data-value">${preferencias.length > 0 ? preferencias.join(", ") : "----------"}</span></div>`;

  html += `</div>`;

  // Seção 8: Observações
  if (data.observacoes) {
    html += `
      <div class="section">
        <div class="section-title"><span class="section-title-icon">📝</span> Observações</div>
        <div class="field-value">${data.observacoes}</div>
      </div>
    `;
  }

  // Seção 9: Documentos Anexados
  const documentos = [];
  if (data.documentosAnexados && data.documentosAnexados.length > 0) {
    documentos.push(...data.documentosAnexados);
  }

  if (documentos.length > 0) {
    html += `
      <div class="section">
        <div class="section-title"><span class="section-title-icon">📎</span> Resumo de Documentos Anexados</div>
        <ul class="document-list">
    `;

    documentos.forEach((doc: string) => {
      html += `
        <li class="document-item">
          <span>${doc}</span>
          <span class="status-anexado">✓ Anexado</span>
        </li>
      `;
    });

    html += `
        </ul>
      </div>
    `;
  }

  // Footer
  html += `
        </div>
        <div class="footer">
          <div class="footer-left">
            <strong>Requerimento Geral de Processos</strong>
            <p>Prefeitura Municipal de Nova Iguaçu</p>
            <p>📍 Endereço: R Dr. Mário Guimarães, 520/1050 - Centro, Nova Iguaçu - RJ, 26255-230</p>
            <p>📞 Tel: (21) Requerimento PP</p>
          </div>
          <div class="footer-right">
            ${logoCid ? `<img src="cid:${logoCid}" alt="Prefeitura de Nova Iguaçu" class="footer-logo" />` : ''}
          </div>
        </div>
        <div style="background-color: #1a2440; color: #999; text-align: center; padding: 15px; font-size: 11px;">
          <p style="margin: 0;">Este é um e-mail automático. Não é necessário respondê-lo.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
}

// Funções auxiliares para formatação
function formatarTipoSolicitacao(tipo: string): string {
  const tipos: { [key: string]: string } = {
    "primeira": "Primeira Isenção",
    "primeira-vez": "Primeira Isenção",
    "primeira-isencao": "Primeira Isenção",
    "renovacao": "Renovação de Isenção",
    "revisao": "Revisão de Isenção",
  };
  return tipos[tipo] || tipo;
}

// Função para formatar valores vazios
function formatarValor(valor: any): string {
  if (valor === undefined || valor === null || valor === "") {
    return "----------";
  }
  if (typeof valor === "boolean") {
    return valor ? "Sim" : "Não";
  }
  return String(valor);
}

function formatarPerfilRequerente(perfil: string): string {
  const perfis: { [key: string]: string } = {
    "requerente": "Requerente",
    "conjuge": "Cônjuge",
    "ambos": "Ambos (Requerente e Cônjuge)",
  };
  const valor = perfis[perfil?.toLowerCase?.()] || perfil;
  if (!valor) return "----------";
  return valor.charAt(0).toUpperCase() + valor.slice(1);
}

function formatarEstadoCivil(estado: string): string {
  const estados: { [key: string]: string } = {
    "solteiro": "Solteiro(a)",
    "casado": "Casado(a)",
    "divorciado": "Divorciado(a)",
    "viuvo": "Viúvo(a)",
    "uniao-estavel": "União Estável",
  };
  return estados[estado] || estado;
}

function formatarOrigemRenda(origem: string): string {
  const origens: { [key: string]: string } = {
    "aposentadoria": "Aposentadoria",
    "pensao": "Pensão",
    "beneficio": "Benefício Social",
    "trabalho": "Trabalho",
    "outro": "Outro",
  };
  return origens[origem] || origem;
}

