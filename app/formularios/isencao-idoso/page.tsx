"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ComprovanteTaxa from "@/components/ComprovanteTaxa/ComprovanteTaxa";
import styles from "./page.module.css";
import ElderlyIcon from "@mui/icons-material/Elderly";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function IsencaoIdosoPage() {
  // Estado para controlar qual seção está ativa
  const [activeSection, setActiveSection] = useState(1);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [expandedSections, setExpandedSections] = useState<number[]>([1]); // Seção 1 expandida por padrão

  // Estados da Seção 1 - Taxas
  const [guia, setGuia] = useState<File | null>(null);
  const [comprovante, setComprovante] = useState<File | null>(null);

  // Estados da Seção 2 - Identificação
  const [tipoSolicitacao, setTipoSolicitacao] = useState("");
  const [processoAnterior, setProcessoAnterior] = useState("");
  const [certidaoAnterior, setCertidaoAnterior] = useState("");
  const [nome, setNome] = useState("");
  const [rg, setRg] = useState("");
  const [orgaoEmissor, setOrgaoEmissor] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");

  // Estados da Seção 3 - Localização do Imóvel
  const [inscricaoImobiliaria, setInscricaoImobiliaria] = useState("");
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [lote, setLote] = useState("");
  const [quadra, setQuadra] = useState("");

  // Estados da Seção 4 - Documentos
  const [docCertidaoImovel, setDocCertidaoImovel] = useState<File | null>(null);
  const [docTaxas, setDocTaxas] = useState<File | null>(null);
  const [docRgCpf, setDocRgCpf] = useState<File | null>(null);
  const [docResidencia, setDocResidencia] = useState<File | null>(null);
  const [docRendimentos, setDocRendimentos] = useState<File | null>(null);
  const [docEscritura, setDocEscritura] = useState<File | null>(null);
  const [docUnicoImovel, setDocUnicoImovel] = useState<File | null>(null);
  const [docFichaIptu, setDocFichaIptu] = useState<File | null>(null);

  // Estados da Seção 5 - Declaração Socioeconômica
  const [statusSocial, setStatusSocial] = useState("");
  const [estadoCivil, setEstadoCivil] = useState("");
  const [unicoImovel, setUnicoImovel] = useState(false);
  const [residenciaPropria, setResidenciaPropria] = useState(false);
  const [anoInicio, setAnoInicio] = useState("");
  const [confirmaRenda, setConfirmaRenda] = useState(false);
  const [temConjuge, setTemConjuge] = useState(false);
  const [nomeConjuge, setNomeConjuge] = useState("");
  const [cpfConjuge, setCpfConjuge] = useState("");
  const [rgConjuge, setRgConjuge] = useState("");

  // Estados da Seção 6 - Representação
  const [possuiProcurador, setPossuiProcurador] = useState(false);
  const [nomeProcurador, setNomeProcurador] = useState("");
  const [cpfProcurador, setCpfProcurador] = useState("");
  const [rgProcurador, setRgProcurador] = useState("");
  const [docProcuracao, setDocProcuracao] = useState<File | null>(null);

  // Estados da Seção 7 - Assinatura a Rogo
  const [assinaturaRogo, setAssinaturaRogo] = useState(false);
  const [testemunha1Nome, setTestemunha1Nome] = useState("");
  const [testemunha1Cpf, setTestemunha1Cpf] = useState("");
  const [testemunha1Rg, setTestemunha1Rg] = useState("");
  const [testemunha2Nome, setTestemunha2Nome] = useState("");
  const [testemunha2Cpf, setTestemunha2Cpf] = useState("");
  const [testemunha2Rg, setTestemunha2Rg] = useState("");

  // Estados da Seção 8 - Preferências de Comunicação
  const [preferenciaAR, setPreferenciaAR] = useState(false);
  const [preferenciaWhatsapp, setPreferenciaWhatsapp] = useState(false);
  const [preferenciaEmail, setPreferenciaEmail] = useState(false);

  // Estados da Seção 9 - Finalização
  const [observacoes, setObservacoes] = useState("");
  const [docPeticao, setDocPeticao] = useState<File | null>(null);
  const [aceiteTermo, setAceiteTermo] = useState(false);

  // Validação de seções
  const isSectionValid = (section: number): boolean => {
    switch (section) {
      case 1: // Taxas
        return guia !== null && comprovante !== null;
      case 2: // Identificação
        const baseValid = tipoSolicitacao && nome && rg && orgaoEmissor && cpf && telefone && email;
        if (tipoSolicitacao === "renovacao") {
          return !!(baseValid && processoAnterior && certidaoAnterior);
        }
        return !!baseValid;
      case 3: // Localização
        return !!(inscricaoImobiliaria && cep && rua && numero && bairro && cidade && estado);
      case 4: // Documentos
        return !!(
          docCertidaoImovel &&
          docTaxas &&
          docRgCpf &&
          docResidencia &&
          docRendimentos &&
          docEscritura &&
          docUnicoImovel &&
          docFichaIptu
        );
      case 5: // Declaração
        const baseDeclaracaoValid = statusSocial && estadoCivil && unicoImovel && residenciaPropria && anoInicio && confirmaRenda;
        if (temConjuge) {
          return !!(baseDeclaracaoValid && nomeConjuge && cpfConjuge && rgConjuge);
        }
        return !!baseDeclaracaoValid;
      case 6: // Representação
        if (possuiProcurador) {
          return !!(nomeProcurador && cpfProcurador && rgProcurador && docProcuracao);
        }
        return true;
      case 7: // Assinatura a Rogo
        if (assinaturaRogo) {
          return !!(
            testemunha1Nome && testemunha1Cpf && testemunha1Rg &&
            testemunha2Nome && testemunha2Cpf && testemunha2Rg
          );
        }
        return true;
      case 8: // Preferências
        const selectedCount = [preferenciaAR, preferenciaWhatsapp, preferenciaEmail].filter(Boolean).length;
        return selectedCount >= 2;
      case 9: // Finalização
        return aceiteTermo;
      default:
        return false;
    }
  };

  // Toggle expansão de seção
  const toggleSection = (section: number) => {
    if (expandedSections.includes(section)) {
      setExpandedSections(expandedSections.filter(s => s !== section));
    } else {
      setExpandedSections([...expandedSections, section]);
    }
  };

  // Avançar para próxima seção
  const handleNextSection = (currentSection: number) => {
    if (isSectionValid(currentSection)) {
      if (!completedSections.includes(currentSection)) {
        setCompletedSections([...completedSections, currentSection]);
      }
      
      setActiveSection(currentSection + 1);
      
      // Expandir a próxima seção automaticamente
      if (!expandedSections.includes(currentSection + 1)) {
        setExpandedSections([...expandedSections, currentSection + 1]);
      }
      
      // Scroll imediato para a próxima seção
      setTimeout(() => {
        const nextSection = document.querySelector(`[data-section="${currentSection + 1}"]`);
        if (nextSection) {
          const yOffset = -80;
          const y = nextSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 150);
    }
  };

  // Auto-complete de endereço via CEP
  const handleCepBlur = async () => {
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setRua(data.logradouro);
          setBairro(data.bairro);
          setCidade(data.localidade);
          setEstado(data.uf);
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  // Atualiza estado civil e habilita cônjuge
  useEffect(() => {
    if (estadoCivil === "casado" || estadoCivil === "uniao-estavel") {
      setTemConjuge(true);
    } else {
      setTemConjuge(false);
      setNomeConjuge("");
      setCpfConjuge("");
      setRgConjuge("");
    }
  }, [estadoCivil]);

  const handleContinueTaxas = (guiaFile: File | null, comprovanteFile: File | null) => {
    setGuia(guiaFile);
    setComprovante(comprovanteFile);
    if (guiaFile && comprovanteFile) {
      handleNextSection(1);
    }
  };

  const handleSubmit = () => {
    if (isSectionValid(9)) {
      console.log("Formulário enviado com sucesso!");
      alert("Requerimento enviado com sucesso!");
    }
  };

  return (
    <div className={styles.page}>
      <Header
        icon={<ElderlyIcon sx={{ fontSize: 56, color: "#EB5F1A" }} />}
        processType="ISENÇÃO"
        title="Idosos maiores de 60 anos"
        description="Imóvel de idoso com renda até 2 salários mínimos."
      />
      <main className={styles.main}>
        {/* Seção 1 - Taxas */}
        <section
          data-section="1"
          className={`${styles.section} ${activeSection === 1 ? styles.sectionActive : ""} ${
            activeSection > 1 ? styles.sectionCompleted : ""
          }`}
          style={{ opacity: activeSection >= 1 ? 1 : 0.5 }}
        >
          <ComprovanteTaxa titulo="01. Comprovante da Taxa de Abertura" onContinue={handleContinueTaxas} />
        </section>

        {/* Seção 2 - Identificação */}
        <section
          data-section="2"
          className={`${styles.section} ${activeSection === 2 ? styles.sectionActive : ""} ${
            completedSections.includes(2) ? styles.sectionCompleted : ""
          }`}
          style={{ opacity: activeSection >= 2 ? 1 : 0.5 }}
        >
          <div 
            className={styles.sectionHeader} 
            onClick={() => toggleSection(2)}
            style={{ cursor: 'pointer' }}
          >
            <h2 className={styles.sectionTitle}>02. Identificação do Requerente</h2>
            <div className={styles.sectionHeaderIcons}>
              {completedSections.includes(2) && <CheckCircleIcon className={styles.checkIcon} />}
              <ExpandMoreIcon 
                className={`${styles.expandIcon} ${expandedSections.includes(2) ? styles.expandIconOpen : ''}`}
              />
            </div>
          </div>

          {expandedSections.includes(2) && (
            <div className={styles.sectionContent} style={{ pointerEvents: activeSection >= 2 ? "auto" : "none" }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Tipo de Solicitação <span className={styles.required}>*</span>
            </label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="tipoSolicitacao"
                  value="primeira"
                  checked={tipoSolicitacao === "primeira"}
                  onChange={(e) => setTipoSolicitacao(e.target.value)}
                  className={styles.radioInput}
                />
                <span className={styles.radioCustom}></span>
                Primeira Isenção
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="tipoSolicitacao"
                  value="renovacao"
                  checked={tipoSolicitacao === "renovacao"}
                  onChange={(e) => setTipoSolicitacao(e.target.value)}
                  className={styles.radioInput}
                />
                <span className={styles.radioCustom}></span>
                Renovação
              </label>
            </div>
          </div>

          {tipoSolicitacao === "renovacao" && (
            <div className={styles.gridTwo}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Nº do Processo Anterior <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={processoAnterior}
                  onChange={(e) => setProcessoAnterior(e.target.value)}
                  className={styles.input}
                  placeholder="Ex: 2024/12345"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Nº da Certidão <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={certidaoAnterior}
                  onChange={(e) => setCertidaoAnterior(e.target.value)}
                  className={styles.input}
                  placeholder="Ex: 987654"
                />
              </div>
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Nome Completo <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={styles.input}
              placeholder="Digite seu nome completo"
            />
          </div>

          <div className={styles.gridThree}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                RG <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={rg}
                onChange={(e) => setRg(e.target.value)}
                className={styles.input}
                placeholder="00.000.000-0"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Órgão Emissor <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={orgaoEmissor}
                onChange={(e) => setOrgaoEmissor(e.target.value)}
                className={styles.input}
                placeholder="Ex: SSP/RJ"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                CPF <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className={styles.input}
                placeholder="000.000.000-00"
              />
            </div>
          </div>

          <div className={styles.gridTwo}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Telefone <span className={styles.required}>*</span>
              </label>
              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className={styles.input}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                E-mail <span className={styles.required}>*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <button
            onClick={() => handleNextSection(2)}
            disabled={!isSectionValid(2)}
            className={styles.btnContinue}
          >
            Continuar
          </button>
          </div>
          )}
        </section>

        {/* Seção 3 - Localização do Imóvel */}
        <section
          data-section="3"
          className={`${styles.section} ${activeSection === 3 ? styles.sectionActive : ""} ${
            completedSections.includes(3) ? styles.sectionCompleted : ""
          }`}
          style={{ opacity: activeSection >= 3 ? 1 : 0.5 }}
        >
          <div 
            className={styles.sectionHeader}
            onClick={() => toggleSection(3)}
            style={{ cursor: 'pointer' }}
          >
            <h2 className={styles.sectionTitle}>03. Informações do Imóvel</h2>
            <div className={styles.sectionHeaderIcons}>
              {completedSections.includes(3) && <CheckCircleIcon className={styles.checkIcon} />}
              <ExpandMoreIcon 
                className={`${styles.expandIcon} ${expandedSections.includes(3) ? styles.expandIconOpen : ''}`}
              />
            </div>
          </div>

          {expandedSections.includes(3) && (
            <div className={styles.sectionContent} style={{ pointerEvents: activeSection >= 3 ? "auto" : "none" }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Inscrição Imobiliária <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              value={inscricaoImobiliaria}
              onChange={(e) => setInscricaoImobiliaria(e.target.value)}
              className={styles.inputHighlight}
              placeholder="Digite a inscrição imobiliária"
            />
          </div>

          <div className={styles.gridTwo}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                CEP <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                onBlur={handleCepBlur}
                className={styles.input}
                placeholder="00000-000"
                maxLength={8}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Número <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                className={styles.input}
                placeholder="Nº"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Rua/Logradouro <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              value={rua}
              onChange={(e) => setRua(e.target.value)}
              className={styles.input}
              placeholder="Nome da rua"
            />
          </div>

          <div className={styles.gridThree}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Bairro <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                className={styles.input}
                placeholder="Bairro"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Cidade <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className={styles.input}
                placeholder="Cidade"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Estado <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className={styles.input}
                placeholder="UF"
                maxLength={2}
              />
            </div>
          </div>

          <div className={styles.gridTwo}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Lote</label>
              <input
                type="text"
                value={lote}
                onChange={(e) => setLote(e.target.value)}
                className={styles.input}
                placeholder="Lote"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Quadra</label>
              <input
                type="text"
                value={quadra}
                onChange={(e) => setQuadra(e.target.value)}
                className={styles.input}
                placeholder="Quadra"
              />
            </div>
          </div>

          <button
            onClick={() => handleNextSection(3)}
            disabled={!isSectionValid(3)}
            className={styles.btnContinue}
          >
            Continuar
          </button>
          </div>
          )}
        </section>

        {/* Seção 4 - Documentação */}
        <section
          data-section="4"
          className={`${styles.section} ${activeSection === 4 ? styles.sectionActive : ""} ${
            completedSections.includes(4) ? styles.sectionCompleted : ""
          }`}
          style={{ opacity: activeSection >= 4 ? 1 : 0.5 }}
        >
          <div 
            className={styles.sectionHeader}
            onClick={() => toggleSection(4)}
            style={{ cursor: 'pointer' }}
          >
            <h2 className={styles.sectionTitle}>04. Documentação Comprobatória</h2>
            <div className={styles.sectionHeaderIcons}>
              {completedSections.includes(4) && <CheckCircleIcon className={styles.checkIcon} />}
              <ExpandMoreIcon 
                className={`${styles.expandIcon} ${expandedSections.includes(4) ? styles.expandIconOpen : ''}`}
              />
            </div>
          </div>

          {expandedSections.includes(4) && (
            <div className={styles.sectionContent} style={{ pointerEvents: activeSection >= 4 ? "auto" : "none" }}>
          <div className={styles.uploadList}>
            {[
              { label: "Certidão do Imóvel", file: docCertidaoImovel, setFile: setDocCertidaoImovel },
              { label: "Taxas Municipais", file: docTaxas, setFile: setDocTaxas },
              { label: "RG/CPF (Comprovação 60+)", file: docRgCpf, setFile: setDocRgCpf },
              { label: "Comprovante de Residência", file: docResidencia, setFile: setDocResidencia },
              { label: "Comprovante de Rendimentos", file: docRendimentos, setFile: setDocRendimentos },
              { label: "Escritura/Documento de Posse", file: docEscritura, setFile: setDocEscritura },
              { label: "Certidão de Único Imóvel", file: docUnicoImovel, setFile: setDocUnicoImovel },
              { label: "Ficha de Lançamento IPTU", file: docFichaIptu, setFile: setDocFichaIptu },
            ].map((doc, index) => (
              <div key={index} className={styles.uploadItem}>
                <label className={styles.uploadLabel}>
                  <CloudUploadIcon className={styles.uploadIcon} />
                  <span className={styles.uploadText}>
                    {doc.label} <span className={styles.required}>*</span>
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files && doc.setFile(e.target.files[0])}
                    className={styles.fileInput}
                  />
                </label>
                {doc.file && <span className={styles.fileName}>{doc.file.name}</span>}
              </div>
            ))}
          </div>

          <button
            onClick={() => handleNextSection(4)}
            disabled={!isSectionValid(4)}
            className={styles.btnContinue}
          >
            Continuar
          </button>
          </div>
          )}
        </section>

        {/* Seção 5 - Declaração Socioeconômica */}
        <section
          data-section="5"
          className={`${styles.section} ${activeSection === 5 ? styles.sectionActive : ""} ${
            completedSections.includes(5) ? styles.sectionCompleted : ""
          }`}
          style={{ opacity: activeSection >= 5 ? 1 : 0.5 }}
        >
          <div 
            className={styles.sectionHeader}
            onClick={() => toggleSection(5)}
            style={{ cursor: 'pointer' }}
          >
            <h2 className={styles.sectionTitle}>05. Questionário de Elegibilidade</h2>
            <div className={styles.sectionHeaderIcons}>
              {completedSections.includes(5) && <CheckCircleIcon className={styles.checkIcon} />}
              <ExpandMoreIcon 
                className={`${styles.expandIcon} ${expandedSections.includes(5) ? styles.expandIconOpen : ''}`}
              />
            </div>
          </div>

          {expandedSections.includes(5) && (
            <div className={styles.sectionContent} style={{ pointerEvents: activeSection >= 5 ? "auto" : "none" }}>
          <div className={styles.gridTwo}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Status Social <span className={styles.required}>*</span>
              </label>
              <select
                value={statusSocial}
                onChange={(e) => setStatusSocial(e.target.value)}
                className={styles.select}
              >
                <option value="">Selecione...</option>
                <option value="aposentado">Aposentado</option>
                <option value="pensionista">Pensionista</option>
                <option value="ambos">Ambos</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Estado Civil <span className={styles.required}>*</span>
              </label>
              <select
                value={estadoCivil}
                onChange={(e) => setEstadoCivil(e.target.value)}
                className={styles.select}
              >
                <option value="">Selecione...</option>
                <option value="solteiro">Solteiro(a)</option>
                <option value="casado">Casado(a)</option>
                <option value="viuvo">Viúvo(a)</option>
                <option value="divorciado">Divorciado(a)</option>
                <option value="uniao-estavel">União Estável</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={unicoImovel}
                onChange={(e) => setUnicoImovel(e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxCustom}></span>
              Único imóvel de propriedade <span className={styles.required}>*</span>
            </label>
          </div>

          <div className={styles.gridTwo}>
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={residenciaPropria}
                  onChange={(e) => setResidenciaPropria(e.target.checked)}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxCustom}></span>
                Residência própria <span className={styles.required}>*</span>
              </label>
            </div>

            {residenciaPropria && (
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Ano de início da residência <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  value={anoInicio}
                  onChange={(e) => setAnoInicio(e.target.value)}
                  className={styles.input}
                  placeholder="Ex: 2010"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={confirmaRenda}
                onChange={(e) => setConfirmaRenda(e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxCustom}></span>
              Confirmo que minha renda familiar não ultrapassa 2 salários mínimos{" "}
              <span className={styles.required}>*</span>
            </label>
          </div>

          {temConjuge && (
            <div className={styles.conjugeSection}>
              <h3 className={styles.subTitle}>Dados do Cônjuge/Companheiro(a)</h3>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Nome Completo <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={nomeConjuge}
                  onChange={(e) => setNomeConjuge(e.target.value)}
                  className={styles.input}
                  placeholder="Nome completo do cônjuge"
                />
              </div>

              <div className={styles.gridTwo}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    CPF <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    value={cpfConjuge}
                    onChange={(e) => setCpfConjuge(e.target.value)}
                    className={styles.input}
                    placeholder="000.000.000-00"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    RG <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    value={rgConjuge}
                    onChange={(e) => setRgConjuge(e.target.value)}
                    className={styles.input}
                    placeholder="00.000.000-0"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => handleNextSection(5)}
            disabled={!isSectionValid(5)}
            className={styles.btnContinue}
          >
            Continuar
          </button>
          </div>
          )}
        </section>

        {/* Seção 6 - Representação */}
        <section
          data-section="6"
          className={`${styles.section} ${activeSection === 6 ? styles.sectionActive : ""} ${
            completedSections.includes(6) ? styles.sectionCompleted : ""
          }`}
          style={{ opacity: activeSection >= 6 ? 1 : 0.5 }}
        >
          <div 
            className={styles.sectionHeader}
            onClick={() => toggleSection(6)}
            style={{ cursor: 'pointer' }}
          >
            <h2 className={styles.sectionTitle}>06. Representação Legal</h2>
            <div className={styles.sectionHeaderIcons}>
              {completedSections.includes(6) && <CheckCircleIcon className={styles.checkIcon} />}
              <ExpandMoreIcon 
                className={`${styles.expandIcon} ${expandedSections.includes(6) ? styles.expandIconOpen : ''}`}
              />
            </div>
          </div>

          {expandedSections.includes(6) && (
            <div className={styles.sectionContent} style={{ pointerEvents: activeSection >= 6 ? "auto" : "none" }}>
          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={possuiProcurador}
                onChange={(e) => setPossuiProcurador(e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxCustom}></span>
              Possui procurador para este ato?
            </label>
          </div>

          {possuiProcurador && (
            <div className={styles.procuradorSection}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Nome do Procurador <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={nomeProcurador}
                  onChange={(e) => setNomeProcurador(e.target.value)}
                  className={styles.input}
                  placeholder="Nome completo do procurador"
                />
              </div>

              <div className={styles.gridTwo}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    CPF <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    value={cpfProcurador}
                    onChange={(e) => setCpfProcurador(e.target.value)}
                    className={styles.input}
                    placeholder="000.000.000-00"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    RG <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    value={rgProcurador}
                    onChange={(e) => setRgProcurador(e.target.value)}
                    className={styles.input}
                    placeholder="00.000.000-0"
                  />
                </div>
              </div>

              <div className={styles.uploadItem}>
                <label className={styles.uploadLabel}>
                  <CloudUploadIcon className={styles.uploadIcon} />
                  <span className={styles.uploadText}>
                    Procuração e Documentos do Representante <span className={styles.required}>*</span>
                  </span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => e.target.files && setDocProcuracao(e.target.files[0])}
                    className={styles.fileInput}
                  />
                </label>
                {docProcuracao && <span className={styles.fileName}>{docProcuracao.name}</span>}
              </div>
            </div>
          )}

          <button
            onClick={() => handleNextSection(6)}
            disabled={!isSectionValid(6)}
            className={styles.btnContinue}
          >
            Continuar
          </button>
          </div>
          )}
        </section>

        {/* Seção 7 - Assinatura a Rogo */}
        <section
          data-section="7"
          className={`${styles.section} ${activeSection === 7 ? styles.sectionActive : ""} ${
            completedSections.includes(7) ? styles.sectionCompleted : ""
          }`}
          style={{ opacity: activeSection >= 7 ? 1 : 0.5 }}
        >
          <div 
            className={styles.sectionHeader}
            onClick={() => toggleSection(7)}
            style={{ cursor: 'pointer' }}
          >
            <h2 className={styles.sectionTitle}>07. Testemunhas (Assinatura a Rogo)</h2>
            <div className={styles.sectionHeaderIcons}>
              {completedSections.includes(7) && <CheckCircleIcon className={styles.checkIcon} />}
              <ExpandMoreIcon 
                className={`${styles.expandIcon} ${expandedSections.includes(7) ? styles.expandIconOpen : ''}`}
              />
            </div>
          </div>

          {expandedSections.includes(7) && (
            <div className={styles.sectionContent} style={{ pointerEvents: activeSection >= 7 ? "auto" : "none" }}>
          <p className={styles.helperText}>
            Exclusivo para requerentes analfabetos ou impossibilitados de assinar
          </p>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={assinaturaRogo}
                onChange={(e) => setAssinaturaRogo(e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxCustom}></span>
              Necessito de assinatura a rogo
            </label>
          </div>

          {assinaturaRogo && (
            <>
              <div className={styles.testemunhaBox}>
                <h3 className={styles.subTitle}>Testemunha 1</h3>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Nome Completo <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    value={testemunha1Nome}
                    onChange={(e) => setTestemunha1Nome(e.target.value)}
                    className={styles.input}
                    placeholder="Nome da testemunha"
                  />
                </div>
                <div className={styles.gridTwo}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      CPF <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      value={testemunha1Cpf}
                      onChange={(e) => setTestemunha1Cpf(e.target.value)}
                      className={styles.input}
                      placeholder="000.000.000-00"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      RG <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      value={testemunha1Rg}
                      onChange={(e) => setTestemunha1Rg(e.target.value)}
                      className={styles.input}
                      placeholder="00.000.000-0"
                    />
                  </div>
                </div>
              </div>

              <div className={styles.testemunhaBox}>
                <h3 className={styles.subTitle}>Testemunha 2</h3>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Nome Completo <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    value={testemunha2Nome}
                    onChange={(e) => setTestemunha2Nome(e.target.value)}
                    className={styles.input}
                    placeholder="Nome da testemunha"
                  />
                </div>
                <div className={styles.gridTwo}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      CPF <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      value={testemunha2Cpf}
                      onChange={(e) => setTestemunha2Cpf(e.target.value)}
                      className={styles.input}
                      placeholder="000.000.000-00"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      RG <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      value={testemunha2Rg}
                      onChange={(e) => setTestemunha2Rg(e.target.value)}
                      className={styles.input}
                      placeholder="00.000.000-0"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <button
            onClick={() => handleNextSection(7)}
            disabled={!isSectionValid(7)}
            className={styles.btnContinue}
          >
            Continuar
          </button>
          </div>
          )}
        </section>

        {/* Seção 8 - Preferências de Comunicação */}
        <section
          data-section="8"
          className={`${styles.section} ${activeSection === 8 ? styles.sectionActive : ""} ${
            completedSections.includes(8) ? styles.sectionCompleted : ""
          }`}
          style={{ opacity: activeSection >= 8 ? 1 : 0.5 }}
        >
          <div 
            className={styles.sectionHeader}
            onClick={() => toggleSection(8)}
            style={{ cursor: 'pointer' }}
          >
            <h2 className={styles.sectionTitle}>08. Formas de Contato e Notificação</h2>
            <div className={styles.sectionHeaderIcons}>
              {completedSections.includes(8) && <CheckCircleIcon className={styles.checkIcon} />}
              <ExpandMoreIcon 
                className={`${styles.expandIcon} ${expandedSections.includes(8) ? styles.expandIconOpen : ''}`}
              />
            </div>
          </div>

          {expandedSections.includes(8) && (
            <div className={styles.sectionContent} style={{ pointerEvents: activeSection >= 8 ? "auto" : "none" }}>
          <p className={styles.helperText}>Selecione no mínimo 2 opções de contato</p>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={preferenciaAR}
                onChange={(e) => setPreferenciaAR(e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxCustom}></span>
              AR (Carta de Recebimento)
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={preferenciaWhatsapp}
                onChange={(e) => setPreferenciaWhatsapp(e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxCustom}></span>
              WhatsApp
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={preferenciaEmail}
                onChange={(e) => setPreferenciaEmail(e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxCustom}></span>
              E-mail
            </label>
          </div>

          <button
            onClick={() => handleNextSection(8)}
            disabled={!isSectionValid(8)}
            className={styles.btnContinue}
          >
            Continuar
          </button>
          </div>
          )}
        </section>

        {/* Seção 9 - Finalização */}
        <section
          data-section="9"
          className={`${styles.section} ${activeSection === 9 ? styles.sectionActive : ""} ${
            completedSections.includes(9) ? styles.sectionCompleted : ""
          }`}
          style={{ opacity: activeSection >= 9 ? 1 : 0.5 }}
        >
          <div 
            className={styles.sectionHeader}
            onClick={() => toggleSection(9)}
            style={{ cursor: 'pointer' }}
          >
            <h2 className={styles.sectionTitle}>09. Observações Finais</h2>
            <div className={styles.sectionHeaderIcons}>
              {completedSections.includes(9) && <CheckCircleIcon className={styles.checkIcon} />}
              <ExpandMoreIcon 
                className={`${styles.expandIcon} ${expandedSections.includes(9) ? styles.expandIconOpen : ''}`}
              />
            </div>
          </div>

          {expandedSections.includes(9) && (
            <div className={styles.sectionContent} style={{ pointerEvents: activeSection >= 9 ? "auto" : "none" }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Observações (Opcional)</label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className={styles.textarea}
              placeholder="Descreva aqui informações adicionais relevantes..."
              maxLength={1000}
              rows={5}
            />
            <span className={styles.charCount}>{observacoes.length}/1000 caracteres</span>
          </div>

          <div className={styles.uploadItem}>
            <label className={styles.uploadLabel}>
              <CloudUploadIcon className={styles.uploadIcon} />
              <span className={styles.uploadText}>Petição (Opcional - PDF)</span>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => e.target.files && setDocPeticao(e.target.files[0])}
                className={styles.fileInput}
              />
            </label>
            {docPeticao && <span className={styles.fileName}>{docPeticao.name}</span>}
          </div>

          <div className={styles.termoBox}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={aceiteTermo}
                onChange={(e) => setAceiteTermo(e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxCustom}></span>
              <span>
                Declaro que li e aceito os termos do requerimento. Estou ciente de que as informações
                prestadas são de minha inteira responsabilidade e que a falsidade das mesmas pode implicar
                em sanções legais. <span className={styles.required}>*</span>
              </span>
            </label>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isSectionValid(9)}
            className={styles.btnSubmit}
          >
            ENVIAR REQUERIMENTO
          </button>
          </div>
          )}
        </section>

        {/* Rodapé Informativo */}
        <div className={styles.infoFooter}>
          <h3 className={styles.infoTitle}>Informações Importantes</h3>
          <ul className={styles.infoList}>
            <li>
              <strong>Análise:</strong> 15 dias úteis após a instrução completa do processo.
            </li>
            <li>
              <strong>Regularização:</strong> Notificações de débitos devem ser sanadas em até 30 dias.
            </li>
            <li>
              <strong>Legislação:</strong> Pedido condicionado aos prazos do Decreto Municipal vigente.
            </li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
