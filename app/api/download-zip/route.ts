import { NextRequest, NextResponse } from "next/server";
import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";
import archiver from "archiver";
import { PassThrough, Readable } from "stream";
import { generatePdf } from "@/utils/pdf/pdfFactory";
import type { BasePdfFormData } from "@/utils/pdf/base/types";

const REQUERIMENTO_PDF_NAME = "00 - REQUERIMENTO.pdf";

function tryParseJson(value: string): unknown | null {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function getFormDataFromTxt(txt: string): BasePdfFormData | null {
  const markerStart = "=== Dados do formulario ===";
  const markerEnd = "=== Arquivos anexados";

  const startIdx = txt.indexOf(markerStart);
  if (startIdx === -1) return null;

  const jsonStart = startIdx + markerStart.length;
  const endIdx = txt.indexOf(markerEnd, jsonStart);
  const jsonText = (endIdx === -1 ? txt.slice(jsonStart) : txt.slice(jsonStart, endIdx)).trim();
  const parsed = tryParseJson(jsonText);
  return parsed as BasePdfFormData | null;
}

function loadSavedFormData(uploadDir: string): BasePdfFormData | null {
  // 1) Preferir JSON (caso exista na pasta)
  try {
    const files = readdirSync(uploadDir);
    const jsonCandidate = files.find((f) => f.toLowerCase().endsWith(".json"));
    if (jsonCandidate) {
      const jsonPath = join(uploadDir, jsonCandidate);
      if (statSync(jsonPath).isFile()) {
        const json = readFileSync(jsonPath, "utf8");
        const parsed = tryParseJson(json);
        if (parsed) return parsed as BasePdfFormData;
      }
    }
  } catch {
    // best-effort
  }

  // 2) Fallback: extrair JSON do Dados_Formulario.txt
  try {
    const txtPath = join(uploadDir, "Dados_Formulario.txt");
    if (!existsSync(txtPath)) return null;
    const txt = readFileSync(txtPath, "utf8");
    return getFormDataFromTxt(txt);
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");

    console.log(`🔍 Buscando requerimento com ID: ${id}`);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID não fornecido" },
        { status: 400 }
      );
    }

    // Buscar em todas as pastas de data (nova estrutura: uploads/DD-MM-YYYY/tipo-form/NN - nome/)
    let uploadDir: string | null = null;
    const uploadsPath = join(process.cwd(), "uploads");
    
    console.log(`📂 Verificando pasta uploads: ${uploadsPath}`);
    
    if (existsSync(uploadsPath)) {
      const dateFolders = readdirSync(uploadsPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory());
      
      console.log(`📅 Pastas de data encontradas: ${dateFolders.map(d => d.name).join(', ')}`);
      
      for (const dateDir of dateFolders) {
        const datePath = join(uploadsPath, dateDir.name);
        const tiposFormulario = readdirSync(datePath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory());
        
        for (const tipoDir of tiposFormulario) {
          const tipoPath = join(datePath, tipoDir.name);
          const requerimentos = readdirSync(tipoPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory());
          
          for (const reqDir of requerimentos) {
            const reqPath = join(tipoPath, reqDir.name);
            const idFilePath = join(reqPath, '.id');
            
            // Verificar se existe arquivo .id com o ID correspondente
            if (existsSync(idFilePath)) {
              const savedId = readFileSync(idFilePath, 'utf8').trim();
              if (savedId === id) {
                uploadDir = reqPath;
                console.log(`✅ Pasta encontrada: ${uploadDir}`);
                break;
              }
            }
          }
          if (uploadDir) break;
        }
        if (uploadDir) break;
      }
    }

    // Verificar se a pasta existe
    if (!uploadDir || !existsSync(uploadDir)) {
      console.log(`❌ Pasta não encontrada para o ID: ${id}`);
      return NextResponse.json(
        { success: false, message: "Requerimento não encontrado" },
        { status: 404 }
      );
    }

    // Obter lista de arquivos na pasta
    const files = readdirSync(uploadDir);
    console.log("📁 Arquivos encontrados na pasta:", files);

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, message: "Nenhum arquivo encontrado para este requerimento" },
        { status: 404 }
      );
    }

    // Criar ZIP (requerimento + anexos)
    const archive = archiver("zip", { zlib: { level: 9 } });
    const outputStream = new PassThrough();
    archive.pipe(outputStream);

    // 1) Primeiro arquivo do ZIP: PDF do requerimento (sempre 00 - REQUERIMENTO.PDF)
    const requerimentoPdfPath = join(uploadDir, REQUERIMENTO_PDF_NAME);
    const pdfZipName = "00 - REQUERIMENTO.PDF";

    if (existsSync(requerimentoPdfPath) && statSync(requerimentoPdfPath).isFile()) {
      archive.file(requerimentoPdfPath, { name: pdfZipName });
    } else {
      const savedData = loadSavedFormData(uploadDir);
      if (savedData?.formularioSlug && savedData?.nome && savedData?.cpf) {
        try {
          const pdfBuffer = await generatePdf(savedData);
          archive.append(pdfBuffer, { name: pdfZipName });
        } catch (err) {
          console.error("Falha ao gerar PDF para o ZIP:", err);
        }
      }
    }

    // 2) Adicionar arquivos ao ZIP (exceto arquivo .id oculto, quaisquer .json/.txt e o PDF do requerimento)
    const arquivosParaZip = files.filter((file) => {
      const lower = file.toLowerCase();
      if (file === ".id") return false;
      if (lower.endsWith(".json")) return false;
      if (lower.endsWith(".txt")) return false;
      if (file === REQUERIMENTO_PDF_NAME) return false;
      return statSync(join(uploadDir, file)).isFile();
    });

    // Remover numeração e ordenar
    const arquivosOrdenados = arquivosParaZip
      .map((file) => ({
        original: file,
        nomeSemNumeracao: file.replace(/^\d+\s*-\s*/, ""),
      }))
      .sort((a, b) => a.nomeSemNumeracao.localeCompare(b.nomeSemNumeracao, "pt-BR"));

    // Adicionar ao ZIP com numeração a partir de 01
    arquivosOrdenados.forEach((arquivo, idx) => {
      const numero = String(idx + 1).padStart(2, "0");
      const nomeFinal = `${numero} - ${arquivo.nomeSemNumeracao}`.toUpperCase();
      const filePath = join(uploadDir, arquivo.original);
      archive.file(filePath, { name: nomeFinal });
    });

    await archive.finalize();

    // Nome do ZIP baseado no nome do requerente (extraído do nome da pasta)
    const folderName = uploadDir.split(/[/\\]/).pop() || "";
    const match = folderName.match(/\d+ - requerimento (.+)/);
    const nome = match ? match[1] : "Requerente";
    const nomeLimpo = (nome || "")
      .normalize("NFD")
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "_");
    const nomeZip = `Documentos_${nomeLimpo}.zip`;

    const webStream = Readable.toWeb(outputStream);
    return new NextResponse(webStream, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${nomeZip}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Erro ao gerar ZIP:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao gerar ZIP", error: String(error) },
      { status: 500 }
    );
  }
}
