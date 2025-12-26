"use client";

import React, { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ComprovanteTaxa from "@/components/ComprovanteTaxa/ComprovanteTaxa";
import styles from "./page.module.css";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WarningIcon from '@mui/icons-material/Warning';
import AssignmentIcon from '@mui/icons-material/Assignment';

export default function IsencaoTaxasMercantisPage() {
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  const [completedSections, setCompletedSections] = useState<number[]>([]);

  // Função para alternar expansão das seções
  const toggleSection = (sectionNumber: number) => {
    if (expandedSections.includes(sectionNumber)) {
      setExpandedSections(expandedSections.filter((s) => s !== sectionNumber));
    } else {
      setExpandedSections([...expandedSections, sectionNumber]);
    }
  };

  // Função para iniciar o preenchimento do requerimento
  const handleStartFilling = () => {
    setExpandedSections([1]);
    // Rolar até a seção 1
    setTimeout(() => {
      const section1 = document.querySelector('[data-section="1"]');
      if (section1) {
        section1.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

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
        {/* Seção de Explicação */}
        <section className={styles.explanationSection}>
          <div className={styles.explanationContent}>
            <div className={styles.explanationImageContainer}>
              <Image
                src="/assets/taxas mercantis/taxa.webp"
                alt="Taxas Mercantis"
                width={300}
                height={300}
                className={styles.explanationImage}
                priority
              />
            </div>
            <div className={styles.explanationTextContainer}>
              <h2 className={styles.explanationTitle}>
                Isenção de Taxas Mercantis
              </h2>
              <div className={styles.explanationText}>
                <p>
                  <strong>Quem tem direito?</strong> Microempreendedores individuais (MEI) e microempresas que atendam aos requisitos estabelecidos pela legislação municipal.
                </p>
                <p>
                  <strong>O que você precisa saber:</strong>
                </p>
                <ul>
                  <li>Estar enquadrado como MEI ou microempresa</li>
                  <li>Estar em dia com obrigações fiscais</li>
                  <li>Atividade deve estar regularizada</li>
                  <li>Faturamento dentro dos limites estabelecidos</li>
                </ul>
                <p>
                  <strong>Documentos necessários:</strong> Certificado MEI ou contrato social, comprovante de inscrição municipal, certidões negativas, comprovante de endereço e outros documentos que serão solicitados ao longo do formulário.
                </p>
                <div className={styles.explanationAlert}>
                  <WarningIcon sx={{ fontSize: 24, color: "#EB5F1A" }} />
                  <span>
                    Este requerimento deve ser renovado anualmente.
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.explanationButtonContainer}>
            <button 
              className={styles.btnStartFilling} 
              onClick={handleStartFilling}
            >
              <AssignmentIcon sx={{ fontSize: 24 }} />
              Preencher Requerimento
            </button>
          </div>
        </section>

        <div className={styles.formContainer}>

        {/* Seção 1 - Taxas */}
        <section
          data-section="1"
          className={styles.section}
        >
          <div
            className={styles.sectionHeader}
            onClick={() => toggleSection(1)}
            style={{ cursor: "pointer" }}
          >
            <h2 className={styles.sectionTitle}>
              01. Comprovante da Taxa de Abertura
            </h2>
            <div className={styles.sectionHeaderIcons}>
              {completedSections.includes(1) && (
                <CheckCircleIcon className={styles.checkIcon} />
              )}
              <ExpandMoreIcon
                className={`${styles.expandIcon} ${
                  expandedSections.includes(1) ? styles.expandIconOpen : ""
                }`}
              />
            </div>
          </div>

          {expandedSections.includes(1) && (
            <div className={styles.sectionContent}>
              <ComprovanteTaxa
                titulo=""
                onContinue={handleContinue}
              />
            </div>
          )}
        </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
