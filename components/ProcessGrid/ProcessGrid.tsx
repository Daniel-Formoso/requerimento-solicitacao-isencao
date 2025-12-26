"use client";

import React from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const iconStyle = { fontSize: 56, color: "#EB5F1A", backgroundColor: "none" };

  const processes = [
    {
      id: 1,
      title: "Idosos maiores de 60 anos",
      processType: "Isenção",
      description: "Imóvel de idoso com renda até 2 salários mínimos.",
      icon: <ElderlyIcon sx={iconStyle} />,
      route: "/formularios/isencao-idoso",
    },
    {
      id: 2,
      title: "Ex-combatente",
      processType: "Isenção",
      description: "Imóvel de ex-combatente ou cônjuge, único e residencial.",
      icon: <MilitaryTechIcon sx={iconStyle} />,
      route: "/formularios/isencao-excombatente",
    },
    {
      id: 3,
      title: "Pessoa com Deficiência (PCD)",
      processType: "Isenção",
      description: "Imóvel de PCD ou ascendente direto, único e residencial.",
      icon: <AccessibleIcon sx={iconStyle} />,
      route: "/formularios/isencao-pcd",
    },
    {
      id: 4,
      title: "Imóvel Locado ou Cedido à Administração Pública",
      processType: "Isenção",
      description:
        "Imóvel destinado à Administração Pública.",
      icon: <AccountBalanceIcon sx={iconStyle} />,
      route: "/formularios/isencao-imovel-cedido",
    },
    {
      id: 5,
      title: "Templo Religioso",
      processType: "Isenção",
      description: "Imóvel destinado ao funcionamento de templos religiosos.",
      icon: <ChurchIcon sx={iconStyle} />,
      route: "/formularios/isencao-templo-religioso",
    },
    {
      id: 6,
      title: "Taxas mercantis para Templos Religiosos",
      processType: "Isenção",
      description:
        "Isenção de taxas para templos religiosos.",
      icon: <MonetizationOnIcon sx={iconStyle} />,
      route: "/formularios/isencao-taxas-mercantis",
    },
        {
      id: 7,
      title: "Imunidade para Templo Religioso",
      processType: "Imunidade",
      description:
        "Imóvel destinado ao funcionamento de templos religiosos.",
      icon: <ChurchIcon sx={iconStyle} />,
      route: "/formularios/imunidade-templo-religioso",
    },
        {
      id: 8,
      title: "Instituições sem fins lucrativos",
      processType: "Imunidade",
      description:
        "Imunidade para instituições sociais.",
      icon: <VolunteerActivismIcon sx={iconStyle} />,
      route: "/formularios/imunidade-instituicoes",
    },
        {
      id: 9,
      title: "Sindicatos e outras classes",
      processType: "Imunidade",
      description:
        "Imunidade para sindicatos e órgãos de classe.",
      icon: <GroupsIcon sx={iconStyle} />,
      route: "/formularios/imunidade-sindicatos",
    },
        {
      id: 10,
      title: "Imunidade recíproca",
      processType: "Imunidade",
      description:
        "Imunidade para imóveis de entes públicos.",
      icon: <HandshakeIcon sx={iconStyle} />,
      route: "/formularios/imunidade-reciproca",
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
            onClick={() => router.push(process.route)}
          />
        ))}
      </div>
    </div>
  );
}
