// helpers/retryDriveUpload.js
// Retry simples para upload no Google Drive com logs estruturados

async function retryDriveUpload(uploadFn, options = {}) {
  const {
    maxAttempts = 3,
    delays = [1000, 3000, 5000],
    logger,
    logMeta = {},
  } = options;

  let attempt = 0;
  let lastError = null;

  while (attempt < maxAttempts) {
    try {
      const result = await uploadFn();
      return { result, attempts: attempt + 1, lastError: null };
    } catch (err) {
      lastError = err;
      attempt++;
      if (attempt < maxAttempts) {
        if (logger) {
          logger.warn("Tentativa de upload para o Drive falhou, nova tentativa agendada", {
            ...logMeta,
            attempt,
            error: err.message,
          });
        }
        await new Promise(res => setTimeout(res, delays[attempt - 1] || delays[delays.length - 1]));
      }
    }
  }

  return { result: null, attempts: attempt, lastError };
}

module.exports = retryDriveUpload;
