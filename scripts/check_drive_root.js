require('dotenv').config();

const { google } = require('googleapis');
const fs = require('fs');

async function main() {
  const keyFile = process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY_PATH;
  const folderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;

  if (!keyFile) {
    throw new Error('GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY_PATH nao definido');
  }
  if (!folderId) {
    throw new Error('GOOGLE_DRIVE_ROOT_FOLDER_ID nao definido');
  }

  // Melhor DX: mostra qual Service Account esta sendo usada
  try {
    if (fs.existsSync(keyFile)) {
      const raw = fs.readFileSync(keyFile, 'utf8');
      const json = JSON.parse(raw);
      if (json?.client_email) {
        console.log('Service Account:', json.client_email);
      }
    }
  } catch {
    // Nao bloqueia o script por falha de leitura do JSON
  }

  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: ['https://www.googleapis.com/auth/drive'],
  });

  const drive = google.drive({ version: 'v3', auth });

  // 1) Tenta tratar como PASTA (files.get)
  try {
    const res = await drive.files.get({
      fileId: folderId,
      supportsAllDrives: true,
      fields: 'id,name,mimeType,driveId,parents,ownedByMe',
    });

    const info = res.data;
    console.log('Root folder info:', info);

    if (info.mimeType !== 'application/vnd.google-apps.folder') {
      console.warn('AVISO: O ID configurado nao parece ser uma pasta.');
    }

    if (!info.driveId) {
      console.warn(
        'AVISO: driveId ausente => essa pasta esta no Meu Drive (nao em Drive Compartilhado).\n' +
          'Service Account pode falhar com "do not have storage quota" nesse cenario.\n' +
          'Solucao: use uma pasta dentro de um Drive Compartilhado e atualize GOOGLE_DRIVE_ROOT_FOLDER_ID.'
      );
    } else {
      console.log('OK: Pasta esta em Drive Compartilhado (driveId presente).');
    }

    return;
  } catch (err) {
    const message = err?.message || String(err);
    const status = err?.code || err?.status;
    console.warn('files.get falhou:', message);

    // 2) Se falhou, pode ser: sem permissao OU o ID ser de DRIVE (Shared Drive) e nao de PASTA.
    // Tenta drives.get para diferenciar.
    try {
      const resDrive = await drive.drives.get({
        driveId: folderId,
        fields: 'id,name',
      });

      console.log('Esse ID parece ser um DRIVE COMPARTILHADO (drives.get OK):', resDrive.data);
      console.warn(
        'IMPORTANTE: Para upload, normalmente voce precisa informar o ID de uma PASTA dentro desse Drive,\n' +
          'ou garantir que o ID "0A..." esteja acessivel como pasta raiz.\n' +
          'Se o upload continuar falhando, crie/pegue o link de uma pasta dentro do Drive (ID geralmente comeca com "1")\n' +
          'e use esse ID em GOOGLE_DRIVE_ROOT_FOLDER_ID.'
      );
      return;
    } catch (err2) {
      // Mantem a mensagem original, mas melhora o guidance
      if (status === 404 || /File not found/i.test(message)) {
        console.error(
          'Erro: File not found. Isso quase sempre significa PERMISSAO: a Service Account nao tem acesso a esse recurso.\n' +
            'Solucao: no Google Drive, abra o Drive Compartilhado alvo > Gerenciar membros > adicione a Service Account como membro (ideal: Gerente de conteudo).'
        );
      } else {
        console.error('Erro:', message);
      }
      process.exit(1);
    }
  }
}

main().catch((err) => {
  console.error('Erro:', err?.message || err);
  process.exit(1);
});
