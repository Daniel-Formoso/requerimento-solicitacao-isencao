import { NextResponse } from "next/server";
import { writeFileSync, mkdirSync, existsSync, readdirSync } from "fs";
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

    // Obter tipo de formulário e nome do requerente
    const tipoFormulario = (formData.get('formularioSlug') as string) || 'requerimento-geral';
    const nomeRequerente = (formData.get('nome') as string) || 'Sem Nome';
    
    // Criar pasta base: uploads/data/tipo-formulario
    const formularioDir = join(process.cwd(), "uploads", dateFolder, tipoFormulario);
    if (!existsSync(formularioDir)) {
      mkdirSync(formularioDir, { recursive: true });
    }

    // Contar quantas pastas já existem para gerar o próximo número
    const existingFolders = existsSync(formularioDir) 
      ? readdirSync(formularioDir, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .length
      : 0;
    
    const numeroSequencial = String(existingFolders + 1).padStart(2, '0');
    const nomePasta = `${numeroSequencial} - requerimento ${nomeRequerente}`;
    
    // Criar estrutura: uploads/DD-MM-YYYY/tipo-formulario/01 - requerimento Nome/
    const uploadDir = join(formularioDir, nomePasta);
    
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

    // Salvar arquivo .id para facilitar busca posterior
    writeFileSync(join(uploadDir, '.id'), id, 'utf8');

    console.log(`Requerimento ${numeroSequencial} - ${nomeRequerente} salvo em ${uploadDir}`);

    return NextResponse.json(
      { success: true, message: "Requerimento salvo com sucesso", id, numeroSequencial, caminho: uploadDir, uploadDir },
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
