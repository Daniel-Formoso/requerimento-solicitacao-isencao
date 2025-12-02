import React from "react";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.content}>
          <svg
            className={styles.logo}
            width="60"
            height="60"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="60" height="60" rx="12" fill="#EB5F1A" />
            <path
              d="M30 15L20 22V38L30 45L40 38V22L30 15Z"
              fill="white"
              stroke="white"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M30 25V35M25 30H35"
              stroke="#EB5F1A"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          <div className={styles.textContent}>
            <h1 className={styles.title}>Portal de Isenção e Imunidade</h1>
            <p className={styles.subtitle}>
              Selecione o tipo de processo para iniciar
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
