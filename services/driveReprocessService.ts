import GoogleDriveService from "../utils/GoogleDriveService";
import retryDriveUpload from "../helpers/retryDriveUpload";
import logger from "../utils/logger";
import fs from "fs";
import { extractUploadPathParts } from "../utils/uploadPathParts";
import { formatDriveFormFolderName, formatDriveRequerimentoFolderName } from "../utils/driveFolderNaming";
import {
  findPendingEligible,
  findFailedEligible,
  markExistingPending,
  markExistingSuccess,
  markExistingFailed,
} from "./driveUploadStatusService";

const driveService = new (GoogleDriveService as any)();

export interface ReprocessConfig {
  maxAttemptsPerFile: number; // limite total de tentativas acumuladas
  minMinutesSinceLastTry: number; // intervalo mínimo entre tentativas
}

async function processRecords(records: any[], config: ReprocessConfig) {
  for (const record of records) {
    const logMeta = {
      formulario: record.formulario,
      requerimentoId: record.requerimentoLocalId,
      nomePessoa: record.nomePessoa,
      nomeArquivo: record.nomeArquivo,
      localFilePath: record.localFilePath,
      recordId: record.id,
      status: record.status,
      attempts: record.attempts,
    };

    try {
      // Se o arquivo local nao existe, nao adianta tentar novamente.
      // Marcamos como FAILED permanente (consumindo o restante do budget de tentativas)
      // para evitar loop infinito quando a pasta uploads foi limpa.
      const localFilePath = record.localFilePath;
      const attemptsSoFar = typeof record.attempts === "number" ? record.attempts : 0;
      const remainingAttempts = Math.max(1, config.maxAttemptsPerFile - attemptsSoFar);

      if (!localFilePath || !fs.existsSync(localFilePath)) {
        const errorMessage = `Arquivo local nao encontrado (falha permanente): ${localFilePath || "(vazio)"}`;
        logger.warn("Arquivo local ausente; marcando upload como falha permanente", {
          ...logMeta,
          attemptsSoFar,
          remainingAttempts,
          error: errorMessage,
        });
        await markExistingFailed(record.id, remainingAttempts, errorMessage);
        continue;
      }

      // Marca como PENDING antes de processar (idempotente)
      await markExistingPending(record.id);
      logger.info("Processando upload pendente/falhado para o Drive", logMeta);

      const { result, attempts, lastError } = await retryDriveUpload(async () => {
        const parts = extractUploadPathParts(record.localFilePath);
        if (parts) {
          return await driveService.uploadFileToPath({
            localFilePath: record.localFilePath,
            folderPath: [
              formatDriveFormFolderName(parts.formulario),
              parts.dateFolder,
              formatDriveRequerimentoFolderName(parts.requerimentoFolderName),
            ],
            finalFileName: record.nomeArquivo,
            mimeType: String(record.nomeArquivo || "").toLowerCase().endsWith(".txt") ? "text/plain" : undefined,
          });
        }

        // fallback (caso o path nao siga o padrao uploads/...)
        return await driveService.uploadFile({
          localFilePath: record.localFilePath,
          formName: record.formulario,
          requerimentoId: record.requerimentoLocalId,
          pessoaNome: record.nomePessoa,
          finalFileName: record.nomeArquivo,
        });
      }, {
        logger,
        logMeta,
      });

      if (result) {
        await markExistingSuccess(record.id, attempts, {
          driveFileId: result.fileId,
          driveViewLink: result.webViewLink,
        });
      } else {
        await markExistingFailed(
          record.id,
          attempts,
          lastError && typeof (lastError as any).message === "string"
            ? (lastError as any).message
            : "Falha desconhecida no processamento do Drive",
        );
      }
    } catch (err: any) {
      // Nunca deixa um erro inesperado derrubar o worker inteiro
      logger.error("Erro inesperado processando upload do Drive", {
        ...logMeta,
        error: err?.message,
      });
      try {
        await markExistingFailed(record.id, 1, err?.message || "Erro inesperado no worker do Drive");
      } catch {
        // best-effort
      }
    }
  }
}

export async function reprocessFailedUploads(config: ReprocessConfig) {
  logger.info("Iniciando job de reprocessamento de uploads do Drive", {
    maxAttemptsPerFile: config.maxAttemptsPerFile,
    minMinutesSinceLastTry: config.minMinutesSinceLastTry,
  });

  const failedRecords = await findFailedEligible({
    maxAttempts: config.maxAttemptsPerFile,
    minMinutesSinceLastTry: config.minMinutesSinceLastTry,
  });

  if (!failedRecords.length) {
    logger.info("Nenhum upload FAILED elegível para reprocessar");
    return;
  }

  await processRecords(failedRecords, config);

  logger.info("Job de reprocessamento finalizado");
}

export async function processPendingUploads(config: ReprocessConfig) {
  logger.info("Iniciando job de processamento de uploads PENDING do Drive", {
    maxAttemptsPerFile: config.maxAttemptsPerFile,
    minMinutesSinceLastTry: config.minMinutesSinceLastTry,
  });

  const pendingRecords = await findPendingEligible({
    maxAttempts: config.maxAttemptsPerFile,
    minMinutesSinceLastTry: config.minMinutesSinceLastTry,
  });

  if (!pendingRecords.length) {
    logger.info("Nenhum upload PENDING elegível para processar");
    return;
  }

  await processRecords(pendingRecords, config);

  logger.info("Job de processamento de PENDING finalizado");
}
