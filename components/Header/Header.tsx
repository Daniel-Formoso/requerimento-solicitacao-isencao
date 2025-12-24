"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./Header.module.css";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SearchIcon from "@mui/icons-material/Search";

interface HeaderProps {
  icon?: React.ReactNode;
  processType?: string;
  title?: string;
  description?: string;
}

export default function Header({ icon, processType, title, description }: HeaderProps) {
  const router = useRouter();

  const handleHelpClick = () => {
    router.push("/faq");
  };

  const handleSearchClick = () => {
    // Aqui será implementado o modal de consulta de processos
    router.push("http://contribuinte.novaiguacu.rj.gov.br/#processos");
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div className={styles.logo}>
            <a href="/">
            <img src="/assets/logo.png" alt="Logo da Prefeitura" />
            </a>
          </div>

          <nav className={styles.navigation}>
            <button onClick={handleHelpClick} className={styles.navLink}>
              <HelpOutlineIcon sx={{ fontSize: 20 }} />
              <span>FAQ</span>
            </button>
            <button onClick={handleSearchClick} className={styles.navLink}>
              <SearchIcon sx={{ fontSize: 20 }} />
              <span>Consultar Processos</span>
            </button>
          </nav>
        </div>

        <div className={styles.titleSection}>
          {icon ? (
            <div className={styles.formHeader}>
              <div className={styles.topRow}>
                <div className={styles.iconWrapper}>
                  {icon}
                </div>
                <h1 className={styles.title}>
                  {title}
                </h1>
              </div>
              {processType && (
                <span className={styles.processType}>{processType}</span>
              )}
            </div>
          ) : (
            <div className={styles.defaultHeader}>
              <h1 className={styles.title}>
                {title || "Requerimento de Solicitação de Isenção e Imunidade"}
              </h1>
              <p className={styles.subtitle}>
                {description || (
                  <>
                    Escolha abaixo o processo que deseja solicitar a{" "}
                    <span>isenção ou imunidade de IPTU.</span>
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
