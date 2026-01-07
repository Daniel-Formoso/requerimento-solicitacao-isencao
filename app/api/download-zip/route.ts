import { NextRequest, NextResponse } from "next/server";
import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";
import archiver from "archiver";
import { Readable } from "stream";
import { generatePdf } from "@/utils/pdf/pdfFactory";
import type { BasePdfFormData } from "@/utils/pdf/base/types";

const REQUERIMENTO_PDF_NAME = "00 - REQUERIMENTO.pdf";

function tryParseJson(value: string): any | null {
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

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID não fornecido" },
        { status: 400 }
      );
    }

    // Construir o caminho para a pasta de uploads do requerimento (formato brasileiro DD-MM-YYYY)
    const today = new Date();
    const dia = String(today.getDate()).padStart(2, '0');
    const mes = String(today.getMonth() + 1).padStart(2, '0');
    const ano = today.getFullYear();
    const dateFolder = `${dia}-${mes}-${ano}`;
    const dateFolderPath = join(process.cwd(), "uploads", dateFolder);

    // Buscar a pasta que contém o ID (nova estrutura: uploads/data/tipo-form/NN - nome/)
    let uploadDir: string | null = null;
    
    if (existsSync(dateFolderPath)) {
      const tiposFormulario = readdirSync(dateFolderPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory());
      
      for (const tipoDir of tiposFormulario) {
        const tipoPath = join(dateFolderPath, tipoDir.name);
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
              break;
            }
          }
        }
        if (uploadDir) break;
      }
    }

    // Verificar se a pasta existe
    if (!uploadDir || !existsSync(uploadDir)) {
      return NextResponse.json(
        { success: false, message: "Requerimento não encontrado" },
        { status: 404 }
      );
    }

    // Obter lista de arquivos na pasta
    const files = readdirSync(uploadDir);

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, message: "Nenhum arquivo encontrado para este requerimento" },
        { status: 404 }
      );
    }

    // Criar um arquivo ZIP
    const archive = archiver("zip", { zlib: { level: 9 } });

    // 1) Primeiro arquivo do ZIP: PDF do requerimento (00 - REQUERIMENTO.PDF)
    const requerimentoPdfPath = join(uploadDir, REQUERIMENTO_PDF_NAME);
    let pdfAdded = false;
    if (existsSync(requerimentoPdfPath) && statSync(requerimentoPdfPath).isFile()) {
      archive.file(requerimentoPdfPath, { name: REQUERIMENTO_PDF_NAME.toUpperCase() });
      pdfAdded = true;
    } else {
      const savedData = loadSavedFormData(uploadDir);
      if (savedData?.formularioSlug && savedData?.nome && savedData?.cpf) {
        try {
          const pdfBuffer = await generatePdf(savedData);
          archive.append(pdfBuffer, { name: REQUERIMENTO_PDF_NAME.toUpperCase() });
          pdfAdded = true;
        } catch (err) {
          console.error("Falha ao gerar PDF para o ZIP:", err);
        }
      }
    }

    // 2) Adicionar anexos numerados, ignorando .id, .json, Dados_Formulario.txt e o PDF do requerimento
    //    Todos os nomes em maiúsculas, numerados a partir de 01
    let anexos = files.filter((file) => {
      const lower = file.toLowerCase();
      if (file === '.id') return false;
      if (lower.endsWith('.json')) return false;
      if (file === REQUERIMENTO_PDF_NAME) return false;
      if (lower === 'dados_formulario.txt') return false;
      return statSync(join(uploadDir, file)).isFile();
    });
    anexos = anexos.sort(); // Ordena para garantir ordem estável
    let idx = 1;
    for (const file of anexos) {
      const ext = file.includes('.') ? file.substring(file.lastIndexOf('.')) : '';
      const nomeBase = file.replace(ext, '');
      const numero = String(idx).padStart(2, '0');
      const nomeFinal = `${numero} - ${nomeBase}${ext}`.toUpperCase();
      const filePath = join(uploadDir, file);
      archive.file(filePath, { name: nomeFinal });
      idx++;
    }

    await archive.finalize();

    // Converter o stream para ReadableStream para Next.js
    const readable = Readable.from(archive);
    
    // Extrair nome do requerente da pasta (formato: "NN - requerimento Nome")
    const folderName = uploadDir.split(/[/\\]/).pop() || "";
    const match = folderName.match(/\d+ - requerimento (.+)/);
    const nome = match ? match[1] : "Requerente";
    const nomeLimpo = (nome || "").normalize('NFD').replace(/[^\w\s]/g, '').replace(/\s+/g, '_');
    const nomeZip = `Documentos_${nomeLimpo}.zip`;
    return new NextResponse(readable as any, {
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
