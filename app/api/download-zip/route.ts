import { NextRequest, NextResponse } from "next/server";
import archiver from "archiver";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Criar um ZIP com todos os documentos
    const archive = archiver("zip", { zlib: { level: 9 } });
    const chunks: Buffer[] = [];

    // Coletar chunks do ZIP
    archive.on("data", (chunk) => chunks.push(chunk));

    // Promise para aguardar finalização
    const zipPromise = new Promise<Buffer>((resolve, reject) => {
      archive.on("end", () => resolve(Buffer.concat(chunks)));
      archive.on("error", reject);
    });

    // Mapear nomes de campos para nomes de arquivos
    const fileMapping: { [key: string]: string } = {
      // Documentos Pessoais
      docIdentidade: "Documento_Identidade.pdf",
      docCpf: "CPF.pdf",
      docComprovanteResidencia: "Comprovante_Residencia.pdf",
      
      // Documentos do Procurador
      docProcuracao: "Procuracao.pdf",
      docCpfProcurador: "CPF_Procurador.pdf",
      docIdentidadeProcurador: "Identidade_Procurador.pdf",
      
      // Documentos Específicos (Idoso, PCD, Ex-combatente)
      docRendimentos: "Comprovante_Rendimentos.pdf",
      docUnicoImovel: "Certidao_Unico_Imovel.pdf",
      docFichaIptu: "Ficha_Lancamento_IPTU.pdf",
      docLaudoMedico: "Laudo_Medico.pdf",
      docExcombatente: "Documento_Excombatente.pdf",
      
      // Documentos de Imóvel Cedido
      docContratoLocacao: "Contrato_Locacao.pdf",
      docTermoCessao: "Termo_Cessao.pdf",
      docDeclaracaoPublica: "Declaracao_Cessao_Publica.pdf",
      docPublicidade: "Comprovante_Publicidade_DOM.pdf",
      docCertidaoDebitos: "Certidao_Negativa_Debitos.pdf",
      
      // Documentos de Instituições/Sindicatos/Templos
      docEstatuto: "Estatuto_Social.pdf",
      docAtaCriacao: "Ata_Criacao.pdf",
      docCnpj: "Cartao_CNPJ.pdf",
      docBalancoPatrimonial: "Balanco_Patrimonial.pdf",
      docDemonstracao: "Demonstracao_Resultado.pdf",
      docCertidaoNegativa: "Certidao_Negativa_Prefeitura.pdf",
      docRegistroCartorio: "Registro_Cartorio.pdf",
      docOficio: "Oficio_Orgao_Publico.pdf",
      
      // Taxas Mercantis
      docInscricaoMunicipal: "Inscricao_Municipal.pdf",
      docAlvara: "Alvara_Funcionamento.pdf",
      
      // Novos campos mapeados
      guia: "Guia_Taxa.pdf",
      comprovante: "Comprovante_Taxa.pdf",
      docCertidao: "Certidao_Nascimento_Casamento.pdf",
      docTaxas: "Comprovante_Pagamento_Taxas.pdf",
      docRgCpf: "RG_CPF.pdf",
      docResidencia: "Comprovante_Residencia.pdf",
      docEscritura: "Escritura_Imovel.pdf",

      // Petição e PDF gerado
      docPeticao: "Peticao.pdf",
      pdfGerado: "Requerimento.pdf",
    };

    let fileCount = 0;
    const nomeContribuinte = formData.get("nomeContribuinte") as string || "Requerimento";

    // Adicionar cada arquivo ao ZIP
    for (const [fieldName, fileName] of Object.entries(fileMapping)) {
      const file = formData.get(fieldName);
      
      if (file && file instanceof File) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          archive.append(buffer, { name: fileName });
          fileCount++;
        } catch (error) {
          console.error(`Erro ao processar arquivo ${fieldName}:`, error);
          // Continua mesmo se um arquivo falhar
        }
      }
    }

    // Se não houver arquivos, retornar erro
    if (fileCount === 0) {
      return NextResponse.json(
        { error: "Nenhum documento foi anexado para criar o ZIP" },
        { status: 400 }
      );
    }

    // Finalizar o ZIP
    archive.finalize();

    // Aguardar o ZIP ser finalizado
    const zipBuffer = await zipPromise;

    // Gerar nome do arquivo ZIP
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const zipFileName = `Documentos_${nomeContribuinte.replace(/[^a-zA-Z0-9]/g, "_")}_${timestamp}.zip`;

    // Retornar ZIP como resposta
    return new NextResponse(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${zipFileName}"`,
      },
    });
  } catch (error) {
    console.error("Erro ao gerar ZIP:", error);
    return NextResponse.json(
      { error: "Erro ao gerar ZIP dos documentos" },
      { status: 500 }
    );
  }
}

// GET para baixar ZIP pelo ID do requerimento (para links de e-mail)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID do requerimento não fornecido" },
        { status: 400 }
      );
    }

    // Buscar requerimento no banco
    const requerimento = await prisma.requerimento.findUnique({
      where: { id: parseInt(id) },
    });

    if (!requerimento) {
      return NextResponse.json(
        { error: "Requerimento não encontrado" },
        { status: 404 }
      );
    }

    // Obter paths dos documentos
    const documentosPaths = requerimento.documentosAnexados 
      ? JSON.parse(requerimento.documentosAnexados as string) 
      : [];

    if (documentosPaths.length === 0) {
      return NextResponse.json(
        { error: "Nenhum documento anexado encontrado" },
        { status: 400 }
      );
    }

    // Criar ZIP com os arquivos do filesystem
    const archive = archiver("zip", { zlib: { level: 9 } });
    const chunks: Buffer[] = [];

    archive.on("data", (chunk) => chunks.push(chunk));

    const zipPromise = new Promise<Buffer>((resolve, reject) => {
      archive.on("end", () => resolve(Buffer.concat(chunks)));
      archive.on("error", reject);
    });

    // Adicionar arquivos ao ZIP
    let fileCount = 0;
    for (const filePath of documentosPaths) {
      const fullPath = path.join(process.cwd(), filePath);
      
      if (fs.existsSync(fullPath)) {
        const fileName = path.basename(fullPath);
        const fileBuffer = fs.readFileSync(fullPath);
        archive.append(fileBuffer, { name: fileName });
        fileCount++;
      }
    }

    if (fileCount === 0) {
      return NextResponse.json(
        { error: "Nenhum arquivo encontrado no servidor" },
        { status: 404 }
      );
    }

    // Finalizar ZIP
    archive.finalize();
    const zipBuffer = await zipPromise;

    // Gerar nome do arquivo
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const nomeContribuinte = requerimento.nome || "Requerimento";
    const zipFileName = `Documentos_${nomeContribuinte.replace(/[^a-zA-Z0-9]/g, "_")}_${timestamp}.zip`;

    // Retornar ZIP
    return new NextResponse(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${zipFileName}"`,
      },
    });
  } catch (error) {
    console.error("Erro ao gerar ZIP:", error);
    return NextResponse.json(
      { error: "Erro ao gerar ZIP dos documentos" },
      { status: 500 }
    );
  }
}
