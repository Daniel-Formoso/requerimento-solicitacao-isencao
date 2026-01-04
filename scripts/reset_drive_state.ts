import "dotenv/config";

import fs from "fs";
import path from "path";
import logger from "../utils/logger";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

function resolveUploadDir() {
  const uploadDir = process.env.UPLOAD_DIR || "./uploads";
  return path.resolve(process.cwd(), uploadDir);
}

async function main() {
  const uploadDirPath = resolveUploadDir();

  // 1) Limpa a fila de uploads do Drive no banco (mantem os requerimentos)
  const databaseUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";
  const adapter = new PrismaBetterSqlite3({ url: databaseUrl as any });
  const prisma = new PrismaClient({ adapter });

  const deleted = await prisma.driveUploadStatus.deleteMany({});
  const deletedSeq = await prisma.driveDailySequence.deleteMany({});
  await prisma.$disconnect();

  // 2) Opcionalmente limpa a pasta uploads local
  if (fs.existsSync(uploadDirPath)) {
    fs.rmSync(uploadDirPath, { recursive: true, force: true });
  }
  fs.mkdirSync(uploadDirPath, { recursive: true });

  logger.info("Reset local concluido", {
    deletedDriveUploadStatus: deleted.count,
    deletedDriveDailySequence: deletedSeq.count,
    uploadDir: uploadDirPath,
  });

  console.log("OK: reset concluido.");
  console.log(`- drive_upload_status removidos: ${deleted.count}`);
  console.log(`- drive_daily_sequence removidos: ${deletedSeq.count}`);
  console.log(`- uploads limpo e recriado: ${uploadDirPath}`);
}

main().catch((err) => {
  console.error("Falha no reset:", err?.message || err);
  process.exit(1);
});
