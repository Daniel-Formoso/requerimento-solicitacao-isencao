// Função para enviar requerimento completo (com arquivos) e e-mail
export async function enviarRequerimentoCompleto(dados: any, arquivos: { [key: string]: File | null }) {
  try {
    // Passo 1: Salvar arquivos no servidor e obter ID
    const formData = new FormData();
    const nomesArquivos: Record<string, string> = {};
    // Adicionar nome e cpf ao FormData para salvar no dados.json
    if (dados.nome) formData.append('nome', dados.nome);
    if (dados.cpf) formData.append('cpf', dados.cpf);
    // Adicionar arquivos ao FormData e registrar nomes
    Object.entries(arquivos).forEach(([key, file]) => {
      if (file instanceof File) {
        formData.append(key, file);
        nomesArquivos[key] = file.name;
      }
    });
    const saveResponse = await fetch("/api/save-requerimento", {
      method: "POST",
      body: formData,
    });

    let saveResult;
    const contentType = saveResponse.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      saveResult = await saveResponse.json();
    } else {
      const text = await saveResponse.text();
      saveResult = { message: "Resposta inválida do servidor" };
    }

    if (!saveResponse.ok) {
      throw new Error(saveResult.message || "Erro ao salvar requerimento");
    }

    // Passo 2: Enviar e-mail com os dados, o ID e os nomes dos arquivos
    const dadosComId = { ...dados, id: saveResult.id, nomesArquivos };
    const emailResponse = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dadosComId),
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
      message: emailResult.message,
      id: saveResult.id
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
