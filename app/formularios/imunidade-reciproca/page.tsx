"use client";

import React, { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ComprovanteTaxa from "@/components/ComprovanteTaxa/ComprovanteTaxa";
import styles from "./page.module.css";
import HandshakeIcon from "@mui/icons-material/Handshake";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WarningIcon from "@mui/icons-material/Warning";
import AssignmentIcon from "@mui/icons-material/Assignment";

export default function ImunidadeReciprocaPage() {
  // Estados para controle de seções
  const [activeSection, setActiveSection] = useState(1);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [expandedSections, setExpandedSections] = useState<number[]>([]);

  // Toggle expansão de seção
  const toggleSection = (section: number) => {
    if (expandedSections.includes(section)) {
      setExpandedSections(expandedSections.filter((s) => s !== section));
    } else {
      setExpandedSections([...expandedSections, section]);
    }
  };

  // Função para iniciar o preenchimento do requerimento
  const handleStartFilling = () => {
    setActiveSection(1);
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
        icon={<HandshakeIcon sx={{ fontSize: 56, color: "#EB5F1A" }} />}
        processType="IMUNIDADE"
        title="Imunidade Recíproca"
        description="Imunidade para órgãos públicos federais, estaduais e municipais."
      />
      <main className={styles.main}>
        {/* Seção de Explicação */}
        <section className={styles.explanationSection}>
          <div className={styles.explanationContent}>
            <div className={styles.explanationImageContainer}>
              {/* Imagem para Desktop (Vertical) */}
              <Image
                src="/assets/entre-entes/orgao-.webp"
                alt="Órgão Público"
                width={300}
                height={300}
                className={`${styles.explanationImage} ${styles.explanationImageDesktop}`}
                priority
              />
              {/* Imagem para Mobile (Horizontal) */}
              <Image
                src="/assets/entre-entes/orgao-mobile.webp"
                alt="Órgão Público"
                width={800}
                height={400}
                className={`${styles.explanationImage} ${styles.explanationImageMobile}`}
                priority
              />
            </div>
            <div className={styles.explanationTextContainer}>
              <h2 className={styles.explanationTitle}>
                Imunidade Tributária Recíproca entre Entes Federativos
              </h2>
              <div className={styles.explanationText}>
                <p>
                  <strong>Quem tem direito?</strong> União, Estados, Distrito Federal e Municípios sobre imóveis de sua propriedade ou sob sua jurisdição.
                </p>
                <p>
                  <strong>O que você precisa saber:</strong>
                </p>
                <ul>
                  <li>Ser ente da federação (União, Estado, DF ou Município)</li>
                  <li>Imóvel de propriedade do ente público</li>
                  <li>Uso vinculado a finalidades essenciais</li>
                  <li>Apresentar documentação do órgão público</li>
                </ul>
                <p>
                  <strong>Documentos necessários:</strong> Documentação do ente público, certidão de matrícula do imóvel, comprovante de destinação do imóvel e outros documentos que serão solicitados ao longo do formulário.
                </p>
                <div className={styles.explanationAlert}>
                  <WarningIcon sx={{ fontSize: 24, color: "#EB5F1A" }} />
                  <span>
                    A imunidade recíproca é constitucional e permanente enquanto mantidas as condições.
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
              Solicitar Imunidade
            </button>
          </div>
        </section>

        <div className={styles.formContainer}>

        {/* Seção 1 - Taxas */}
        <section
          data-section="1"
          className={`${styles.section} ${
            activeSection === 1 ? styles.sectionActive : ""
          } ${completedSections.includes(1) ? styles.sectionCompleted : ""}`}
          style={{ opacity: activeSection >= 1 ? 1 : 0.5 }}
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
