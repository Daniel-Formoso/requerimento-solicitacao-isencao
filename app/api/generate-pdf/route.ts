import { NextRequest, NextResponse } from "next/server";
import { generateRequerimentoPdf, IdosoFormData } from "@/utils/generatePdfIdoso";

export async function POST(req: NextRequest) {
  try {
    const data: IdosoFormData = await req.json();

    if (!data.nome || !data.cpf) {
      return NextResponse.json(
        { success: false, message: "Dados incompletos: nome e CPF são obrigatórios" },
        { status: 400 }
      );
    }

    // Gerar PDF
    const pdfBuffer = await generateRequerimentoPdf(data);

    // Retornar PDF com headers apropriados
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Requerimento_Idoso_${data.cpf?.replace(/\D/g, '')}_${new Date().getTime()}.pdf"`,
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

    const data: IdosoFormData = JSON.parse(decodeURIComponent(dataParam));

    if (!data.nome || !data.cpf) {
      return NextResponse.json(
        { success: false, message: "Dados incompletos: nome e CPF são obrigatórios" },
        { status: 400 }
      );
    }

    // Gerar PDF
    const pdfBuffer = await generateRequerimentoPdf(data);

    // Retornar PDF com headers apropriados
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Requerimento_Idoso_${data.cpf?.replace(/\D/g, '')}_${new Date().getTime()}.pdf"`,
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

