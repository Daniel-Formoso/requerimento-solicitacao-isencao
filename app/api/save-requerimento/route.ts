import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Função para salvar arquivo no filesystem (local ou VM)
async function saveFile(file: File, requerimentoId: string, tipo: string): Promise<string> {
  // Diretório base configurado no .env
  const uploadDir = process.env.UPLOAD_DIR || "./uploads";
  
  // Criar estrutura de pastas: uploads/YYYY-MM-DD/req-{id}/
  const today = new Date().toISOString().split("T")[0];
  const requerimentoDir = path.join(process.cwd(), uploadDir, today, `req-${requerimentoId}`);
  
  // Criar diretório se não existir
  if (!fs.existsSync(requerimentoDir)) {
    fs.mkdirSync(requerimentoDir, { recursive: true });
  }
  
  // Mapeamento de nomes de arquivos
  const fileMapping: { [key: string]: string } = {
    docIdentidade: "Documento_Identidade.pdf",
    docCpf: "CPF.pdf",
    docComprovanteResidencia: "Comprovante_Residencia.pdf",
    docProcuracao: "Procuracao.pdf",
    docCpfProcurador: "CPF_Procurador.pdf",
    docIdentidadeProcurador: "Identidade_Procurador.pdf",
    docRendimentos: "Comprovante_Rendimentos.pdf",
    docUnicoImovel: "Certidao_Unico_Imovel.pdf",
    docFichaIptu: "Ficha_Lancamento_IPTU.pdf",
    docLaudoMedico: "Laudo_Medico.pdf",
    docExcombatente: "Documento_Excombatente.pdf",
    docContratoLocacao: "Contrato_Locacao.pdf",
    docTermoCessao: "Termo_Cessao.pdf",
    docDeclaracaoPublica: "Declaracao_Cessao_Publica.pdf",
    docPublicidade: "Comprovante_Publicidade_DOM.pdf",
    docCertidaoDebitos: "Certidao_Negativa_Debitos.pdf",
    docEstatuto: "Estatuto_Social.pdf",
    docAtaCriacao: "Ata_Criacao.pdf",
    docCnpj: "Cartao_CNPJ.pdf",
    docBalancoPatrimonial: "Balanco_Patrimonial.pdf",
    docDemonstracao: "Demonstracao_Resultado.pdf",
    docCertidaoNegativa: "Certidao_Negativa_Prefeitura.pdf",
    docRegistroCartorio: "Registro_Cartorio.pdf",
    docOficio: "Oficio_Orgao_Publico.pdf",
    docInscricaoMunicipal: "Inscricao_Municipal.pdf",
    docAlvara: "Alvara_Funcionamento.pdf",
    guia: "Guia_Taxa.pdf",
    comprovante: "Comprovante_Taxa.pdf",
    docCertidao: "Certidao_Nascimento_Casamento.pdf",
    docTaxas: "Comprovante_Pagamento_Taxas.pdf",
    docRgCpf: "RG_CPF.pdf",
    docResidencia: "Comprovante_Residencia.pdf",
    docEscritura: "Escritura_Imovel.pdf",
    docPeticao: "Peticao.pdf",
  };

  // Gerar nome do arquivo
  const fileName = fileMapping[tipo] || `${tipo}.pdf`;
  const filePath = path.join(requerimentoDir, fileName);
  
  // Salvar arquivo
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(filePath, buffer);
  
  // Retornar caminho relativo (para salvar no banco)
  return `/${uploadDir}/${today}/req-${requerimentoId}/${fileName}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Obter IP do usuário
    const ip = request.headers.get("x-forwarded-for") || 
               request.headers.get("x-real-ip") || 
               "unknown";
    
    const userAgent = request.headers.get("user-agent") || "unknown";
    
    // Extrair dados do formulário
    const data: any = {
      tipoFormulario: formData.get("tipoFormulario") as string,
      tipoSolicitacao: formData.get("tipoSolicitacao") as string,
      processoAnterior: formData.get("processoAnterior") as string,
      certidaoAnterior: formData.get("certidaoAnterior") as string,
      nome: formData.get("nome") as string,
      cpf: formData.get("cpf") as string,
      rg: formData.get("rg") as string,
      orgaoEmissor: formData.get("orgaoEmissor") as string,
      email: formData.get("email") as string,
      telefone: formData.get("telefone") as string,
      cep: formData.get("cep") as string,
      rua: formData.get("rua") as string,
      numero: formData.get("numero") as string,
      complemento: formData.get("complemento") as string,
      bairro: formData.get("bairro") as string,
      cidade: formData.get("cidade") as string,
      estado: formData.get("estado") as string,
      inscricaoImobiliaria: formData.get("inscricaoImobiliaria") as string,
      lote: formData.get("lote") as string,
      quadra: formData.get("quadra") as string,
      perfilRequerente: formData.get("perfilRequerente") as string,
      estadoCivil: formData.get("estadoCivil") as string,
      unicoImovel: formData.get("unicoImovel") === "true",
      residenciaPropria: formData.get("residenciaPropria") === "true",
      anoInicio: formData.get("anoInicio") as string,
      rendaAte2Salarios: formData.get("rendaAte2Salarios") === "true",
      origemRenda: formData.get("origemRenda") as string,
      origemRendaOutro: formData.get("origemRendaOutro") as string,
      nomeConjuge: formData.get("nomeConjuge") as string,
      cpfConjuge: formData.get("cpfConjuge") as string,
      rgConjuge: formData.get("rgConjuge") as string,
      telefoneConjuge: formData.get("telefoneConjuge") as string,
      emailConjuge: formData.get("emailConjuge") as string,
      coproprietario: formData.get("coproprietario") === "true",
      origemRendaConjuge: formData.get("origemRendaConjuge") as string,
      possuiProcurador: formData.get("possuiProcurador") === "true",
      nomeProcurador: formData.get("nomeProcurador") as string,
      cpfProcurador: formData.get("cpfProcurador") as string,
      rgProcurador: formData.get("rgProcurador") as string,
      orgaoEmissorProcurador: formData.get("orgaoEmissorProcurador") as string,
      emailProcurador: formData.get("emailProcurador") as string,
      telefoneProcurador: formData.get("telefoneProcurador") as string,
      assinaturaRogo: formData.get("assinaturaRogo") === "true",
      testemunha1Nome: formData.get("testemunha1Nome") as string,
      testemunha1Cpf: formData.get("testemunha1Cpf") as string,
      testemunha1Rg: formData.get("testemunha1Rg") as string,
      testemunha1OrgaoEmissor: formData.get("testemunha1OrgaoEmissor") as string,
      testemunha1Telefone: formData.get("testemunha1Telefone") as string,
      testemunha1Email: formData.get("testemunha1Email") as string,
      testemunha2Nome: formData.get("testemunha2Nome") as string,
      testemunha2Cpf: formData.get("testemunha2Cpf") as string,
      testemunha2Rg: formData.get("testemunha2Rg") as string,
      testemunha2OrgaoEmissor: formData.get("testemunha2OrgaoEmissor") as string,
      testemunha2Telefone: formData.get("testemunha2Telefone") as string,
      testemunha2Email: formData.get("testemunha2Email") as string,
      preferenciaAR: formData.get("preferenciaAR") === "true",
      preferenciaWhatsapp: formData.get("preferenciaWhatsapp") === "true",
      preferenciaEmail: formData.get("preferenciaEmail") === "true",
      observacoes: formData.get("observacoes") as string,
      possuiGuiaTaxa: formData.get("possuiGuiaTaxa") === "true",
      possuiComprovanteTaxa: formData.get("possuiComprovanteTaxa") === "true",
      ipAddress: ip,
      userAgent: userAgent,
    };
    
    // Salvar requerimento no banco primeiro (para obter ID)
    const requerimento = await prisma.requerimento.create({
      data: data,
    });
    
    // Salvar arquivos anexados
    const documentosPaths: string[] = [];
    const fileFields = [
      // Campos originais
      "docIdentidade",
      "docCpf",
      "docComprovanteResidencia",
      "docProcuracao",
      "docCpfProcurador",
      "docIdentidadeProcurador",
      "docRendimentos",
      "docUnicoImovel",
      "docFichaIptu",
      "docLaudoMedico",
      "docExcombatente",
      "docContratoLocacao",
      "docTermoCessao",
      "docDeclaracaoPublica",
      "docPublicidade",
      "docCertidaoDebitos",
      "docEstatuto",
      "docAtaCriacao",
      "docCnpj",
      "docBalancoPatrimonial",
      "docDemonstracao",
      "docCertidaoNegativa",
      "docRegistroCartorio",
      "docOficio",
      "docInscricaoMunicipal",
      "docAlvara",
      "docPeticao",
      
      // Novos campos identificados no frontend
      "guia",
      "comprovante",
      "docCertidao",
      "docTaxas",
      "docRgCpf",
      "docResidencia", // Alternativa para docComprovanteResidencia
      "docEscritura",
    ];
    
    for (const fieldName of fileFields) {
      const file = formData.get(fieldName);
      if (file && file instanceof File) {
        try {
          const filePath = await saveFile(file, requerimento.id.toString(), fieldName);
          documentosPaths.push(filePath);
        } catch (error) {
          console.error(`Erro ao salvar arquivo ${fieldName}:`, error);
        }
      }
    }
    
    // Atualizar requerimento com paths dos documentos
    await prisma.requerimento.update({
      where: { id: requerimento.id },
      data: {
        documentosAnexados: JSON.stringify(documentosPaths),
      },
    });
    
    return NextResponse.json(
      {
        success: true,
        message: "Requerimento salvo com sucesso!",
        id: requerimento.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao salvar requerimento:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao salvar requerimento",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
