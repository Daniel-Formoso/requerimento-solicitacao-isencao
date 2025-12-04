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
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import GroupsIcon from "@mui/icons-material/Groups";
import HandshakeIcon from "@mui/icons-material/Handshake";


export default function ProcessGrid() {
  const iconStyle = { fontSize: 56, color: "#EB5F1A", backgroundColor: "none" };

  const processes = [
    {
      id: 1,
      title: "Idosos maiores de 60 anos",
      processType: "Isenção",
      description: "Imóvel de idoso com renda até 2 salários mínimos.",
      icon: <ElderlyIcon sx={iconStyle} />,
    },
    {
      id: 2,
      title: "Ex-combatente",
      processType: "Isenção",
      description: "Imóvel de ex-combatente ou cônjuge, único e residencial.",
      icon: <MilitaryTechIcon sx={iconStyle} />,
    },
    {
      id: 3,
      title: "Pessoa com Deficiência (PCD)",
      processType: "Isenção",
      description: "Imóvel de PCD ou ascendente direto, único e residencial.",
      icon: <AccessibleIcon sx={iconStyle} />,
    },
    {
      id: 4,
      title: "Imóvel cedido à Prefeitura",
      processType: "Isenção",
      description:
        "Imóvel alugado ou cedido à Administração Pública Municipal.",
      icon: <AccountBalanceIcon sx={iconStyle} />,
    },
    {
      id: 5,
      title: "Templo Religioso",
      processType: "Isenção",
      description: "Imóvel destinado ao funcionamento de templos religiosos.",
      icon: <ChurchIcon sx={iconStyle} />,
    },
    {
      id: 6,
      title: "Taxas mercantis para Templos Religiosos",
      processType: "Isenção",
      description:
        "Isenção de taxas para templos religiosos.",
      icon: <MonetizationOnIcon sx={iconStyle} />,
    },
        {
      id: 7,
      title: "Imunidade para Templo Religioso",
      processType: "Imunidade",
      description:
        "Imóvel destinado ao funcionamento de templos religiosos.",
      icon: <ChurchIcon sx={iconStyle} />,
    },
        {
      id: 8,
      title: "Instituições sem fins lucrativos",
      processType: "Imunidade",
      description:
        "Imunidade para instituições sociais.",
      icon: <VolunteerActivismIcon sx={iconStyle} />,
    },
        {
      id: 9,
      title: "Sindicatos e outras classes",
      processType: "Imunidade",
      description:
        "Imunidade para sindicatos e órgãos de classe.",
      icon: <GroupsIcon sx={iconStyle} />,
    },
        {
      id: 10,
      title: "Imunidade recíproca",
      processType: "Imunidade",
      description:
        "Imunidade para imóveis de entes públicos.",
      icon: <HandshakeIcon sx={iconStyle} />,
    },
  ];

  return (
    <div className={styles.container}>     
      <div className={styles.grid}>
        {processes.map((process) => (
          <ProcessCard
            key={process.id}
            title={process.title}
            processType={process.processType}
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
