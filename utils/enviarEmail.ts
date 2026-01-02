// Função para enviar requerimento completo (com arquivos) e e-mail
export async function enviarRequerimentoCompleto(dados: any, arquivos: { [key: string]: File | null }) {
  try {
    // Enviar e-mail com os dados
    const emailResponse = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    let emailResult;
    const emailContentType = emailResponse.headers.get("content-type");
    if (emailContentType?.includes("application/json")) {
      emailResult = await emailResponse.json();
    } else {
      const text = await emailResponse.text();
      emailResult = { message: "Resposta inválida do servidor" };
    }

    if (!emailResponse.ok) {
      throw new Error(emailResult.message || "Erro ao enviar e-mail");
    }

    return { 
      success: true, 
      message: emailResult.message
    };
  } catch (error) {
    console.error("Erro ao processar requerimento:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro ao processar requerimento",
    };
  }
}

// Função para enviar e-mail com os dados do formulário
export async function enviarEmailFormulario(dados: any) {
  try {
    const emailResponse = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    let emailResult;
    const emailContentType = emailResponse.headers.get("content-type");
    if (emailContentType?.includes("application/json")) {
      emailResult = await emailResponse.json();
    } else {
      const text = await emailResponse.text();
      emailResult = { message: "Resposta inválida do servidor" };
    }

    if (!emailResponse.ok) {
      throw new Error(emailResult.message || "Erro ao enviar e-mail");
    }

    return { 
      success: true, 
      message: emailResult.message
    };
  } catch (error) {
    console.error("Erro ao processar requerimento:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro ao processar requerimento",
    };
  }
}
