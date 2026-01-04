import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const databaseUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";
const adapter = new PrismaBetterSqlite3({ url: databaseUrl as any });
const prisma = new PrismaClient({ adapter });

export async function getNextDailySequence(params: { formulario: string; dateFolder: string }) {
  const { formulario, dateFolder } = params;

  const next = await prisma.$transaction(async (tx) => {
    const existing = await tx.driveDailySequence.findUnique({
      where: {
        formulario_dateFolder: { formulario, dateFolder },
      },
    });

    if (!existing) {
      const created = await tx.driveDailySequence.create({
        data: {
          formulario,
          dateFolder,
          lastNumber: 1,
        },
      });
      return created.lastNumber;
    }

    const updated = await tx.driveDailySequence.update({
      where: {
        formulario_dateFolder: { formulario, dateFolder },
      },
      data: {
        lastNumber: { increment: 1 },
      },
    });

    return updated.lastNumber;
  });

  return next;
}

export async function resetDailySequences() {
  await prisma.driveDailySequence.deleteMany({});
}
