import { enviarRequerimentoCompleto } from "./enviarEmail";

export type SubmitFormularioParams = {
  isValid: boolean;
  setLoading: (open: boolean) => void;
  dadosFormulario: Record<string, unknown>;
  arquivos: Record<string, File | null>;
  toast: { success: (message: string, opts?: Record<string, unknown>) => void; error: (message: string, opts?: Record<string, unknown>) => void };
  sucessoMensagem?: string;
  erroMensagem?: string;
};

export async function submitFormularioComFeedback({
  isValid,
  setLoading,
  dadosFormulario,
  arquivos,
  toast,
  sucessoMensagem = "Requerimento enviado com sucesso! Em breve você receberá um e-mail de confirmação.",
  erroMensagem = "Erro ao enviar o requerimento. Por favor, tente novamente.",
}: SubmitFormularioParams) {
  if (!isValid) return;

  setLoading(true);
  try {
    const resultado = await enviarRequerimentoCompleto(dadosFormulario, arquivos);

    if (resultado.success) {
      toast.success(sucessoMensagem, { autoClose: 5000 });
    } else {
      toast.error(erroMensagem, { autoClose: 5000 });
    }
  } catch (error) {
    console.error("Erro no envio do requerimento:", error);
    toast.error(erroMensagem, { autoClose: 5000 });
  } finally {
    setLoading(false);
  }
}
