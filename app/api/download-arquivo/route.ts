import { NextRequest, NextResponse } from "next/server";
import { existsSync, statSync, createReadStream, readdirSync } from "fs";
import { join } from "path";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");
    const filename = searchParams.get("filename");

    if (!id || !filename) {
      return NextResponse.json(
        { success: false, message: "ID ou nome do arquivo não fornecido" },
        { status: 400 }
      );
    }

    // Data no formato brasileiro DD-MM-YYYY
    const today = new Date();
    const dia = String(today.getDate()).padStart(2, '0');
    const mes = String(today.getMonth() + 1).padStart(2, '0');
    const ano = today.getFullYear();
    const dateFolder = `${dia}-${mes}-${ano}`;
    const dateFolderPath = join(process.cwd(), "uploads", dateFolder);

    // Buscar a pasta que contém o ID (nova estrutura)
    let filePath: string | null = null;
    
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
              filePath = join(reqPath, filename);
              break;
            }
          }
        }
        if (filePath) break;
      }
    }

    if (!filePath || !existsSync(filePath)) {
      return NextResponse.json(
        { success: false, message: "Arquivo não encontrado" },
        { status: 404 }
      );
    }

    const stat = statSync(filePath);
    const stream = createReadStream(filePath);

    return new NextResponse(stream as any, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": stat.size.toString(),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Erro ao baixar arquivo individual:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao baixar arquivo", error: String(error) },
      { status: 500 }
    );
  }
}
