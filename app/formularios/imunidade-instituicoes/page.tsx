"use client";

import React, { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ComprovanteTaxa from "@/components/ComprovanteTaxa/ComprovanteTaxa";
import styles from "./page.module.css";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WarningIcon from "@mui/icons-material/Warning";
import AssignmentIcon from "@mui/icons-material/Assignment";

export default function ImunidadeInstituicoesPage() {
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
        icon={<VolunteerActivismIcon sx={{ fontSize: 56, color: "#EB5F1A" }} />}
        processType="IMUNIDADE"
        title="Instituições sem fins lucrativos"
        description="Imunidade para instituições sociais."
      />
      <main className={styles.main}>
        {/* Seção de Explicação */}
        <section className={styles.explanationSection}>
          <div className={styles.explanationContent}>
            <div className={styles.explanationImageContainer}>
              {/* Imagem para Desktop (Vertical) */}
              <Image
                src="/assets/instituicao sem fins lucrativos/ong.webp"
                alt="Instituição sem Fins Lucrativos"
                width={300}
                height={300}
                className={`${styles.explanationImage} ${styles.explanationImageDesktop}`}
                priority
              />
              {/* Imagem para Mobile (Horizontal) */}
              <Image
                src="/assets/instituicao sem fins lucrativos/ong-mobile.webp"
                alt="Instituição sem Fins Lucrativos"
                width={800}
                height={400}
                className={`${styles.explanationImage} ${styles.explanationImageMobile}`}
                priority
              />
            </div>
            <div className={styles.explanationTextContainer}>
              <h2 className={styles.explanationTitle}>
                Imunidade Tributária para Instituições sem Fins Lucrativos
              </h2>
              <div className={styles.explanationText}>
                <p>
                  <strong>Quem tem direito?</strong> Instituições de educação e assistência social sem fins lucrativos que atendam aos requisitos constitucionais e legais.
                </p>
                <p>
                  <strong>O que você precisa saber:</strong>
                </p>
                <ul>
                  <li>Ser instituição de educação ou assistência social</li>
                  <li>Não ter fins lucrativos</li>
                  <li>Aplicar integralmente os recursos nas atividades institucionais</li>
                  <li>Manter escrituração contábil regular</li>
                </ul>
                <p>
                  <strong>Documentos necessários:</strong> Estatuto social, certidão de registro, certificado de entidade beneficente (se aplicável), demonstrações contábeis e outros documentos que serão solicitados ao longo do formulário.
                </p>
                <div className={styles.explanationAlert}>
                  <WarningIcon sx={{ fontSize: 24, color: "#EB5F1A" }} />
                  <span>
                    A imunidade deve ser renovada anualmente mediante comprovação dos requisitos.
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
