import React from "react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer} suppressHydrationWarning>
      <div className={styles.container} suppressHydrationWarning>
        <div className={styles.logo}>
          <img src="/assets/logo.png" alt="Logo da Prefeitura de Nova Iguaçu" />
        </div>
        <div className={styles.divider}></div>
        <div className={styles.info}>
          <p className={styles.copyright}>© 2025 Prefeitura de Nova Iguaçu.</p>
          <p className={styles.copyright}>
            <strong>Horário de Funcionamento: De 09h às 17h.</strong>
          </p>
          <p className={styles.copyright}>
            Rua Athaide Pimenta de Moraes, 528 - Centro, Nova Iguaçu, Rio de
            Janeiro - CEP: 26.210-190
          </p>
          <p className={styles.copyright}>CNPJ: 29.138.278/0001-01</p>
        </div>
      </div>
    </footer>
  );
}
