"use client";

import React, { useEffect, useState } from "react";
import styles from "./LoadingModal.module.css";
import LightbulbIcon from '@mui/icons-material/Lightbulb';

interface LoadingModalProps {
  isOpen: boolean;
  estimatedTime?: number; // tempo estimado em segundos
}

export default function LoadingModal({
  isOpen,
  estimatedTime = 5,
}: LoadingModalProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setElapsedTime(0);
      setProgress(0);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(elapsed);
      
      // Calcula o progresso baseado no tempo estimado
      const progressPercentage = Math.min((elapsed / estimatedTime) * 100, 95);
      setProgress(progressPercentage);
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, estimatedTime]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.spinnerContainer}>
          <div className={styles.spinner}></div>
        </div>

        <h2 className={styles.title}>Enviando Requerimento...</h2>
        <p className={styles.message}>
          Aguarde enquanto processamos e enviamos seus dados.
        </p>

        <div className={styles.timeInfo}>
          <div className={styles.timeLabel}>Tempo Decorrido</div>
          <div className={styles.timeValue}>
            {elapsedTime}s
          </div>
          <div className={styles.timeLabel} style={{ marginTop: "10px" }}>
            Tempo Médio: {estimatedTime}s
          </div>
        </div>

        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p className={styles.tip}>
          <LightbulbIcon style={{ verticalAlign: "middle", marginRight: "8px", color: "#eb5f1a" }} />
          Não feche esta janela até concluir o envio
        </p>
      </div>
    </div>
  );
}
