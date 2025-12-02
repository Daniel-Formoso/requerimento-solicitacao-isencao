"use client";

import React from "react";
import styles from "./Header.module.css";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SearchIcon from "@mui/icons-material/Search";

export default function Header() {
  const handleHelpClick = () => {
    // Aqui será implementado o modal de dúvidas frequentes
    console.log("Abrir modal de dúvidas frequentes");
  };

  const handleSearchClick = () => {
    // Aqui será implementado o modal de consulta de processos
    console.log("Abrir consulta de processos");
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div className={styles.logo}>
            <img src="/assets/logo.png" alt="Logo da Prefeitura" />
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
          <h1 className={styles.title}>
            Requerimento de Solicitação de Isenção e Imunidade
          </h1>
          <p className={styles.subtitle}>
            Escolha abaixo o processo que deseja solicitar a{" "}
            <span>isenção de IPTU.</span>
          </p>
        </div>
      </div>
    </header>
  );
}
