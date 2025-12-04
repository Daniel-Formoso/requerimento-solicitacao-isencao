"use client";

import React from "react";
import styles from "./ProcessCard.module.css";

interface ProcessCardProps {
  icon: React.ReactNode;
  title: string;
  processType: string;
  description: string;
  onClick?: () => void;
}

export default function ProcessCard({
  icon,
  title,
  processType,
  description,
  onClick,
}: ProcessCardProps) {
  return (
    <button className={styles.card} onClick={onClick}>
      <div className={styles.iconWrapper}>{icon}</div>
      <p className={styles.processType}>{processType}</p>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </button>
  );
}
