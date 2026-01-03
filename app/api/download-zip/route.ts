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
            const savedId = require('fs').readFileSync(idFilePath, 'utf8').trim();
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

    // Adicionar arquivos ao ZIP (exceto arquivo .id oculto)
    for (const file of files) {
      if (file === '.id') continue; // Ignorar arquivo de controle
      
      const filePath = join(uploadDir, file);
      const stat = statSync(filePath);

      if (stat.isFile()) {
        archive.file(filePath, { name: file });
      }
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
