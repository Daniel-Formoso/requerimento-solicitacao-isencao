// Prisma 7 move a URL de conexao para este arquivo em vez do schema.prisma
const databaseUrl = process.env.DATABASE_URL ?? "file:./prisma/dev.db";

export default {
  datasource: {
    url: databaseUrl,
  },
};
