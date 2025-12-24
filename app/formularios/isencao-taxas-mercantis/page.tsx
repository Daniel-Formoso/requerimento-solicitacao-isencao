"use client";

import React from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ComprovanteTaxa from "@/components/ComprovanteTaxa/ComprovanteTaxa";
import styles from "./page.module.css";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

export default function IsencaoTaxasMercantisPage() {
  const handleContinue = (guia: File | null, comprovante: File | null) => {
    console.log("Guia:", guia);
    console.log("Comprovante:", comprovante);
    // Aqui você poderá avançar para a próxima etapa do formulário
  };

  return (
    <div className={styles.page}>
      <Header 
        icon={<MonetizationOnIcon sx={{ fontSize: 56, color: "#EB5F1A" }} />}
        processType="ISENÇÃO"
        title="Taxas mercantis para Templos Religiosos"
        description="Isenção de taxas para templos religiosos."
      />
      <main className={styles.main}>
        <ComprovanteTaxa
          titulo="Comprovante da Taxa de Abertura"
          onContinue={handleContinue}
        />
      </main>
      <Footer />
    </div>
  );
}
