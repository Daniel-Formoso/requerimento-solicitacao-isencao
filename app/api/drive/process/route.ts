import { NextResponse } from "next/server";
import logger from "../../../../utils/logger";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const requerimentoLocalId = body?.requerimentoLocalId;

    if (!requerimentoLocalId || typeof requerimentoLocalId !== "string") {
      return NextResponse.json(
        { success: false, message: "requerimentoLocalId é obrigatório" },
        { status: 400 },
      );
    }

    // Fire-and-forget: agenda o processamento para nao atrasar a resposta.
    setTimeout(() => {
      import("../../../../services/driveReprocessServiceAuto")
        .then(({ processUploadsForRequerimentoLocalId }) => processUploadsForRequerimentoLocalId(requerimentoLocalId))
        .catch((err: any) => {
          logger.warn("Falha ao iniciar processamento automatico do Drive", {
            requerimentoLocalId,
            error: err?.message,
          });
        });
    }, 0);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    logger.warn("Erro no endpoint de processamento do Drive", { error: err?.message });
    return NextResponse.json(
      { success: false, message: "Erro ao iniciar processamento do Drive" },
      { status: 500 },
    );
  }
}
