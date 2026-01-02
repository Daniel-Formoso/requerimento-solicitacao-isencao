import { NextRequest, NextResponse } from "next/server";
import { createReadStream, existsSync, readdirSync, statSync } from "fs";
import { join } from "path";
import archiver from "archiver";
import { Readable } from "stream";

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
    const uploadDir = join(process.cwd(), "uploads", dateFolder, id);

    // Verificar se a pasta existe
    if (!existsSync(uploadDir)) {
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

    // Adicionar arquivos ao ZIP
    for (const file of files) {
      const filePath = join(uploadDir, file);
      const stat = statSync(filePath);

      if (stat.isFile()) {
        archive.file(filePath, { name: file });
      }
    }

    await archive.finalize();

    // Converter o stream para ReadableStream para Next.js
    const readable = Readable.from(archive);
    
    // Buscar nome e cpf do requerente no primeiro arquivo JSON (se existir)
    let nome = "Requerente";
    let cpf = "";
    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const jsonPath = join(uploadDir, file);
          const jsonData = JSON.parse(require('fs').readFileSync(jsonPath, 'utf8'));
          if (jsonData.nome) nome = jsonData.nome;
          if (jsonData.cpf) cpf = jsonData.cpf;
          break;
        } catch {}
      }
    }
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
