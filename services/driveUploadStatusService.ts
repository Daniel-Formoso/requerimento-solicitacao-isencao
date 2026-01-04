import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import logger from "../utils/logger";

const databaseUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";
if (!process.env.DATABASE_URL) {
  logger.warn("DATABASE_URL nao definido; usando SQLite default em prisma/dev.db");
}

// Prisma 7: usa adapter PrismaBetterSqlite3 (dispensa import direto do better-sqlite3)
const adapter = new PrismaBetterSqlite3({ url: databaseUrl as ":memory:" | (string & {}) });
const prisma = new PrismaClient({ adapter });

export async function markDrivePending(params: {
  requerimentoLocalId: string;
  formulario: string;
  nomePessoa: string;
  nomeArquivo: string;
  localFilePath: string;
  driveFolderName?: string | null;
}) {
  const record = await prisma.driveUploadStatus.create({
    data: {
      requerimentoLocalId: params.requerimentoLocalId,
      formulario: params.formulario,
      nomePessoa: params.nomePessoa,
      nomeArquivo: params.nomeArquivo,
      localFilePath: params.localFilePath,
      status: "PENDING",
      attempts: 0,
      lastError: null,
      // null = elegivel para processamento imediato pelo worker
      lastTriedAt: null,
    },
  });

  logger.info("Drive upload status marcado como PENDING", {
    formulario: params.formulario,
    requerimentoId: params.requerimentoLocalId,
    nomePessoa: params.nomePessoa,
    nomeArquivo: params.nomeArquivo,
    localFilePath: params.localFilePath,
    status: "PENDING",
  });

  return record;
}

// Busca registros PENDING elegíveis para processamento (primeira tentativa ou re-tentativa)
export async function findPendingEligible(options: { maxAttempts: number; minMinutesSinceLastTry: number }) {
  const { maxAttempts, minMinutesSinceLastTry } = options;
  const cutoffDate = new Date(Date.now() - minMinutesSinceLastTry * 60 * 1000);

  return prisma.driveUploadStatus.findMany({
    where: {
      status: "PENDING",
      attempts: { lt: maxAttempts },
      OR: [
        { lastTriedAt: null },
        { lastTriedAt: { lt: cutoffDate } },
      ],
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function markDriveSuccess(recordId: number, attempts: number, driveInfo: { driveFileId: string; driveViewLink: string }) {
  const record = await prisma.driveUploadStatus.update({
    where: { id: recordId },
    data: {
      status: "SUCCESS",
      attempts,
      lastError: null,
      lastTriedAt: new Date(),
      driveFileId: driveInfo.driveFileId,
      driveViewLink: driveInfo.driveViewLink,
    },
  });

  logger.info("Drive upload concluido com sucesso", {
    recordId,
    attempts,
    status: "SUCCESS",
    driveFileId: driveInfo.driveFileId,
    driveViewLink: driveInfo.driveViewLink,
  });

  return record;
}

export async function markDriveFailed(recordId: number, attempts: number, errorMessage: string) {
  const record = await prisma.driveUploadStatus.update({
    where: { id: recordId },
    data: {
      status: "FAILED",
      attempts,
      lastError: errorMessage,
      lastTriedAt: new Date(),
    },
  });

  logger.warn("Drive upload falhou apos tentativas", {
    recordId,
    attempts,
    status: "FAILED",
    error: errorMessage,
  });

  return record;
}

// Busca registros FAILED elegíveis para reprocessamento, respeitando limite de tentativas e intervalo mínimo
export async function findFailedEligible(options: { maxAttempts: number; minMinutesSinceLastTry: number }) {
  const { maxAttempts, minMinutesSinceLastTry } = options;
  const cutoffDate = new Date(Date.now() - minMinutesSinceLastTry * 60 * 1000);

  return prisma.driveUploadStatus.findMany({
    where: {
      status: "FAILED",
      attempts: { lt: maxAttempts },
      OR: [
        { lastTriedAt: null },
        { lastTriedAt: { lt: cutoffDate } },
      ],
    },
    orderBy: { lastTriedAt: "asc" },
  });
}

export async function findPendingByRequerimentoLocalId(requerimentoLocalId: string) {
  return prisma.driveUploadStatus.findMany({
    where: {
      requerimentoLocalId,
      status: "PENDING",
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function findFailedByRequerimentoLocalId(requerimentoLocalId: string) {
  return prisma.driveUploadStatus.findMany({
    where: {
      requerimentoLocalId,
      status: "FAILED",
    },
    orderBy: { lastTriedAt: "asc" },
  });
}

// Marca um registro existente como PENDING antes do reprocessamento
export async function markExistingPending(recordId: number) {
  return prisma.driveUploadStatus.update({
    where: { id: recordId },
    data: {
      status: "PENDING",
      lastTriedAt: new Date(),
    },
  });
}

// Marca sucesso acumulando tentativas
export async function markExistingSuccess(recordId: number, attemptsUsed: number, driveInfo: { driveFileId: string; driveViewLink: string }) {
  const record = await prisma.driveUploadStatus.update({
    where: { id: recordId },
    data: {
      status: "SUCCESS",
      attempts: { increment: attemptsUsed },
      lastError: null,
      lastTriedAt: new Date(),
      driveFileId: driveInfo.driveFileId,
      driveViewLink: driveInfo.driveViewLink,
    },
  });

  logger.info("Drive upload reprocessado com sucesso", {
    recordId,
    status: "SUCCESS",
    attemptsUsed,
    attemptsTotal: record.attempts,
    driveFileId: driveInfo.driveFileId,
    driveViewLink: driveInfo.driveViewLink,
  });

  return record;
}

// Marca falha acumulando tentativas
export async function markExistingFailed(recordId: number, attemptsUsed: number, errorMessage: string) {
  const record = await prisma.driveUploadStatus.update({
    where: { id: recordId },
    data: {
      status: "FAILED",
      attempts: { increment: attemptsUsed },
      lastError: errorMessage,
      lastTriedAt: new Date(),
    },
  });

  logger.warn("Drive upload reprocessado e falhou", {
    recordId,
    status: "FAILED",
    attemptsUsed,
    attemptsTotal: record.attempts,
    error: errorMessage,
  });

  return record;
}
