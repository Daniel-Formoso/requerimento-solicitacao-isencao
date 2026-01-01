// Função para enviar e-mail com os dados do formulário
export async function enviarEmailFormulario(dados: any) {
  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Erro ao enviar e-mail");
    }

    return { success: true, message: result.message };
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro ao enviar e-mail",
    };
  }
}
