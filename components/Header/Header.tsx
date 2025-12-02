import React from "react";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.logo}>
            <img src="/assets/logo.png" alt="Logo"/>
          </div>

          <div className={styles.textContent}>
            <h1 className={styles.title}>Portal de Solicitação de Isenção e Imunidade</h1>
            {/* <p className={styles.subtitle}>
              Selecione o tipo de processo para iniciar
            </p> */}
          </div>
        </div>
      </div>
    </header>
  );
}
