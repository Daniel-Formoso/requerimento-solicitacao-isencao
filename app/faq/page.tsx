"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer/Footer";
import styles from "./page.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";

interface FAQItem {
  id: number;
  question: string;
  answer: React.ReactNode;
}

export default function FAQPage() {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      id: 1,
      question: "Quem tem direito à isenção de IPTU?",
      answer:
        "A isenção de IPTU pode ser concedida a idosos com renda até 2 salários mínimos, ex-combatentes, pessoas com deficiência (PCD), imóveis cedidos à Prefeitura e templos religiosos. Cada categoria possui requisitos específicos.",
    },
    {
      id: 2,
      question: "Qual documentação é necessária para solicitar a isenção?",
      answer:
        "A documentação varia conforme o tipo de processo. Geralmente é necessário: RG, CPF, comprovante de residência, comprovante de renda, e documentos específicos de cada categoria (certificado de deficiência para PCD, etc.). Consulte o seu tipo de processo para mais detalhes.",
    },
    {
      id: 3,
      question: "Quanto tempo leva para análise do requerimento?",
      answer: (
        <>
          O tempo médio de análise é de <span style={{color: "#eb5f1a", fontWeight: "600"}}>30 a 60 dias úteis</span>. Você será notificado
          sobre o resultado através do protocolo gerado no momento da
          solicitação. Verifique o status usando o botão{" "}
          <a
            href="http://contribuinte.novaiguacu.rj.gov.br/#processos"
            className={styles.linkConsulta}
          >
            Consultar Processos
          </a>
          .
        </>
      ),
    },
    {
      id: 4,
      question: "Como faço para acompanhar meu requerimento?",
      answer: (
        <>
          Você pode acompanhar seu requerimento através do número de processo
          fornecido no momento da solicitação. Use o botão{" "}
          <a
            href="http://contribuinte.novaiguacu.rj.gov.br/#processos"
            className={styles.linkConsulta}
          >
             Consultar Processos 
          </a>
         {" "}e informe seu protocolo.
        </>
      ),
    },
    {
      id: 5,
      question: "Posso solicitar isenção para múltiplas propriedades?",
      answer:
        "A isenção de IPTU geralmente é concedida apenas para um imóvel residencial por pessoa. Consulte a legislação municipal para casos específicos ou contacte a prefeitura para mais informações.",
    },
    {
      id: 6,
      question: "Qual é o valor da taxa de solicitação?",
      answer:
        "A solicitação de isenção de IPTU é gratuita. Não há cobrança de taxa ou emolumentos para o requerimento.",
    },
    {
      id: 7,
      question: "O que fazer se meu requerimento for negado?",
      answer:
        "Se seu requerimento for negado, você receberá uma notificação com os motivos da negação. Você poderá recorrer da decisão no prazo estabelecido pela lei municipal, apresentando documentação complementar se necessário.",
    },
    {
      id: 8,
      question: "A isenção é permanente ou precisa ser renovada?",
      answer:
        "A isenção de IPTU geralmente é permanente enquanto os requisitos forem atendidos. No entanto, a Prefeitura pode solicitar a renovação do requerimento periodicamente para verificar se as condições ainda estão válidas.",
    },
  ];

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => router.back("/")} className={styles.backButton}>
          <ArrowBackIcon sx={{ fontSize: 24 }} />
          <span>Voltar</span>
        </button>
        <h1 className={styles.title}>Dúvidas Frequentes (FAQ)</h1>
      </div>

      <div className={styles.faqContainer}>
        {faqs.map((faq) => (
          <div key={faq.id} className={styles.faqItem}>
            <button
              className={`${styles.faqQuestion} ${
                expandedId === faq.id ? styles.expanded : ""
              }`}
              onClick={() => toggleExpand(faq.id)}
            >
              <span>{faq.question}</span>
              <span className={styles.icon}>
                <AddIcon style={{ fontSize: 20 }} />
              </span>
            </button>
            {expandedId === faq.id && (
              <div className={styles.faqAnswer}>{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
