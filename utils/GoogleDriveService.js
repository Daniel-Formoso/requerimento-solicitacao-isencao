// GoogleDriveService.js
// Serviço responsável pela integração com o Google Drive usando Service Account
// Requisitos: Node.js, googleapis, variáveis de ambiente para credenciais e pasta raiz

const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const { Readable } = require('stream');

function escapeDriveQueryValue(value) {
  // Drive query strings usam aspas simples
  return String(value).replace(/'/g, "\\'");
}

function looksLikeSharedDriveId(id) {
  // Shared Drive IDs normalmente comecam com "0A".
  return typeof id === 'string' && id.startsWith('0A');
}

// Função utilitária para sanitizar nomes de pastas/arquivos
function sanitizeName(name) {
  // Remove caracteres inválidos para nomes no Google Drive
  return name
    .replace(/[\\/:*?"<>|]/g, '') // Remove caracteres proibidos
    .replace(/\s+/g, ' ')           // Normaliza espaços
    .trim();                         // Remove espaços nas extremidades
}

class GoogleDriveService {
  constructor() {
    this.drive = google.drive({
      version: 'v3',
      auth: new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY_PATH,
        // Para Shared Drives, use escopo completo (a conta de servico continua limitada ao que foi compartilhado com ela)
        scopes: ['https://www.googleapis.com/auth/drive'],
      }),
    });
    this.rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
  }

  // Verifica se uma pasta existe dentro de um parentId, retorna o id se existir
  async findFolderByName(name, parentId) {
    const sanitized = sanitizeName(name);
    const safeName = escapeDriveQueryValue(sanitized);
    try {
      const baseListParams = {
        fields: 'files(id, name)',
        spaces: 'drive',
        // Shared Drive compat
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
        corpora: looksLikeSharedDriveId(parentId) ? 'drive' : 'allDrives',
        ...(looksLikeSharedDriveId(parentId) ? { driveId: parentId } : {}),
      };

      // 1) Tentativa rapida: match exato pelo nome
      const listParams = {
        q: `name='${safeName}' and mimeType='application/vnd.google-apps.folder' and '${parentId}' in parents and trashed=false`,
        ...baseListParams,
      };

      const res = await this.drive.files.list(listParams);

      if (res.data.files[0]) {
        return res.data.files[0].id;
      }

      // 2) Fallback: match case-insensitive (evita criar pastas duplicadas quando muda a capitalizacao)
      const resAll = await this.drive.files.list({
        q: `mimeType='application/vnd.google-apps.folder' and '${parentId}' in parents and trashed=false`,
        pageSize: 1000,
        ...baseListParams,
      });

      const wanted = String(sanitized).toLowerCase();
      const match = (resAll.data.files || []).find((f) => String(f.name || '').toLowerCase() === wanted);
      return match ? match.id : null;
    } catch (err) {
      throw new Error('Erro ao buscar pasta no Drive: ' + err.message);
    }
  }

  // Cria uma pasta dentro de um parentId
  async createFolder(name, parentId) {
    const sanitized = sanitizeName(name);
    try {
      const res = await this.drive.files.create({
        resource: {
          name: sanitized,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [parentId],
        },
        fields: 'id',
        // Shared Drive compat
        supportsAllDrives: true,
      });
      return res.data.id;
    } catch (err) {
      throw new Error('Erro ao criar pasta no Drive: ' + err.message);
    }
  }

  // Obtém o id da pasta, criando se não existir (idempotente)
  async getOrCreateFolder(name, parentId) {
    let folderId = await this.findFolderByName(name, parentId);
    if (!folderId) {
      folderId = await this.createFolder(name, parentId);
    }
    return folderId;
  }

  // Faz upload de arquivo para o Drive na estrutura correta
  async uploadFile({
    localFilePath,
    formName,
    requerimentoId,
    pessoaNome,
    finalFileName,
  }) {
    // Sanitiza nomes
    const sanitizedForm = sanitizeName(formName);
    const sanitizedPessoa = sanitizeName(pessoaNome);
    const sanitizedFileName = sanitizeName(finalFileName);
    const requerimentoFolderName = `${requerimentoId} - ${sanitizedPessoa}`;

    try {
      // Garante que o arquivo existe antes de abrir stream (evita crash por erro nao tratado do ReadStream)
      if (!fs.existsSync(localFilePath)) {
        throw new Error(`Arquivo local nao encontrado: ${localFilePath}`);
      }

      // 1. Obter/criar pasta do formulário
      const formFolderId = await this.getOrCreateFolder(sanitizedForm, this.rootFolderId);
      // 2. Obter/criar pasta do requerimento
      const reqFolderId = await this.getOrCreateFolder(requerimentoFolderName, formFolderId);
      // 3. Fazer upload do arquivo
      const fileMetadata = {
        name: sanitizedFileName,
        parents: [reqFolderId],
      };

      const stream = fs.createReadStream(localFilePath);
      // Evita unhandled 'error' event no stream
      stream.on('error', () => {});
      const media = {
        mimeType: 'application/pdf', // Ajuste conforme necessário
        body: stream,
      };
      const res = await this.drive.files.create({
        resource: fileMetadata,
        media,
        fields: 'id, webViewLink',
        // Shared Drive compat
        supportsAllDrives: true,
      });
      return {
        fileId: res.data.id,
        webViewLink: res.data.webViewLink,
      };
    } catch (err) {
      // Não altera nem apaga o arquivo local
      throw new Error('Erro ao fazer upload para o Drive: ' + err.message);
    }
  }

  async uploadFileToRootFolder({
    localFilePath,
    driveFolderName,
    finalFileName,
    mimeType,
  }) {
    const sanitizedFolder = sanitizeName(driveFolderName);
    const sanitizedFileName = sanitizeName(finalFileName);

    try {
      if (!fs.existsSync(localFilePath)) {
        throw new Error(`Arquivo local nao encontrado: ${localFilePath}`);
      }

      const submissionFolderId = await this.getOrCreateFolder(sanitizedFolder, this.rootFolderId);

      const fileMetadata = {
        name: sanitizedFileName,
        parents: [submissionFolderId],
      };

      const stream = fs.createReadStream(localFilePath);
      stream.on('error', () => {});
      const media = {
        mimeType: mimeType || 'application/octet-stream',
        body: stream,
      };

      const res = await this.drive.files.create({
        resource: fileMetadata,
        media,
        fields: 'id, webViewLink',
        supportsAllDrives: true,
      });

      return {
        fileId: res.data.id,
        webViewLink: res.data.webViewLink,
      };
    } catch (err) {
      throw new Error('Erro ao fazer upload para o Drive: ' + err.message);
    }
  }

  async getOrCreateFolderPath(folderNames) {
    let currentParentId = this.rootFolderId;
    for (const name of folderNames) {
      currentParentId = await this.getOrCreateFolder(name, currentParentId);
    }
    return currentParentId;
  }

  async uploadFileToPath({
    localFilePath,
    folderPath,
    finalFileName,
    mimeType,
  }) {
    try {
      if (!Array.isArray(folderPath) || folderPath.length === 0) {
        throw new Error('folderPath invalido');
      }
      if (!fs.existsSync(localFilePath)) {
        throw new Error(`Arquivo local nao encontrado: ${localFilePath}`);
      }

      const sanitizedFileName = sanitizeName(finalFileName);
      const parentId = await this.getOrCreateFolderPath(folderPath.map(sanitizeName));

      const fileMetadata = {
        name: sanitizedFileName,
        parents: [parentId],
      };

      const stream = fs.createReadStream(localFilePath);
      stream.on('error', () => {});
      const media = {
        mimeType: mimeType || 'application/octet-stream',
        body: stream,
      };

      const res = await this.drive.files.create({
        resource: fileMetadata,
        media,
        fields: 'id, webViewLink',
        supportsAllDrives: true,
      });

      return {
        fileId: res.data.id,
        webViewLink: res.data.webViewLink,
      };
    } catch (err) {
      throw new Error('Erro ao fazer upload para o Drive: ' + err.message);
    }
  }

  async uploadTextToRootFolder({
    driveFolderName,
    finalFileName,
    content,
  }) {
    const sanitizedFolder = sanitizeName(driveFolderName);
    const sanitizedFileName = sanitizeName(finalFileName);

    try {
      const submissionFolderId = await this.getOrCreateFolder(sanitizedFolder, this.rootFolderId);
      const fileMetadata = {
        name: sanitizedFileName,
        parents: [submissionFolderId],
      };

      const media = {
        mimeType: 'text/plain',
        body: Readable.from([String(content || '')]),
      };

      const res = await this.drive.files.create({
        resource: fileMetadata,
        media,
        fields: 'id, webViewLink',
        supportsAllDrives: true,
      });

      return {
        fileId: res.data.id,
        webViewLink: res.data.webViewLink,
      };
    } catch (err) {
      throw new Error('Erro ao fazer upload para o Drive: ' + err.message);
    }
  }
}

module.exports = GoogleDriveService;
