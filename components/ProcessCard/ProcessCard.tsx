"use client";

import React from "react";
import styles from "./ProcessCard.module.css";

interface ProcessCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}

export default function ProcessCard({
  icon,
  title,
  description,
  onClick,
}: ProcessCardProps) {
  return (
    <button className={styles.card} onClick={onClick}>
      <div className={styles.iconWrapper}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </button>
  );
}
