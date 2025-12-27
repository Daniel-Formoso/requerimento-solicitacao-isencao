"use client";

import React, { useState } from "react";
import styles from "./ComprovanteTaxa.module.css";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import WarningIcon from "@mui/icons-material/Warning";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ComprovanteTaxaProps {
  titulo: string;
  onContinue: (guia: File | null, comprovante: File | null) => void;
  guiaInicial?: File | null;
  comprovanteInicial?: File | null;
}

export default function ComprovanteTaxa({ titulo, onContinue, guiaInicial, comprovanteInicial }: ComprovanteTaxaProps) {
  const [guia, setGuia] = useState<File | null>(null);
  const [comprovante, setComprovante] = useState<File | null>(null);
  const [guiaError, setGuiaError] = useState<boolean>(false);
  const [comprovanteError, setComprovanteError] = useState<boolean>(false);

  // Sincronizar com valores externos quando fornecidos
  React.useEffect(() => {
    if (guiaInicial) {
      setGuia(guiaInicial);
      setGuiaError(false);
    }
  }, [guiaInicial]);

  React.useEffect(() => {
    if (comprovanteInicial) {
      setComprovante(comprovanteInicial);
      setComprovanteError(false);
    }
  }, [comprovanteInicial]);

  // Validação de tamanho de arquivo (máximo 5MB)
  const validarTamanhoArquivo = (file: File): boolean => {
    const maxSize = 5 * 1024 * 1024; // 5MB em bytes
    if (file.size > maxSize) {
      const tamanhoMB = (file.size / (1024 * 1024)).toFixed(2);
      toast.error(`Arquivo muito grande! "${file.name}" possui ${tamanhoMB}MB. O tamanho máximo permitido é 5MB.`, {
        autoClose: 6000,
      });
      return false;
    }
    return true;
  };

  const handleGuiaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validarTamanhoArquivo(file)) {
        setGuia(file);
        setGuiaError(false);
      } else {
        e.target.value = ''; // Limpa o input
      }
    }
  };

  const handleComprovanteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validarTamanhoArquivo(file)) {
        setComprovante(file);
        setComprovanteError(false);
      } else {
        e.target.value = ''; // Limpa o input
      }
    }
  };

  const handleSubmit = () => {
    let hasError = false;

    if (!guia) {
      setGuiaError(true);
      hasError = true;
    }

    if (!comprovante) {
      setComprovanteError(true);
      hasError = true;
    }

    if (hasError) {
      return;
    }

    onContinue(guia, comprovante);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{titulo}</h1>

      <div className={styles.alertBox}>
        <div className={styles.alertContent}>
          <span className={styles.alertTitle}>
            <WarningIcon sx={{ fontSize: 28, color: "#EB5F1A" }} />
            ATENÇÃO
          </span>
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
          <a
            href="https://parcelamento.novaiguacu.rj.gov.br/taxa-abertura-processo-inicio"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkBoleto}
          >
            boleto da taxa de abertura
          </a> e realize o pagamento.
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

      {/* <div className={styles.divider}></div> */}

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
          {guiaError && !guia && (
            <p className={styles.fieldError}>
              <WarningIcon sx={{ fontSize: 16, marginRight: "4px" }} />
              Por favor, anexe o arquivo da guia
            </p>
          )}
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
          {comprovanteError && !comprovante && (
            <p className={styles.fieldError}>
              <WarningIcon sx={{ fontSize: 16, marginRight: "4px" }} />
              Por favor, anexe o arquivo do comprovante
            </p>
          )}
        </div>
      </div>

      <div className={styles.divider}></div>
      <button
        className={styles.continueButton}
        onClick={handleSubmit}
      >
        Continuar
      </button>
    </div>
  );
}
