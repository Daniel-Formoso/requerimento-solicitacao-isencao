# Requerimento/Solicitação de Isenção

Este projeto é um sistema de formulários para requerimento de isenção/imunidade, com geração de PDF, download de arquivos (ZIP e individual), envio de e-mails e armazenamento de dados e arquivos.

## Tecnologias Utilizadas
- Next.js
- TypeScript
- Prisma ORM
- SQLite (desenvolvimento local)
- PostgreSQL/Supabase (produção)
- archiver (geração de ZIP)
- nodemailer (envio de e-mails)
- uuid (IDs únicos)

## Estrutura do Projeto
- **app/**: Páginas, APIs e formulários
- **components/**: Componentes reutilizáveis
- **public/**: Assets públicos
- **utils/**: Funções utilitárias
- **prisma/**: Configuração do banco de dados
- **uploads/**: Diretório para arquivos enviados

## Passo a Passo para Rodar Localmente

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd requerimento-solicitacao-isencao
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o ambiente**
   - Renomeie `.env.example` para `.env`.
   - Preencha as variáveis de ambiente, especialmente:
     - `DATABASE_URL` (já configurado para SQLite local)
     - `UPLOADS_DIR` (padrão: ./uploads)
     - Credenciais de e-mail (`EMAIL_USER`, `EMAIL_PASS`)

4. **Crie o banco de dados e gere o Prisma Client**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Crie o diretório de uploads** (se não existir)
   ```bash
   mkdir uploads
   ```

6. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

7. **Acesse o sistema**
   - Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Passo a Passo para Produção/VM

1. **Configure o banco de dados PostgreSQL/Supabase**
   - Crie um banco de dados PostgreSQL ou configure Supabase.
   - Atualize `DATABASE_URL` no `.env` com a string de conexão.

2. **Configure o diretório de uploads**
   - Certifique-se que o diretório de uploads existe e tem permissão de escrita.

3. **Configure as credenciais de e-mail**
   - Preencha `EMAIL_USER` e `EMAIL_PASS` no `.env`.

4. **Rode as migrações e gere o Prisma Client**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

5. **Inicie o servidor**
   ```bash
   npm run build
   npm start
   ```

## Funcionalidades
- Formulários para diferentes tipos de isenção/imunidade
- Geração de PDF personalizado
- Download de arquivos individuais e ZIP
- Envio de e-mail com link para download
- Armazenamento de arquivos na VM e metadados no banco

## Observações
- Para alto fluxo, utilize PostgreSQL/Supabase em produção.
- Os arquivos são salvos no diretório de uploads da VM.
- O banco armazena apenas os metadados e caminhos dos arquivos.

## Dúvidas Frequentes
- **Posso usar SQLite em produção?** Não recomendado para alto fluxo.
- **Posso usar Google Cloud?** Sim, basta configurar o banco e diretório de uploads.
- **Como trocar de SQLite para PostgreSQL/Supabase?** Atualize o `.env` e rode as migrações.

## Contato
Em caso de dúvidas, consulte o arquivo `DEPLOY_GUIDE.md` ou entre em contato com o desenvolvedor.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
