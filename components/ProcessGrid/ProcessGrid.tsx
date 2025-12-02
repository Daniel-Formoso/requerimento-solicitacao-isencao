"use client";

import React from "react";
import ProcessCard from "../ProcessCard/ProcessCard";
import styles from "./ProcessGrid.module.css";
import ElderlyIcon from "@mui/icons-material/Elderly";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import AccessibleIcon from "@mui/icons-material/Accessible";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ChurchIcon from "@mui/icons-material/Church";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export default function ProcessGrid() {
  const iconStyle = { fontSize: 56, color: "#EB5F1A", backgroundColor: "none" };

  const processes = [
    {
      id: 1,
      title: "Idosos maiores de 60 anos",
      description: "Imóvel de idoso com renda até 2 salários mínimos.",
      icon: <ElderlyIcon sx={iconStyle} />,
    },
    {
      id: 2,
      title: "Ex-combatente",
      description: "Imóvel de ex-combatente ou cônjuge, único e residencial.",
      icon: <MilitaryTechIcon sx={iconStyle} />,
    },
    {
      id: 3,
      title: "Pessoa com Deficiência (PCD)",
      description: "Imóvel de PCD ou ascendente direto, único e residencial.",
      icon: <AccessibleIcon sx={iconStyle} />,
    },
    {
      id: 4,
      title: "Imóvel cedido à Prefeitura",
      description:
        "Imóvel alugado ou cedido à Administração Pública Municipal.",
      icon: <AccountBalanceIcon sx={iconStyle} />,
    },
    {
      id: 5,
      title: "Templo Religioso",
      description: "Imóvel destinado ao funcionamento de templos religiosos.",
      icon: <ChurchIcon sx={iconStyle} />,
    },
    {
      id: 6,
      title: "Exemplo 6",
      description:
        "Imóvel de servidor público municipal, único e residencial.",
      icon: <AddCircleOutlineIcon sx={iconStyle} />,
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
