import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

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

    // Montar o corpo do e-mail em HTML
    const htmlBody = montarCorpoEmail(data);

    // Configurar as opções do e-mail
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.EMAIL_DESTINO || process.env.GMAIL_USER,
      subject: `Novo Requerimento - ${data.tipoFormulario || "Solicitação"}`,
      html: htmlBody,
    };

    // Enviar o e-mail
    await transporter.sendMail(mailOptions);

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
function montarCorpoEmail(data: any): string {
  const { tipoFormulario } = data;

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #EB5F1A;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          background-color: #f9f9f9;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 0 0 5px 5px;
        }
        .section {
          background-color: white;
          padding: 15px;
          margin-bottom: 20px;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .section-title {
          color: #EB5F1A;
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 15px;
          border-bottom: 2px solid #EB5F1A;
          padding-bottom: 5px;
        }
        .field {
          margin-bottom: 10px;
        }
        .field-label {
          font-weight: bold;
          color: #555;
        }
        .field-value {
          color: #333;
          margin-left: 10px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          color: #777;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📋 Novo Requerimento Recebido</h1>
        <p>${tipoFormulario || "Solicitação de Isenção/Imunidade"}</p>
      </div>
      <div class="content">
  `;

  // Seção 1: Dados do Requerente
  if (data.nome || data.cpf || data.rg) {
    html += `
      <div class="section">
        <div class="section-title">👤 Dados do Requerente</div>
    `;

    if (data.tipoSolicitacao) {
      html += `<div class="field"><span class="field-label">Tipo de Solicitação:</span><span class="field-value">${formatarTipoSolicitacao(data.tipoSolicitacao)}</span></div>`;
    }
    if (data.processoAnterior) {
      html += `<div class="field"><span class="field-label">Processo Anterior:</span><span class="field-value">${data.processoAnterior}</span></div>`;
    }
    if (data.certidaoAnterior) {
      html += `<div class="field"><span class="field-label">Certidão Anterior:</span><span class="field-value">${data.certidaoAnterior}</span></div>`;
    }
    if (data.nome) {
      html += `<div class="field"><span class="field-label">Nome:</span><span class="field-value">${data.nome}</span></div>`;
    }
    if (data.cpf) {
      html += `<div class="field"><span class="field-label">CPF:</span><span class="field-value">${data.cpf}</span></div>`;
    }
    if (data.rg) {
      html += `<div class="field"><span class="field-label">RG:</span><span class="field-value">${data.rg}</span></div>`;
    }
    if (data.orgaoEmissor) {
      html += `<div class="field"><span class="field-label">Órgão Emissor:</span><span class="field-value">${data.orgaoEmissor}</span></div>`;
    }
    if (data.telefone) {
      html += `<div class="field"><span class="field-label">Telefone:</span><span class="field-value">${data.telefone}</span></div>`;
    }
    if (data.email) {
      html += `<div class="field"><span class="field-label">E-mail:</span><span class="field-value">${data.email}</span></div>`;
    }

    html += `</div>`;
  }

  // Seção 2: Dados do Imóvel
  if (data.inscricaoImobiliaria || data.cep || data.rua) {
    html += `
      <div class="section">
        <div class="section-title">🏠 Dados do Imóvel</div>
    `;

    if (data.inscricaoImobiliaria) {
      html += `<div class="field"><span class="field-label">Inscrição Imobiliária:</span><span class="field-value">${data.inscricaoImobiliaria}</span></div>`;
    }
    if (data.inscricaoMercantil) {
      html += `<div class="field"><span class="field-label">Inscrição Mercantil:</span><span class="field-value">${data.inscricaoMercantil}</span></div>`;
    }
    if (data.cep) {
      html += `<div class="field"><span class="field-label">CEP:</span><span class="field-value">${data.cep}</span></div>`;
    }
    if (data.rua) {
      html += `<div class="field"><span class="field-label">Logradouro:</span><span class="field-value">${data.rua}</span></div>`;
    }
    if (data.numero) {
      html += `<div class="field"><span class="field-label">Número:</span><span class="field-value">${data.numero}</span></div>`;
    }
    if (data.complemento) {
      html += `<div class="field"><span class="field-label">Complemento:</span><span class="field-value">${data.complemento}</span></div>`;
    }
    if (data.bairro) {
      html += `<div class="field"><span class="field-label">Bairro:</span><span class="field-value">${data.bairro}</span></div>`;
    }
    if (data.cidade) {
      html += `<div class="field"><span class="field-label">Cidade:</span><span class="field-value">${data.cidade}</span></div>`;
    }
    if (data.estado) {
      html += `<div class="field"><span class="field-label">Estado:</span><span class="field-value">${data.estado}</span></div>`;
    }
    if (data.lote) {
      html += `<div class="field"><span class="field-label">Lote:</span><span class="field-value">${data.lote}</span></div>`;
    }
    if (data.quadra) {
      html += `<div class="field"><span class="field-label">Quadra:</span><span class="field-value">${data.quadra}</span></div>`;
    }

    html += `</div>`;
  }

  // Seção 3: Questionário de Elegibilidade (para formulários de isenção)
  if (data.perfilRequerente || data.estadoCivil || data.unicoImovel !== undefined) {
    html += `
      <div class="section">
        <div class="section-title">📋 Informações de Elegibilidade</div>
    `;

    if (data.perfilRequerente) {
      html += `<div class="field"><span class="field-label">Perfil do Requerente:</span><span class="field-value">${formatarPerfilRequerente(data.perfilRequerente)}</span></div>`;
    }
    if (data.estadoCivil) {
      html += `<div class="field"><span class="field-label">Estado Civil:</span><span class="field-value">${formatarEstadoCivil(data.estadoCivil)}</span></div>`;
    }
    if (data.unicoImovel !== undefined) {
      html += `<div class="field"><span class="field-label">Único Imóvel:</span><span class="field-value">${data.unicoImovel ? "Sim" : "Não"}</span></div>`;
    }
    if (data.residenciaPropria !== undefined) {
      html += `<div class="field"><span class="field-label">Residência Própria:</span><span class="field-value">${data.residenciaPropria ? "Sim" : "Não"}</span></div>`;
    }
    if (data.anoInicio) {
      html += `<div class="field"><span class="field-label">Ano de Início de Residência:</span><span class="field-value">${data.anoInicio}</span></div>`;
    }
    if (data.rendaAte2Salarios !== undefined) {
      html += `<div class="field"><span class="field-label">Renda até 2 Salários Mínimos:</span><span class="field-value">${data.rendaAte2Salarios ? "Sim" : "Não"}</span></div>`;
    }
    if (data.origemRenda) {
      html += `<div class="field"><span class="field-label">Origem da Renda:</span><span class="field-value">${formatarOrigemRenda(data.origemRenda)}</span></div>`;
    }
    if (data.origemRendaOutro) {
      html += `<div class="field"><span class="field-label">Outra Origem da Renda:</span><span class="field-value">${data.origemRendaOutro}</span></div>`;
    }

    html += `</div>`;
  }

  // Seção 4: Dados do Cônjuge (se houver)
  if (data.nomeConjuge || data.cpfConjuge) {
    html += `
      <div class="section">
        <div class="section-title">👥 Dados do Cônjuge</div>
    `;

    if (data.nomeConjuge) {
      html += `<div class="field"><span class="field-label">Nome:</span><span class="field-value">${data.nomeConjuge}</span></div>`;
    }
    if (data.cpfConjuge) {
      html += `<div class="field"><span class="field-label">CPF:</span><span class="field-value">${data.cpfConjuge}</span></div>`;
    }
    if (data.rgConjuge) {
      html += `<div class="field"><span class="field-label">RG:</span><span class="field-value">${data.rgConjuge}</span></div>`;
    }
    if (data.telefoneConjuge) {
      html += `<div class="field"><span class="field-label">Telefone:</span><span class="field-value">${data.telefoneConjuge}</span></div>`;
    }
    if (data.emailConjuge) {
      html += `<div class="field"><span class="field-label">E-mail:</span><span class="field-value">${data.emailConjuge}</span></div>`;
    }
    if (data.coproprietario !== undefined) {
      html += `<div class="field"><span class="field-label">Coproprietário:</span><span class="field-value">${data.coproprietario ? "Sim" : "Não"}</span></div>`;
    }
    if (data.origemRendaConjuge) {
      html += `<div class="field"><span class="field-label">Origem da Renda:</span><span class="field-value">${formatarOrigemRenda(data.origemRendaConjuge)}</span></div>`;
    }

    html += `</div>`;
  }

  // Seção 5: Dados do Procurador (se houver)
  if (data.possuiProcurador && data.nomeProcurador) {
    html += `
      <div class="section">
        <div class="section-title">⚖️ Dados do Procurador/Representante</div>
    `;

    if (data.nomeProcurador) {
      html += `<div class="field"><span class="field-label">Nome:</span><span class="field-value">${data.nomeProcurador}</span></div>`;
    }
    if (data.cpfProcurador) {
      html += `<div class="field"><span class="field-label">CPF:</span><span class="field-value">${data.cpfProcurador}</span></div>`;
    }
    if (data.rgProcurador) {
      html += `<div class="field"><span class="field-label">RG:</span><span class="field-value">${data.rgProcurador}</span></div>`;
    }
    if (data.orgaoEmissorProcurador) {
      html += `<div class="field"><span class="field-label">Órgão Emissor:</span><span class="field-value">${data.orgaoEmissorProcurador}</span></div>`;
    }
    if (data.telefoneProcurador) {
      html += `<div class="field"><span class="field-label">Telefone:</span><span class="field-value">${data.telefoneProcurador}</span></div>`;
    }
    if (data.emailProcurador) {
      html += `<div class="field"><span class="field-label">E-mail:</span><span class="field-value">${data.emailProcurador}</span></div>`;
    }

    html += `</div>`;
  }

  // Seção 6: Assinatura a Rogo (se houver)
  if (data.assinaturaRogo && (data.testemunha1Nome || data.testemunha2Nome)) {
    html += `
      <div class="section">
        <div class="section-title">✍️ Assinatura a Rogo</div>
    `;

    if (data.testemunha1Nome) {
      html += `
        <div style="margin-bottom: 15px;">
          <strong>Testemunha 1:</strong>
          <div class="field"><span class="field-label">Nome:</span><span class="field-value">${data.testemunha1Nome}</span></div>
      `;
      if (data.testemunha1Cpf) {
        html += `<div class="field"><span class="field-label">CPF:</span><span class="field-value">${data.testemunha1Cpf}</span></div>`;
      }
      if (data.testemunha1Rg) {
        html += `<div class="field"><span class="field-label">RG:</span><span class="field-value">${data.testemunha1Rg}</span></div>`;
      }
      if (data.testemunha1OrgaoEmissor) {
        html += `<div class="field"><span class="field-label">Órgão Emissor:</span><span class="field-value">${data.testemunha1OrgaoEmissor}</span></div>`;
      }
      if (data.testemunha1Telefone) {
        html += `<div class="field"><span class="field-label">Telefone:</span><span class="field-value">${data.testemunha1Telefone}</span></div>`;
      }
      if (data.testemunha1Email) {
        html += `<div class="field"><span class="field-label">E-mail:</span><span class="field-value">${data.testemunha1Email}</span></div>`;
      }
      html += `</div>`;
    }

    if (data.testemunha2Nome) {
      html += `
        <div>
          <strong>Testemunha 2:</strong>
          <div class="field"><span class="field-label">Nome:</span><span class="field-value">${data.testemunha2Nome}</span></div>
      `;
      if (data.testemunha2Cpf) {
        html += `<div class="field"><span class="field-label">CPF:</span><span class="field-value">${data.testemunha2Cpf}</span></div>`;
      }
      if (data.testemunha2Rg) {
        html += `<div class="field"><span class="field-label">RG:</span><span class="field-value">${data.testemunha2Rg}</span></div>`;
      }
      if (data.testemunha2OrgaoEmissor) {
        html += `<div class="field"><span class="field-label">Órgão Emissor:</span><span class="field-value">${data.testemunha2OrgaoEmissor}</span></div>`;
      }
      if (data.testemunha2Telefone) {
        html += `<div class="field"><span class="field-label">Telefone:</span><span class="field-value">${data.testemunha2Telefone}</span></div>`;
      }
      if (data.testemunha2Email) {
        html += `<div class="field"><span class="field-label">E-mail:</span><span class="field-value">${data.testemunha2Email}</span></div>`;
      }
      html += `</div>`;
    }

    html += `</div>`;
  }

  // Seção 7: Preferências de Comunicação
  if (data.preferenciaAR !== undefined || data.preferenciaWhatsapp !== undefined || data.preferenciaEmail !== undefined) {
    html += `
      <div class="section">
        <div class="section-title">📞 Preferências de Comunicação</div>
    `;

    const preferencias = [];
    if (data.preferenciaAR) preferencias.push("Carta com AR");
    if (data.preferenciaWhatsapp) preferencias.push("WhatsApp");
    if (data.preferenciaEmail) preferencias.push("E-mail");

    html += `<div class="field"><span class="field-label">Preferências:</span><span class="field-value">${preferencias.length > 0 ? preferencias.join(", ") : "Não informado"}</span></div>`;

    html += `</div>`;
  }

  // Seção 8: Observações
  if (data.observacoes) {
    html += `
      <div class="section">
        <div class="section-title">📝 Observações</div>
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
        <div class="section-title">📎 Documentos Anexados</div>
        <ul>
    `;

    documentos.forEach((doc: string) => {
      html += `<li>${doc}</li>`;
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
        <p>Este e-mail foi gerado automaticamente pelo sistema de requerimentos.</p>
        <p>Data e hora: ${new Date().toLocaleString("pt-BR")}</p>
      </div>
    </body>
    </html>
  `;

  return html;
}

// Funções auxiliares para formatação
function formatarTipoSolicitacao(tipo: string): string {
  const tipos: { [key: string]: string } = {
    "primeira-vez": "Primeira vez",
    "renovacao": "Renovação",
    "revisao": "Revisão",
  };
  return tipos[tipo] || tipo;
}

function formatarPerfilRequerente(perfil: string): string {
  const perfis: { [key: string]: string } = {
    "requerente": "Requerente",
    "conjuge": "Cônjuge",
    "ambos": "Ambos (Requerente e Cônjuge)",
  };
  return perfis[perfil] || perfil;
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
