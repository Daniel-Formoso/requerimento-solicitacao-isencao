import { NextRequest, NextResponse } from "next/server";
import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";
import { PDFDocument } from "pdf-lib";
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

function findUploadDirById(id: string): string | null {
  const uploadsPath = join(process.cwd(), "uploads");
  if (!existsSync(uploadsPath)) return null;

  const dateFolders = readdirSync(uploadsPath, { withFileTypes: true }).filter((d) => d.isDirectory());
  for (const dateDir of dateFolders) {
    const datePath = join(uploadsPath, dateDir.name);
    const tiposFormulario = readdirSync(datePath, { withFileTypes: true }).filter((d) => d.isDirectory());

    for (const tipoDir of tiposFormulario) {
      const tipoPath = join(datePath, tipoDir.name);
      const requerimentos = readdirSync(tipoPath, { withFileTypes: true }).filter((d) => d.isDirectory());

      for (const reqDir of requerimentos) {
        const reqPath = join(tipoPath, reqDir.name);
        const idFilePath = join(reqPath, ".id");

        if (!existsSync(idFilePath)) continue;
        try {
          const savedId = readFileSync(idFilePath, "utf8").trim();
          if (savedId === id) return reqPath;
        } catch {
          // best-effort
        }
      }
    }
  }

  return null;
}

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID não fornecido" }, { status: 400 });
    }

    const uploadDir = findUploadDirById(id);
    if (!uploadDir || !existsSync(uploadDir)) {
      return NextResponse.json({ success: false, message: "Requerimento não encontrado" }, { status: 404 });
    }

    const files = readdirSync(uploadDir);
    if (files.length === 0) {
      return NextResponse.json(
        { success: false, message: "Nenhum arquivo encontrado para este requerimento" },
        { status: 404 }
      );
    }

    const mergedPdf = await PDFDocument.create();

    // 1) Requerimento primeiro (00 - REQUERIMENTO.pdf)
    const requerimentoPdfPath = join(uploadDir, REQUERIMENTO_PDF_NAME);
    if (existsSync(requerimentoPdfPath) && statSync(requerimentoPdfPath).isFile()) {
      const bytes = readFileSync(requerimentoPdfPath);
      const pdf = await PDFDocument.load(bytes);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((p) => mergedPdf.addPage(p));
    } else {
      const savedData = loadSavedFormData(uploadDir);
      if (savedData?.formularioSlug && savedData?.nome && savedData?.cpf) {
        try {
          const pdfBuffer = await generatePdf(savedData);
          const pdf = await PDFDocument.load(pdfBuffer);
          const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          pages.forEach((p) => mergedPdf.addPage(p));
        } catch (err) {
          console.error("Falha ao gerar PDF do requerimento:", err);
        }
      }
    }

    // 2) Mesclar demais PDFs (somente .pdf)
    const pdfsParaMerge = files.filter((file) => {
      const lower = file.toLowerCase();
      if (file === ".id") return false;
      if (lower.endsWith(".json")) return false;
      if (lower.endsWith(".txt")) return false;
      if (file === REQUERIMENTO_PDF_NAME) return false;
      if (!lower.endsWith(".pdf")) return false;
      return statSync(join(uploadDir, file)).isFile();
    });

    const ordenados = pdfsParaMerge
      .map((file) => ({ original: file, nomeSemNumeracao: file.replace(/^\d+\s*-\s*/, "") }))
      .sort((a, b) => a.nomeSemNumeracao.localeCompare(b.nomeSemNumeracao, "pt-BR"));

    for (const arquivo of ordenados) {
      try {
        const filePath = join(uploadDir, arquivo.original);
        const bytes = readFileSync(filePath);
        const pdf = await PDFDocument.load(bytes);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((p) => mergedPdf.addPage(p));
      } catch (err) {
        console.error(`Erro ao adicionar PDF ${arquivo.original}:`, err);
      }
    }

    const mergedBytes = await mergedPdf.save();

    const folderName = uploadDir.split(/[/\\]/).pop() || "";
    const match = folderName.match(/\d+ - requerimento (.+)/);
    const nome = match ? match[1] : "Requerente";
    const nomeLimpo = (nome || "").normalize("NFD").replace(/[^\w\s]/g, "").replace(/\s+/g, "_");
    const nomePdf = `PDFs_Mesclados_${nomeLimpo}.pdf`;

    return new NextResponse(Buffer.from(mergedBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${nomePdf}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Erro ao mesclar PDFs:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao mesclar PDFs", error: String(error) },
      { status: 500 }
    );
  }
}
