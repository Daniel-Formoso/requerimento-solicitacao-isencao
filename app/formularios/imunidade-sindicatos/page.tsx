"use client";

import React, { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ComprovanteTaxa from "@/components/ComprovanteTaxa/ComprovanteTaxa";
import styles from "./page.module.css";
import GroupsIcon from "@mui/icons-material/Groups";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WarningIcon from "@mui/icons-material/Warning";
import AssignmentIcon from "@mui/icons-material/Assignment";

export default function ImunidadeSindicatosPage() {
  const [activeSection, setActiveSection] = useState(1);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [expandedSections, setExpandedSections] = useState<number[]>([]);

  const toggleSection = (section: number) => {
    if (expandedSections.includes(section)) {
      setExpandedSections(expandedSections.filter((s) => s !== section));
    } else {
      setExpandedSections([...expandedSections, section]);
    }
  };

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
        icon={<GroupsIcon sx={{ fontSize: 56, color: "#EB5F1A" }} />}
        processType="IMUNIDADE"
        title="Sindicatos e outras classes"
        description="Imunidade para sindicatos e órgãos de classe."
      />
      <main className={styles.main}>
        {/* Seção de Explicação */}
        <section className={styles.explanationSection}>
          <div className={styles.explanationContent}>
            <div className={styles.explanationImageContainer}>
              <Image
                src="/assets/sindicatos/sindicatos.webp"
                alt="Sindicatos"
                width={300}
                height={300}
                className={styles.explanationImage}
                priority
              />
            </div>
            <div className={styles.explanationTextContainer}>
              <h2 className={styles.explanationTitle}>
                Imunidade Tributária para Sindicatos de Trabalhadores
              </h2>
              <div className={styles.explanationText}>
                <p>
                  <strong>Quem tem direito?</strong> Sindicatos de trabalhadores devidamente registrados que utilizem o imóvel para suas finalidades essenciais, sem fins lucrativos.
                </p>
                <p>
                  <strong>O que você precisa saber:</strong>
                </p>
                <ul>
                  <li>Ser sindicato de trabalhadores registrado</li>
                  <li>Uso do imóvel para atividades sindicais</li>
                  <li>Não ter fins lucrativos</li>
                  <li>Aplicar recursos nas finalidades institucionais</li>
                </ul>
                <p>
                  <strong>Documentos necessários:</strong> Estatuto do sindicato, registro no Ministério do Trabalho, ata de eleição da diretoria, certidão de matrícula do imóvel e outros documentos que serão solicitados ao longo do formulário.
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
              Preencher Requerimento
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
