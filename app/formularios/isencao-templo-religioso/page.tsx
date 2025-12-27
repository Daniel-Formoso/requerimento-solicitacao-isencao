"use client";

import React, { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ComprovanteTaxa from "@/components/ComprovanteTaxa/ComprovanteTaxa";
import styles from "./page.module.css";
import ChurchIcon from "@mui/icons-material/Church";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WarningIcon from "@mui/icons-material/Warning";
import AssignmentIcon from "@mui/icons-material/Assignment";

export default function IsencaoTemploReligiosoPage() {
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  const [completedSections, setCompletedSections] = useState<number[]>([]);

  const toggleSection = (section: number) => {
    if (expandedSections.includes(section)) {
      setExpandedSections(expandedSections.filter((s) => s !== section));
    } else {
      setExpandedSections([...expandedSections, section]);
    }
  };

  const handleStartFilling = () => {
    setExpandedSections([1]);
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
        icon={<ChurchIcon sx={{ fontSize: 56, color: "#EB5F1A" }} />}
        processType="ISENÇÃO"
        title="Templo Religioso"
        description="Imóvel destinado ao funcionamento de templos religiosos."
      />
      <main className={styles.main}>
        {/* Seção de Explicação */}
        <section className={styles.explanationSection}>
          <div className={styles.explanationContent}>
            <div className={styles.explanationImageContainer}>
              {/* Imagem para Desktop (Vertical) */}
              <Image
                src="/assets/isencao templo religioso/templo.webp"
                alt="Templo Religioso"
                width={300}
                height={300}
                className={`${styles.explanationImage} ${styles.explanationImageDesktop}`}
                priority
              />
              {/* Imagem para Mobile (Horizontal) */}
              <Image
                src="/assets/isencao templo religioso/templo-mobile.webp"
                alt="Templo Religioso"
                width={800}
                height={400}
                className={`${styles.explanationImage} ${styles.explanationImageMobile}`}
                priority
              />
            </div>
            <div className={styles.explanationTextContainer}>
              <h2 className={styles.explanationTitle}>
                Isenção de IPTU para Templos Religiosos
              </h2>
              <div className={styles.explanationText}>
                <p>
                  <strong>Quem tem direito?</strong> Templos de qualquer culto religioso que sejam utilizados exclusivamente para atividades religiosas, sem fins lucrativos.
                </p>
                <p>
                  <strong>O que você precisa saber:</strong>
                </p>
                <ul>
                  <li>O imóvel deve ser templo religioso</li>
                  <li>Uso exclusivo para atividades religiosas</li>
                  <li>Entidade sem fins lucrativos</li>
                  <li>Registro da instituição religiosa</li>
                </ul>
                <p>
                  <strong>Documentos necessários:</strong> Estatuto da entidade religiosa, certidão de matrícula do imóvel, comprovante de CNPJ, ata de eleição da diretoria e outros documentos que serão solicitados ao longo do formulário.
                </p>
                <div className={styles.explanationAlert}>
                  <WarningIcon sx={{ fontSize: 24, color: "#EB5F1A" }} />
                  <span>
                    Este requerimento tem validade de 5 anos e deve ser renovado após esse período.
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
              Solicitar Isenção
            </button>
          </div>
        </section>

        <div className={styles.formContainer}>
          {/* Seção 1 - Taxas */}
          <section
            data-section="1"
            className={`${styles.section} ${completedSections.includes(1) ? styles.sectionCompleted : ""}`}
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
                  titulo="01. Comprovante da Taxa de Abertura"
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
