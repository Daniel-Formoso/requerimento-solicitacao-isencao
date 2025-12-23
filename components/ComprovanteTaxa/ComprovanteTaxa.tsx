"use client";

import React, { useState } from "react";
import styles from "./ComprovanteTaxa.module.css";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import WarningIcon from "@mui/icons-material/Warning";

interface ComprovanteTaxaProps {
  titulo: string;
  onContinue: (guia: File | null, comprovante: File | null) => void;
}

export default function ComprovanteTaxa({ titulo, onContinue }: ComprovanteTaxaProps) {
  const [guia, setGuia] = useState<File | null>(null);
  const [comprovante, setComprovante] = useState<File | null>(null);

  const handleGuiaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setGuia(e.target.files[0]);
    }
  };

  const handleComprovanteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setComprovante(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    onContinue(guia, comprovante);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{titulo}</h1>

      <div className={styles.alertBox}>
        <div className={styles.alertIcon}>
          <WarningIcon sx={{ fontSize: 28, color: "#EB5F1A" }} />
        </div>
        <div className={styles.alertContent}>
          <strong>ATENÇÃO</strong>
          <p>
            Para prosseguir com o preenchimento do formulário, é obrigatório o
            pagamento prévio da guia e o anexo do comprovante.
          </p>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>1. Pagamento da Guia de Abertura</h2>
        <p className={styles.sectionText}>
          Se você ainda não pagou: Acesse o Portal do Contribuinte para gerar o{" "}
          <strong>boleto da taxa de abertura</strong> e realize o pagamento.
        </p>
        <p className={styles.attention}>
          <strong>Atenção:</strong> Você deve salvar o Comprovante de Pagamento
          (em PDF) no seu dispositivo, para ser enviado posteriormente
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          2. Envio da Guia e do Comprovante de Pagamento
        </h2>
        <p className={styles.sectionText}>
          Se você já pagou, utilize o campo abaixo para anexar o comprovante de
          pagamento. Após anexar o comprovante, você poderá seguir normalmente
          preenchendo o requerimento de abertura do seu processo.
        </p>
      </div>

      <div className={styles.uploadSection}>
        <div className={styles.uploadField}>
          <label className={styles.label}>
            Guia <span className={styles.required}>*</span>
          </label>
          <label className={styles.uploadButton}>
            <CloudUploadIcon sx={{ marginRight: "8px" }} />
            Anexar arquivo
            <input
              type="file"
              accept=".pdf"
              onChange={handleGuiaChange}
              className={styles.fileInput}
            />
          </label>
          {guia && <p className={styles.fileName}>{guia.name}</p>}
        </div>

        <div className={styles.uploadField}>
          <label className={styles.label}>
            Comprovante <span className={styles.required}>*</span>
          </label>
          <label className={styles.uploadButton}>
            <CloudUploadIcon sx={{ marginRight: "8px" }} />
            Anexar arquivo
            <input
              type="file"
              accept=".pdf"
              onChange={handleComprovanteChange}
              className={styles.fileInput}
            />
          </label>
          {comprovante && <p className={styles.fileName}>{comprovante.name}</p>}
        </div>
      </div>

      <button
        className={styles.continueButton}
        onClick={handleSubmit}
      >
        Avançar
      </button>
    </div>
  );
}
