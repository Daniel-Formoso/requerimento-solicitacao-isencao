import { NextRequest, NextResponse } from "next/server";
import { existsSync, statSync, createReadStream } from "fs";
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

    const filePath = join(process.cwd(), "uploads", dateFolder, id, filename);

    if (!existsSync(filePath)) {
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
