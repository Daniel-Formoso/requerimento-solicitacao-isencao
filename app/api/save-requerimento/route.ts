import { NextResponse } from "next/server";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import logger from "../../../utils/logger";
import { markDrivePending } from "../../../services/driveUploadStatusService";
import { getNextDailySequence } from "../../../services/driveSequenceService";

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

    // Criar pasta base: uploads/data/tipo-formulario (sempre criar primeiro)
    const formularioDir = join(process.cwd(), "uploads", dateFolder, tipoFormulario);
    mkdirSync(formularioDir, { recursive: true });

    // ID sequencial por (formulario, dia) - cresce sempre e comeca em 01
    const seqNumber = await getNextDailySequence({ formulario: tipoFormulario, dateFolder });
    const numeroSequencial = String(seqNumber).padStart(2, '0');
    const nomePasta = `${numeroSequencial} - requerimento ${nomeRequerente}`;

    // Criar estrutura completa: uploads/DD-MM-YYYY/tipo-formulario/01 - requerimento Nome/
    const uploadDir = join(formularioDir, nomePasta);
    mkdirSync(uploadDir, { recursive: true });

    // Salvar os arquivos enviados e coletar nomes para upload no Drive
    const arquivosSalvos: { key: string; safeName: string; filePath: string }[] = [];
    const dadosFormulario: Record<string, unknown> = {};
    for (const [key, value] of formData) {
      if (value instanceof File) {
        const arrayBuffer = await value.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        // Salvar como campo_nomeoriginal.ext para evitar sobrescrita
        const safeName = `${key}_${value.name}`;
        const filePath = join(uploadDir, safeName);
        writeFileSync(filePath, buffer);
        arquivosSalvos.push({ key, safeName, filePath });
      } else {
        // Mantem os campos do formulario para gerar o .txt
        // (se o mesmo campo vier repetido, preserva o ultimo valor)
        dadosFormulario[key] = value;
      }
    }

    // Cria um .txt com os dados do formulario + lista de arquivos
    const txtFileName = `Dados_Formulario.txt`;
    const txtFilePath = join(uploadDir, txtFileName);
    const txtContent =
      `RequerimentoLocalId: ${id}\n` +
      `Formulario: ${tipoFormulario}\n` +
      `Nome: ${nomeRequerente}\n` +
      `Sequencial: ${numeroSequencial}\n` +
      `Data: ${dateFolder}\n\n` +
      `=== Dados do formulario ===\n` +
      JSON.stringify(dadosFormulario, null, 2) +
      `\n\n=== Arquivos anexados (salvos localmente) ===\n` +
      (arquivosSalvos.length ? arquivosSalvos.map(a => `- ${a.safeName}`).join('\n') : '(nenhum)') +
      `\n`;
    writeFileSync(txtFilePath, txtContent, 'utf8');
    arquivosSalvos.push({ key: 'dados_formulario', safeName: txtFileName, filePath: txtFilePath });


    // Salvar arquivo .id para facilitar busca posterior
    writeFileSync(join(uploadDir, '.id'), id, 'utf8');

    // --- INTEGRAÇÃO GOOGLE DRIVE (após upload local) ---
    const logBase = {
      formulario: tipoFormulario,
      requerimentoId: id,
      nomePessoa: nomeRequerente,
    };

    // Estrutura no Drive (exigida):
    // tipoFormulario / dateFolder / "NN - requerimento Nome"
    const driveFolderName = nomePasta;

    for (const arquivo of arquivosSalvos) {
      const logMeta = {
        ...logBase,
        nomeArquivo: arquivo.safeName,
        localFilePath: arquivo.filePath,
      };

      // Registra status como PENDING (best effort, não bloqueia)
      let statusRecordId: number | null = null;
      try {
        const statusRecord = await markDrivePending({
          requerimentoLocalId: id,
          formulario: tipoFormulario,
          nomePessoa: nomeRequerente,
          nomeArquivo: arquivo.safeName,
          localFilePath: arquivo.filePath,
          driveFolderName,
        });
        statusRecordId = statusRecord.id;
      } catch (err: any) {
        logger.warn("Nao foi possivel registrar status PENDING no banco", {
          ...logMeta,
          error: err?.message,
        });
      }

      // Importante: o upload para o Drive agora e' ASSINCRONO.
      // Este endpoint nao tenta fazer upload (nem faz retry) para nao travar o fluxo principal.
      // Um worker/job separado deve processar os registros PENDING/FAILED e atualizar para SUCCESS/FAILED.
      // Se nao conseguiu nem registrar no banco, apenas segue o fluxo.
      void statusRecordId;
    }

    return NextResponse.json(
      { success: true, message: "Requerimento salvo com sucesso", id, numeroSequencial, caminho: uploadDir, uploadDir },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Erro ao salvar requerimento", { error: String(error) });
    return NextResponse.json(
      { success: false, message: "Erro ao salvar requerimento", error: String(error) },
      { status: 500 }
    );
  }
}
