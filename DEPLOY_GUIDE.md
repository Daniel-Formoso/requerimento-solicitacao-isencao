# Configuração do Sistema de Requerimentos - Guia de Implantação

## 📋 Visão Geral

Este guia explica como configurar o sistema tanto para **desenvolvimento local** quanto para **produção na VM**.

---

## 🔧 Configuração Local (Desenvolvimento)

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

Edite o `.env` com suas configurações locais:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/requerimentos"
UPLOAD_DIR="./uploads"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
GMAIL_USER="seu-email@gmail.com"
GMAIL_PASS="sua-senha-app"
EMAIL_DESTINO="destino@email.com"
```

### 3. Configurar banco de dados

#### Opção A: PostgreSQL local
```bash
# Instalar PostgreSQL
# Windows: https://www.postgresql.org/download/windows/
# Linux: sudo apt-get install postgresql

# Criar banco
createdb requerimentos

# Rodar migrations
npx prisma migrate dev --name init
```

#### Opção B: SQLite (mais simples para testes)
No arquivo `prisma/schema.prisma`, mude:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

Então rode:
```bash
npx prisma migrate dev --name init
```

### 4. Gerar Prisma Client
```bash
npx prisma generate
```

### 5. Rodar o projeto
```bash
npm run dev
```

---

## 🚀 Configuração na VM (Produção)

### 1. Preparar a VM

#### Instalar Node.js (versão 18+)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Instalar PostgreSQL (ou MySQL)
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Criar banco de dados
```bash
sudo -u postgres psql
CREATE DATABASE requerimentos;
CREATE USER requerimentos_user WITH PASSWORD 'senha_forte_aqui';
GRANT ALL PRIVILEGES ON DATABASE requerimentos TO requerimentos_user;
\q
```

### 2. Clonar e configurar o projeto na VM
```bash
cd /var/www
git clone seu-repositorio.git requerimentos
cd requerimentos
npm install
npm run build
```

### 3. Configurar variáveis de ambiente na VM

Crie o arquivo `.env` na VM:
```env
DATABASE_URL="postgresql://requerimentos_user:senha_forte_aqui@localhost:5432/requerimentos"
UPLOAD_DIR="/var/www/uploads"
NEXT_PUBLIC_APP_URL="https://seu-dominio.com.br"
GMAIL_USER="email@prefeitura.gov.br"
GMAIL_PASS="senha-app"
EMAIL_DESTINO="destino@prefeitura.gov.br"
NODE_ENV="production"
```

### 4. Criar diretório de uploads
```bash
sudo mkdir -p /var/www/uploads
sudo chown -R www-data:www-data /var/www/uploads
sudo chmod -R 755 /var/www/uploads
```

### 5. Rodar migrations
```bash
npx prisma migrate deploy
npx prisma generate
```

### 6. Configurar PM2 (gerenciador de processos)
```bash
sudo npm install -g pm2

# Iniciar aplicação
pm2 start npm --name "requerimentos" -- start

# Configurar para iniciar no boot
pm2 startup
pm2 save
```

### 7. Configurar Nginx (servidor web)

Criar arquivo `/etc/nginx/sites-available/requerimentos`:
```nginx
server {
    listen 80;
    server_name seu-dominio.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /uploads {
        alias /var/www/uploads;
        autoindex off;
    }
}
```

Ativar site:
```bash
sudo ln -s /etc/nginx/sites-available/requerimentos /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 8. Configurar SSL (HTTPS) com Let's Encrypt
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com.br
```

---

## 📊 Estrutura de Arquivos na VM

```
/var/www/
├── requerimentos/          # Código da aplicação
│   ├── .next/
│   ├── app/
│   ├── lib/
│   ├── prisma/
│   ├── .env
│   └── package.json
│
└── uploads/                # Arquivos enviados
    ├── 2026-01-01/
    │   ├── req-1/
    │   │   ├── docIdentidade.pdf
    │   │   ├── docCpf.pdf
    │   │   └── ...
    │   └── req-2/
    └── 2026-01-02/
```

---

## 🔐 Segurança

### Configurar Firewall
```bash
sudo ufw allow 22        # SSH
sudo ufw allow 80        # HTTP
sudo ufw allow 443       # HTTPS
sudo ufw enable
```

### Backup automático do banco
Criar script `/var/www/backup.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/requerimentos"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
pg_dump -U requerimentos_user requerimentos > $BACKUP_DIR/backup_$DATE.sql
# Manter apenas últimos 7 dias
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

Adicionar ao cron:
```bash
sudo crontab -e
# Adicionar: backup diário às 2h da manhã
0 2 * * * /var/www/backup.sh
```

---

## 📈 Monitoramento

### Ver logs da aplicação
```bash
pm2 logs requerimentos
```

### Ver status
```bash
pm2 status
```

### Reiniciar após mudanças
```bash
cd /var/www/requerimentos
git pull
npm install
npm run build
pm2 restart requerimentos
```

---

## ✅ Checklist Final

- [ ] Banco de dados configurado e rodando
- [ ] Variáveis de ambiente configuradas no .env
- [ ] Diretório /var/www/uploads criado com permissões corretas
- [ ] Migrations rodadas (npx prisma migrate deploy)
- [ ] PM2 configurado e aplicação rodando
- [ ] Nginx configurado e rodando
- [ ] SSL configurado (HTTPS)
- [ ] Firewall configurado
- [ ] Backup automático configurado
- [ ] Logs sendo monitorados

---

## 🆘 Problemas Comuns

### Erro: "Cannot connect to database"
- Verificar se PostgreSQL está rodando: `sudo systemctl status postgresql`
- Verificar DATABASE_URL no .env
- Testar conexão: `psql -U requerimentos_user -d requerimentos`

### Erro: "Permission denied" ao salvar arquivos
- Verificar permissões: `ls -la /var/www/uploads`
- Ajustar: `sudo chown -R www-data:www-data /var/www/uploads`

### Aplicação não inicia
- Ver logs: `pm2 logs requerimentos`
- Verificar porta 3000: `sudo netstat -tulpn | grep 3000`

---

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação do Next.js, Prisma e PostgreSQL.
