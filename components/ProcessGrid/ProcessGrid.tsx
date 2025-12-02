"use client";

import React from "react";
import ProcessCard from "../ProcessCard/ProcessCard";
import styles from "./ProcessGrid.module.css";

export default function ProcessGrid() {
  const processes = [
    {
      id: 1,
      title: "Isenção de IPTU – Entidade Religiosa",
      description: "Inicie o processo digital de solicitação",
      icon: (
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M32 8L12 22V48H24V36C24 33.7909 25.7909 32 28 32H36C38.2091 32 40 33.7909 40 36V48H52V22L32 8Z"
            fill="currentColor"
            opacity="0.2"
          />
          <path
            d="M32 8L12 22M32 8L52 22M32 8V4M12 22V48H24V36C24 33.7909 25.7909 32 28 32H36C38.2091 32 40 33.7909 40 36V48H52V22M12 22L8 25M52 22L56 25"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: 2,
      title: "Isenção de IPTU – Entidade Assistencial",
      description: "Inicie o processo digital de solicitação",
      icon: (
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M32 56C45.2548 56 56 45.2548 56 32C56 18.7452 45.2548 8 32 8C18.7452 8 8 18.7452 8 32C8 45.2548 18.7452 56 32 56Z"
            fill="currentColor"
            opacity="0.2"
          />
          <path
            d="M32 24V40M24 32H40M56 32C56 45.2548 45.2548 56 32 56C18.7452 56 8 45.2548 8 32C8 18.7452 18.7452 8 32 8C45.2548 8 56 18.7452 56 32Z"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: 3,
      title: "Imunidade Tributária – Templos",
      description: "Inicie o processo digital de solicitação",
      icon: (
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 24H48V52H16V24Z" fill="currentColor" opacity="0.2" />
          <path
            d="M32 4L8 16H56L32 4Z"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 20H52V24H12V20ZM16 24V52H48V24M24 32V44M32 32V44M40 32V44M8 52H56"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: 4,
      title: "Imunidade Tributária – Instituições de Educação",
      description: "Inicie o processo digital de solicitação",
      icon: (
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M32 12L8 24L32 36L56 24L32 12Z"
            fill="currentColor"
            opacity="0.2"
          />
          <path
            d="M32 12L8 24M32 12L56 24M32 12V8M8 24L32 36M8 24V40L32 52M56 24L32 36M56 24V40L32 52M32 36V52"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M48 28V42"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      id: 5,
      title: "Isenção de Taxas – Microempreendedor (MEI)",
      description: "Inicie o processo digital de solicitação",
      icon: (
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20 28H44V52H20V28Z" fill="currentColor" opacity="0.2" />
          <path
            d="M16 12H48C50.2091 12 52 13.7909 52 16V48C52 50.2091 50.2091 52 48 52H16C13.7909 52 12 50.2091 12 48V16C12 13.7909 13.7909 12 16 12Z"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M24 24H40M24 32H40M24 40H32"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: 6,
      title: "Isenção de ITBI – Transferência Específica",
      description: "Inicie o processo digital de solicitação",
      icon: (
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 20L32 8L52 20V48C52 50.2091 50.2091 52 48 52H16C13.7909 52 12 50.2091 12 48V20Z"
            fill="currentColor"
            opacity="0.2"
          />
          <path
            d="M12 20L32 8L52 20M12 20V48C12 50.2091 13.7909 52 16 52H48C50.2091 52 52 50.2091 52 48V20M12 20L8 22M52 20L56 22"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M32 24V40M24 32H40"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {processes.map((process) => (
          <ProcessCard
            key={process.id}
            title={process.title}
            description={process.description}
            icon={process.icon}
            onClick={() =>
              console.log(`Processo selecionado: ${process.title}`)
            }
          />
        ))}
      </div>
    </div>
  );
}
