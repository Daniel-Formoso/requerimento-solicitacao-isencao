# Sistema de Envio de E-mails - Configuração e Uso

## 📧 Visão Geral

Este sistema permite que os dados dos formulários de requerimento sejam enviados automaticamente por e-mail para o endereço configurado, utilizando o SMTP do Gmail.

## 🔧 Configuração Inicial

### 1. Configurar Conta Gmail

1. Acesse sua conta Gmail (ou crie uma nova)
2. Vá em **Configurações da Conta Google** → **Segurança**
3. Ative a **Verificação em duas etapas** (obrigatório)
4. Após ativar, volte em **Segurança** e procure por **Senhas de app**
5. Clique em **Senhas de app** e crie uma nova:
   - Selecione "E-mail" como tipo de app
   - Selecione "Outro" e dê um nome (ex: "Sistema Requerimentos")
6. Copie a senha gerada (16 caracteres sem espaços)

### 2. Configurar Variáveis de Ambiente

Edite o arquivo `.env.local` na raiz do projeto:

```env
# E-mail que será usado para enviar os requerimentos
GMAIL_USER=seuemail@gmail.com

# Senha de app gerada pelo Google (16 caracteres)
GMAIL_PASS=xxxx xxxx xxxx xxxx

# E-mail que receberá os requerimentos
EMAIL_DESTINO=destinatario@exemplo.com
```

**Importante:**
- Use a senha de app gerada, NÃO use a senha normal do Gmail
- Se `EMAIL_DESTINO` não for configurado, os e-mails serão enviados para o mesmo endereço do `GMAIL_USER`

### 3. Instalar Dependências

Certifique-se de que as dependências foram instaladas:

```bash
npm install nodemailer
npm install @types/nodemailer --save-dev
```

## 🚀 Como Funciona

### Estrutura do Sistema

1. **Endpoint API** (`app/api/send-email/route.ts`):
   - Recebe os dados do formulário
   - Configura o transporte SMTP do Gmail
   - Monta o corpo do e-mail em HTML
   - Envia o e-mail

2. **Função Auxiliar** (`utils/enviarEmail.ts`):
   - Facilita o envio de e-mails dos formulários
   - Trata erros e retorna status da operação

3. **Integração nos Formulários**:
   - Cada formulário coleta os dados preenchidos
   - Ao finalizar, chama a função de envio de e-mail
   - Exibe notificação de sucesso ou erro

### Formato do E-mail

Os e-mails são enviados em formato HTML profissional, contendo:

- **Cabeçalho**: Tipo de requerimento
- **Seções organizadas**:
  - 👤 Dados do Requerente
  - 🏠 Dados do Imóvel
  - 📋 Informações de Elegibilidade
  - 👥 Dados do Cônjuge (se houver)
  - ⚖️ Dados do Procurador (se houver)
  - ✍️ Assinatura a Rogo (se houver)
  - 📞 Preferências de Comunicação
  - 📝 Observações
  - 📎 Documentos Anexados
- **Rodapé**: Data e hora do envio

## 📝 Formulários Integrados

Os seguintes formulários já estão integrados com o sistema de envio de e-mail:

- ✅ Isenção de IPTU - Idosos maiores de 60 anos
- ✅ Imunidade recíproca - Imóveis de entes públicos

### Como Integrar em Outros Formulários

Para integrar o sistema de e-mail em outros formulários:

1. **Importar a função de envio**:
```typescript
import { enviarEmailFormulario } from "@/utils/enviarEmail";
```

2. **Preparar os dados no handleSubmit**:
```typescript
const handleSubmit = async () => {
  if (validarFormulario()) {
    const dadosFormulario = {
      tipoFormulario: "Nome do Formulário",
      // ... todos os campos do formulário
    };
    
    const resultado = await enviarEmailFormulario(dadosFormulario);
    
    if (resultado.success) {
      toast.success("Requerimento enviado com sucesso!");
    } else {
      toast.error("Erro ao enviar o requerimento.");
    }
  }
};
```

## 🧪 Testando o Sistema

1. Configure as variáveis de ambiente no `.env.local`
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
3. Acesse um dos formulários integrados
4. Preencha todos os campos obrigatórios
5. Envie o formulário
6. Verifique se o e-mail chegou no endereço configurado

## ⚠️ Solução de Problemas

### Erro: "Invalid login credentials"
- Verifique se a senha de app está correta no `.env.local`
- Certifique-se de que a verificação em duas etapas está ativa
- Gere uma nova senha de app se necessário

### Erro: "Connection refused" ou "ETIMEDOUT"
- Verifique sua conexão com a internet
- Certifique-se de que não há firewall bloqueando a porta 587 (SMTP)
- Tente desativar temporariamente antivírus/firewall para testar

### E-mail não chega
- Verifique a pasta de spam/lixo eletrônico
- Confirme se o `EMAIL_DESTINO` está correto
- Verifique os logs do console para erros

### Erro: "Environment variables not defined"
- Certifique-se de que o arquivo `.env.local` existe na raiz do projeto
- Reinicie o servidor de desenvolvimento após editar o `.env.local`
- Verifique se não há espaços extras nas variáveis de ambiente

## 🔒 Segurança

- ✅ Nunca commite o arquivo `.env.local` no Git
- ✅ Use senhas de app, nunca a senha principal do Gmail
- ✅ Limite o acesso às variáveis de ambiente
- ✅ Considere usar uma conta Gmail exclusiva para o sistema
- ✅ Monitore o uso da conta para detectar atividades suspeitas

## 📊 Próximos Passos

- [ ] Integrar envio de e-mail em todos os formulários
- [ ] Adicionar anexo de arquivos ao e-mail
- [ ] Implementar salvamento no Google Drive
- [ ] Criar banco de dados para armazenar histórico
- [ ] Adicionar sistema de confirmação por e-mail ao usuário

## 📞 Suporte

Se encontrar problemas ou tiver dúvidas, verifique:
1. Este documento de configuração
2. Os logs do console no navegador
3. Os logs do terminal do servidor

---

**Última atualização**: Janeiro de 2026
