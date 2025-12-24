"use client";

import React from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ComprovanteTaxa from "@/components/ComprovanteTaxa/ComprovanteTaxa";
import styles from "./page.module.css";
import ChurchIcon from "@mui/icons-material/Church";

export default function IsencaoTemploReligiosoPage() {
  const handleContinue = (guia: File | null, comprovante: File | null) => {
    console.log("Guia:", guia);
    console.log("Comprovante:", comprovante);
    // Aqui você poderá avançar para a próxima etapa do formulário
  };

  return (
    <div className={styles.page}>
      <Header 
        icon={<ChurchIcon sx={{ fontSize: 56, color: "#EB5F1A" }} />}
        processType="ISENÇÃO"
        title="Templo Religioso"
        description="Imóvel destinado ao funcionamento de templos religiosos."
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
