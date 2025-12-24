"use client";

import React from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ComprovanteTaxa from "@/components/ComprovanteTaxa/ComprovanteTaxa";
import styles from "./page.module.css";
import AccessibleIcon from "@mui/icons-material/Accessible";

export default function IsencaoPcdPage() {
  const handleContinue = (guia: File | null, comprovante: File | null) => {
    console.log("Guia:", guia);
    console.log("Comprovante:", comprovante);
    // Aqui você poderá avançar para a próxima etapa do formulário
  };

  return (
    <div className={styles.page}>
      <Header 
        icon={<AccessibleIcon sx={{ fontSize: 56, color: "#EB5F1A" }} />}
        processType="ISENÇÃO"
        title="Pessoa com Deficiência (PCD)"
        description="Imóvel de PCD ou ascendente direto, único e residencial."
      />
      <main className={styles.main}>
        <ComprovanteTaxa
          titulo="01. Comprovante da Taxa de Abertura"
          onContinue={handleContinue}
        />
      </main>
      <Footer />
    </div>
  );
}
