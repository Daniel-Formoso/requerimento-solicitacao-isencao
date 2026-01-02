// Função para enviar requerimento completo (com arquivos) e e-mail
export async function enviarRequerimentoCompleto(dados: any, arquivos: { [key: string]: File | null }) {
  try {
    // Passo 1: Salvar requerimento no banco para obter ID
    const formData = new FormData();
    
    // Adicionar todos os campos de texto ao FormData
    Object.keys(dados).forEach(key => {
      if (dados[key] !== null && dados[key] !== undefined) {
        // Converter arrays e objetos para JSON
        if (typeof dados[key] === 'object' && !Array.isArray(dados[key])) {
          formData.append(key, JSON.stringify(dados[key]));
        } else if (Array.isArray(dados[key])) {
          formData.append(key, JSON.stringify(dados[key]));
        } else {
          formData.append(key, String(dados[key]));
        }
      }
    });
    
    // Adicionar arquivos ao FormData
    Object.entries(arquivos).forEach(([key, file]) => {
      if (file instanceof File) {
        formData.append(key, file);
      }
    });
    
    const saveResponse = await fetch("/api/save-requerimento", {
      method: "POST",
      body: formData,
    });

    const saveResult = await saveResponse.json();

    if (!saveResponse.ok) {
      throw new Error(saveResult.message || "Erro ao salvar requerimento");
    }

    // Passo 2: Enviar e-mail com o ID do requerimento
    const dadosComId = { ...dados, id: saveResult.id };
    
    const emailResponse = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dadosComId),
    });

    const emailResult = await emailResponse.json();

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

// Função para enviar e-mail com os dados do formulário (legado - agora usa a função completa)
export async function enviarEmailFormulario(dados: any) {
  try {
    // Passo 1: Salvar requerimento no banco para obter ID
    const formData = new FormData();
    
    // Adicionar todos os campos de texto ao FormData
    Object.keys(dados).forEach(key => {
      if (dados[key] !== null && dados[key] !== undefined && typeof dados[key] !== 'object') {
        formData.append(key, String(dados[key]));
      }
    });
    
    // Adicionar arquivos ao FormData (se existirem no dados original)
    // Nota: Os arquivos precisam ser passados junto com os dados
    
    const saveResponse = await fetch("/api/save-requerimento", {
      method: "POST",
      body: formData,
    });

    const saveResult = await saveResponse.json();

    if (!saveResponse.ok) {
      throw new Error(saveResult.message || "Erro ao salvar requerimento");
    }

    // Passo 2: Enviar e-mail com o ID do requerimento
    const dadosComId = { ...dados, id: saveResult.id };
    
    const emailResponse = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dadosComId),
    });

    const emailResult = await emailResponse.json();

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
