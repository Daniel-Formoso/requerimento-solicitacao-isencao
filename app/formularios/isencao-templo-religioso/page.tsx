"use client";

import React from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ComprovanteTaxa from "@/components/ComprovanteTaxa/ComprovanteTaxa";
import styles from "./page.module.css";

export default function IsencaoTemploReligiosoPage() {
  const handleContinue = (guia: File | null, comprovante: File | null) => {
    console.log("Guia:", guia);
    console.log("Comprovante:", comprovante);
    // Aqui você poderá avançar para a próxima etapa do formulário
  };

  return (
    <div className={styles.page}>
      <Header />
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
