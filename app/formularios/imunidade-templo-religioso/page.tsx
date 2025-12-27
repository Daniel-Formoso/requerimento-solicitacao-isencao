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

export default function ImunidadeTemploReligiosoPage() {
  // Estado para controlar qual seção está expandida
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  const [completedSections, setCompletedSections] = useState<number[]>([]);

  // Estados da Seção 1 - Taxas
  const [guia, setGuia] = useState<File | null>(null);
  const [comprovante, setComprovante] = useState<File | null>(null);

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
    setGuia(guia);
    setComprovante(comprovante);
    if (guia && comprovante) {
      if (!completedSections.includes(1)) {
        setCompletedSections([...completedSections, 1]);
      }
    }
    // Aqui você poderá avançar para a próxima etapa do formulário
  };

  return (
    <div className={styles.page}>
      <Header 
        icon={<ChurchIcon sx={{ fontSize: 56, color: "#EB5F1A" }} />}
        processType="IMUNIDADE"
        title="Imunidade para Templo Religioso"
        description="Imóvel destinado ao funcionamento de templos religiosos."
      />
      <main className={styles.main}>
        {/* Seção de Explicação */}
        <section className={styles.explanationSection}>
          <div className={styles.explanationContent}>
            <div className={styles.explanationImageContainer}>
              {/* Imagem para Desktop (Vertical) */}
              <Image
                src="/assets/imunidade templo religioso/imunidade.webp"
                alt="Templo Religioso"
                width={300}
                height={300}
                className={`${styles.explanationImage} ${styles.explanationImageDesktop}`}
                priority
              />
              {/* Imagem para Mobile (Horizontal) */}
              <Image
                src="/assets/imunidade templo religioso/imunidade-mobile.webp"
                alt="Templo Religioso"
                width={800}
                height={400}
                className={`${styles.explanationImage} ${styles.explanationImageMobile}`}
                priority
              />
            </div>
            <div className={styles.explanationTextContainer}>
              <h2 className={styles.explanationTitle}>
                Imunidade Tributária para Templos Religiosos
              </h2>
              <div className={styles.explanationText}>
                <p>
                  <strong>Quem tem direito?</strong> Templos de qualquer culto religioso, assegurada pela Constituição Federal, para imóveis utilizados em suas atividades essenciais.
                </p>
                <p>
                  <strong>O que você precisa saber:</strong>
                </p>
                <ul>
                  <li>Ser templo de qualquer culto religioso</li>
                  <li>Imóvel utilizado para atividades religiosas</li>
                  <li>Vedação à distribuição de lucros</li>
                  <li>Aplicação de recursos nas finalidades essenciais</li>
                </ul>
                <p>
                  <strong>Documentos necessários:</strong> Estatuto da entidade religiosa, comprovante de CNPJ, ata de eleição da diretoria, certidão de matrícula do imóvel e outros documentos que serão solicitados ao longo do formulário.
                </p>
                <div className={styles.explanationAlert}>
                  <WarningIcon sx={{ fontSize: 24, color: "#EB5F1A" }} />
                  <span>
                    A imunidade é constitucional e permanente enquanto mantidas as condições previstas.
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
                  guiaInicial={guia}
                  comprovanteInicial={comprovante}
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
