/**
 * Função para fazer download de todos os documentos mesclados em um único PDF
 * @param documentos - Objeto contendo todos os arquivos e o nome do contribuinte
 */
export async function baixarDocumentosZip(documentos: {
  nomeContribuinte: string;
  docIdentidade?: File | null;
  docCpf?: File | null;
  docComprovanteResidencia?: File | null;
  docProcuracao?: File | null;
  docCpfProcurador?: File | null;
  docIdentidadeProcurador?: File | null;
  docRendimentos?: File | null;
  docUnicoImovel?: File | null;
  docFichaIptu?: File | null;
  docLaudoMedico?: File | null;
  docExcombatente?: File | null;
  docContratoLocacao?: File | null;
  docTermoCessao?: File | null;
  docDeclaracaoPublica?: File | null;
  docPublicidade?: File | null;
  docCertidaoDebitos?: File | null;
  docEstatuto?: File | null;
  docAtaCriacao?: File | null;
  docCnpj?: File | null;
  docBalancoPatrimonial?: File | null;
  docDemonstracao?: File | null;
  docCertidaoNegativa?: File | null;
  docRegistroCartorio?: File | null;
  docOficio?: File | null;
  docInscricaoMunicipal?: File | null;
  docAlvara?: File | null;
  docPeticao?: File | null;
  pdfGerado?: Blob | null;
}): Promise<boolean> {
  try {
    // Criar FormData com todos os arquivos
    const formData = new FormData();
    formData.append("nomeContribuinte", documentos.nomeContribuinte);

    // Adicionar cada arquivo ao FormData
    Object.entries(documentos).forEach(([key, value]) => {
      if (key !== "nomeContribuinte" && value) {
        formData.append(key, value);
      }
    });

    // Fazer a requisição para a API
    const response = await fetch("/api/download-zip", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao mesclar PDFs");
    }

    // Criar um blob com a resposta
    const blob = await response.blob();
    
    // Criar um link temporário e fazer o download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    
    // Obter o nome do arquivo do header Content-Disposition
    const contentDisposition = response.headers.get("Content-Disposition");
    const fileNameMatch = contentDisposition?.match(/filename="(.+)"/);
    const fileName = fileNameMatch ? fileNameMatch[1] : `Requerimento_Completo_${Date.now()}.pdf`;
    
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    
    // Limpar
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    return true;
  } catch (error) {
    console.error("Erro ao baixar PDF mesclado:", error);
    throw error;
  }
}

/**
 * Função para fazer download de um único arquivo PDF
 * @param file - Arquivo ou Blob a ser baixado
 * @param nomeArquivo - Nome que o arquivo terá ao ser baixado
 */
export function baixarArquivoIndividual(
  file: File | Blob,
  nomeArquivo: string
): void {
  try {
    const url = window.URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = nomeArquivo;
    document.body.appendChild(a);
    a.click();
    
    // Limpar
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Erro ao baixar arquivo:", error);
    throw error;
  }
}
