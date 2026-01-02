import { NextRequest, NextResponse } from "next/server";
import { generatePdf, getPdfFileName } from "@/utils/pdf/pdfFactory";
import { BasePdfFormData } from "@/utils/pdf/base/types";

export async function POST(req: NextRequest) {
  try {
    const data: BasePdfFormData = await req.json();

    if (!data.formularioSlug) {
      return NextResponse.json(
        { success: false, message: "'formularioSlug' é obrigatório" },
        { status: 400 }
      );
    }

    if (!data.nome || !data.cpf) {
      return NextResponse.json(
        { success: false, message: "Dados incompletos: nome e CPF são obrigatórios" },
        { status: 400 }
      );
    }

    // Gerar PDF usando factory centralizado
    const pdfBuffer = await generatePdf(data);
    const nomeArquivo = await getPdfFileName(data);

    // Retornar PDF com headers apropriados
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${nomeArquivo}"`,
      },
    });
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao gerar PDF", error: String(error) },
      { status: 500 }
    );
  }
}

// GET também é suportado para compatibilidade com links de e-mail
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const dataParam = searchParams.get("data");

    if (!dataParam) {
      return NextResponse.json(
        { success: false, message: "Parâmetro 'data' não fornecido" },
        { status: 400 }
      );
    }

    const data: BasePdfFormData = JSON.parse(decodeURIComponent(dataParam));

    if (!data.formularioSlug) {
      return NextResponse.json(
        { success: false, message: "'formularioSlug' é obrigatório" },
        { status: 400 }
      );
    }

    if (!data.nome || !data.cpf) {
      return NextResponse.json(
        { success: false, message: "Dados incompletos: nome e CPF são obrigatórios" },
        { status: 400 }
      );
    }

    // Gerar PDF usando factory centralizado
    const pdfBuffer = await generatePdf(data);
    const nomeArquivo = await getPdfFileName(data);

    // Retornar PDF com headers apropriados
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${nomeArquivo}"`,
      },
    });
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao gerar PDF", error: String(error) },
      { status: 500 }
    );
  }
}

