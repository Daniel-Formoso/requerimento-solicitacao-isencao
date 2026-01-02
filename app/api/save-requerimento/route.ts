import { NextResponse } from "next/server";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Gerar ID único para o requerimento
    const id = uuidv4().substring(0, 8); // Usar apenas os primeiros 8 caracteres

    // Obter data atual no formato DD-MM-YYYY (brasileiro)
    const today = new Date();
    const dia = String(today.getDate()).padStart(2, '0');
    const mes = String(today.getMonth() + 1).padStart(2, '0');
    const ano = today.getFullYear();
    const dateFolder = `${dia}-${mes}-${ano}`;

    // Criar estrutura de diretórios: uploads/DD-MM-YYYY/id
    const uploadDir = join(process.cwd(), "uploads", dateFolder, id);
    
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }


    // Salvar os arquivos enviados
    for (const [key, value] of formData) {
      if (value instanceof File) {
        const arrayBuffer = await value.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        // Salvar como campo_nomeoriginal.ext para evitar sobrescrita
        const safeName = `${key}_${value.name}`;
        const filePath = join(uploadDir, safeName);
        writeFileSync(filePath, buffer);
      }
    }

    // Salvar um arquivo dados.json com nome/cpf do requerente (se enviados)
    const nome = formData.get('nome') || '';
    const cpf = formData.get('cpf') || '';
    const dadosJson = { nome, cpf };
    writeFileSync(join(uploadDir, 'dados.json'), JSON.stringify(dadosJson, null, 2), 'utf8');

    console.log(`Requerimento ${id} salvo em ${uploadDir}`);

    return NextResponse.json(
      { success: true, message: "Requerimento salvo com sucesso", id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao salvar requerimento:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao salvar requerimento", error: String(error) },
      { status: 500 }
    );
  }
}
