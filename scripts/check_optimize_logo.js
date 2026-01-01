const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const logoPath = path.join(process.cwd(), 'public', 'assets', 'logo.png');
const outPath = path.join(process.cwd(), 'public', 'assets', 'logo.optimized.jpg');

(async () => {
  try {
    const stat = fs.statSync(logoPath);
    console.log(`Original: ${logoPath} - ${stat.size} bytes`);
  } catch (err) {
    console.error('Erro: não foi possível ler o arquivo original. Detalhe:', err.message);
    process.exit(1);
  }

  try {
    await sharp(logoPath)
      .resize({ width: 300 })
      .jpeg({ quality: 80 })
      .toFile(outPath);

    const stat2 = fs.statSync(outPath);
    console.log(`Otimizada: ${outPath} - ${stat2.size} bytes`);
    console.log('Arquivo otimizado gerado com sucesso. Revisar `public/assets/logo.optimized.jpg`.');
    process.exit(0);
  } catch (err) {
    console.error('Erro ao otimizar com sharp:', err.message);
    process.exit(2);
  }
})();
