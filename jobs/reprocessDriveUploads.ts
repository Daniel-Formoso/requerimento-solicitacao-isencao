import "dotenv/config";
import { processPendingUploads, reprocessFailedUploads } from "../services/driveReprocessService";

// Configurações básicas (podem vir de env futuramente)
const MAX_ATTEMPTS_PER_FILE = 5;
const MIN_MINUTES_SINCE_LAST_TRY = 10;

async function main() {
  try {
    await processPendingUploads({
      maxAttemptsPerFile: MAX_ATTEMPTS_PER_FILE,
      minMinutesSinceLastTry: MIN_MINUTES_SINCE_LAST_TRY,
    });
    await reprocessFailedUploads({
      maxAttemptsPerFile: MAX_ATTEMPTS_PER_FILE,
      minMinutesSinceLastTry: MIN_MINUTES_SINCE_LAST_TRY,
    });
    process.exit(0);
  } catch (err: any) {
    console.error("Job de reprocessamento falhou", err);
    process.exit(1);
  }
}

main();
