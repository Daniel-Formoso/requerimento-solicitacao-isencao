import logger from "../utils/logger";
import GoogleDriveService from "../utils/GoogleDriveService";
import retryDriveUpload from "../helpers/retryDriveUpload";
import { extractUploadPathParts } from "../utils/uploadPathParts";
import { formatDriveFormFolderName, formatDriveRequerimentoFolderName } from "../utils/driveFolderNaming";
import {
  findPendingByRequerimentoLocalId,
  findFailedByRequerimentoLocalId,
  markExistingPending,
  markExistingSuccess,
  markExistingFailed,
} from "./driveUploadStatusService";

const driveService = new (GoogleDriveService as any)();

export async function processUploadsForRequerimentoLocalId(requerimentoLocalId: string) {
  // 1 tentativa rapida por arquivo no fluxo automatico
  const maxAttempts = 1;

  const records: any[] = [
    ...(await findPendingByRequerimentoLocalId(requerimentoLocalId) as any),
    ...(await findFailedByRequerimentoLocalId(requerimentoLocalId) as any),
  ];

  if (!records.length) return;

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
      driveFolderName: record.driveFolderName,
    };

    try {
      await markExistingPending(record.id);

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
            mimeType: record.nomeArquivo?.toLowerCase().endsWith(".txt") ? "text/plain" : undefined,
          });
        }

        // Fallback compat com o modo antigo
        return await driveService.uploadFile({
          localFilePath: record.localFilePath,
          formName: record.formulario,
          requerimentoId: record.requerimentoLocalId,
          pessoaNome: record.nomePessoa,
          finalFileName: record.nomeArquivo,
        });
      }, {
        maxAttempts,
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
      logger.warn("Falha inesperada no auto-upload do Drive", {
        ...logMeta,
        error: err?.message,
      });
      try {
        await markExistingFailed(record.id, 1, err?.message || "Erro inesperado no auto-upload do Drive");
      } catch {
        // best effort
      }
    }
  }
}
