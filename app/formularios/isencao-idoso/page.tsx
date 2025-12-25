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
import WarningIcon from "@mui/icons-material/Warning";

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

  // Estados de validação e erro da Seção 2
  const [nomeError, setNomeError] = useState("");
  const [cpfError, setCpfError] = useState("");
  const [telefoneError, setTelefoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [processoAnteriorError, setProcessoAnteriorError] = useState("");
  const [certidaoAnteriorError, setCertidaoAnteriorError] = useState("");

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

  // Estados de validação e erro da Seção 3
  const [inscricaoError, setInscricaoError] = useState("");
  const [cepError, setCepError] = useState("");
  const [ruaError, setRuaError] = useState("");
  const [numeroError, setNumeroError] = useState("");
  const [bairroError, setBairroError] = useState("");
  const [cidadeError, setCidadeError] = useState("");
  const [estadoError, setEstadoError] = useState("");

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
  const [telefoneConjuge, setTelefoneConjuge] = useState("");
  const [emailConjuge, setEmailConjuge] = useState("");

  // Estados de validação e erro da Seção 5
  const [statusSocialError, setStatusSocialError] = useState("");
  const [estadoCivilError, setEstadoCivilError] = useState("");
  const [residenciaPropriaError, setResidenciaPropriaError] = useState("");
  const [anoInicioError, setAnoInicioError] = useState("");
  const [nomeConjugeError, setNomeConjugeError] = useState("");
  const [cpfConjugeError, setCpfConjugeError] = useState("");
  const [telefoneConjugeError, setTelefoneConjugeError] = useState("");
  const [emailConjugeError, setEmailConjugeError] = useState("");

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

  // Funções de formatação e validação
  const formatarCPF = (valor: string): string => {
    const numeros = valor.replace(/\D/g, "");
    if (numeros.length <= 11) {
      return numeros
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    return cpf;
  };

  const validarCPF = (cpf: string): boolean => {
    const numeros = cpf.replace(/\D/g, "");
    if (numeros.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(numeros)) return false;
    
    // Valida primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(numeros.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digitoVerificador1 = resto >= 10 ? 0 : resto;
    
    if (digitoVerificador1 !== parseInt(numeros.charAt(9))) return false;
    
    // Valida segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(numeros.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digitoVerificador2 = resto >= 10 ? 0 : resto;
    
    return digitoVerificador2 === parseInt(numeros.charAt(10));
  };

  const formatarTelefone = (valor: string): string => {
    const numeros = valor.replace(/\D/g, "");
    
    if (numeros.length <= 10) {
      // Formato antigo: (XX) XXXX-XXXX
      return numeros
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    } else {
      // Formato novo com 9: (XX) XXXXX-XXXX
      return numeros
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .slice(0, 15);
    }
  };

  const validarEmail = (email: string): boolean => {
    // Regex completo para validação de email
    const regex = /^[a-zA-Z0-9]([a-zA-Z0-9._-])*[a-zA-Z0-9]@[a-zA-Z0-9]([a-zA-Z0-9-])*[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    
    if (!regex.test(email)) return false;
    
    // Validações adicionais
    if (email.includes("..")) return false; // Não permite pontos consecutivos
    if (email.split("@").length !== 2) return false; // Apenas um @
    
    const [local, domain] = email.split("@");
    if (local.length > 64) return false; // Local part não pode ter mais de 64 caracteres
    if (domain.length > 255) return false; // Domain não pode ter mais de 255 caracteres
    
    const domainParts = domain.split(".");
    for (const part of domainParts) {
      if (part.length > 63) return false; // Cada parte do domínio não pode ter mais de 63 caracteres
    }
    
    return true;
  };

  const validarNome = (nome: string): boolean => {
    // Permite apenas letras, espaços, acentos e hífen
    const regex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    return regex.test(nome) && nome.trim().length >= 3;
  };

  const handleNomeChange = (valor: string) => {
    // Remove números e caracteres especiais (exceto espaço, hífen e apóstrofo)
    const nomeFormatado = valor.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, "");
    setNome(nomeFormatado);
    
    if (nomeFormatado.trim().length === 0) {
      setNomeError("");
    } else if (!validarNome(nomeFormatado)) {
      setNomeError("Nome deve conter apenas letras");
    } else if (nomeFormatado.trim().length < 3) {
      setNomeError("Nome deve ter pelo menos 3 caracteres");
    } else {
      setNomeError("");
    }
  };

  const handleCpfChange = (valor: string) => {
    const cpfFormatado = formatarCPF(valor);
    setCpf(cpfFormatado);
    
    const numeros = cpfFormatado.replace(/\D/g, "");
    if (numeros.length === 0) {
      setCpfError("");
    } else if (numeros.length === 11) {
      if (!validarCPF(cpfFormatado)) {
        setCpfError("CPF inválido");
      } else {
        setCpfError("");
      }
    } else {
      setCpfError("CPF incompleto");
    }
  };

  const handleTelefoneChange = (valor: string) => {
    const telefoneFormatado = formatarTelefone(valor);
    setTelefone(telefoneFormatado);
    
    const numeros = telefoneFormatado.replace(/\D/g, "");
    if (numeros.length === 0) {
      setTelefoneError("");
    } else if (numeros.length < 10) {
      setTelefoneError("Telefone incompleto");
    } else if (numeros.length === 10 || numeros.length === 11) {
      setTelefoneError("");
    }
  };

  const handleEmailChange = (valor: string) => {
    setEmail(valor.trim().toLowerCase());
    
    if (valor.trim().length === 0) {
      setEmailError("");
    } else if (!validarEmail(valor.trim())) {
      if (!valor.includes("@")) {
        setEmailError("Email deve conter @");
      } else if (valor.split("@")[1] && !valor.split("@")[1].includes(".")) {
        setEmailError("Email deve conter um domínio válido");
      } else if (valor.includes("..")) {
        setEmailError("Email não pode conter pontos consecutivos");
      } else if (valor.split("@").length > 2) {
        setEmailError("Email deve conter apenas um @");
      } else {
        setEmailError("Email inválido");
      }
    } else {
      setEmailError("");
    }
  };

  const handleProcessoAnteriorChange = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, "");
    setProcessoAnterior(apenasNumeros);
    
    if (apenasNumeros.length === 0) {
      setProcessoAnteriorError("Por favor, insira o número do processo");
    } else {
      setProcessoAnteriorError("");
    }
  };

  const handleCertidaoAnteriorChange = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, "");
    setCertidaoAnterior(apenasNumeros);
    
    if (apenasNumeros.length === 0) {
      setCertidaoAnteriorError("Por favor, insira o número da certidão");
    } else {
      setCertidaoAnteriorError("");
    }
  };

  // Funções de validação e formatação da Seção 3
  const formatarInscricao = (valor: string): string => {
    const numeros = valor.replace(/\D/g, "");
    if (numeros.length <= 7) {
      return numeros.replace(/(\d{6})(\d)/, "$1-$2");
    }
    return inscricaoImobiliaria;
  };

  const formatarCEP = (valor: string): string => {
    const numeros = valor.replace(/\D/g, "");
    if (numeros.length <= 8) {
      return numeros.replace(/(\d{5})(\d)/, "$1-$2");
    }
    return cep;
  };

  const handleInscricaoChange = (valor: string) => {
    const inscricaoFormatada = formatarInscricao(valor);
    setInscricaoImobiliaria(inscricaoFormatada);
    
    const numeros = inscricaoFormatada.replace(/\D/g, "");
    if (numeros.length === 0) {
      setInscricaoError("Por favor, insira a inscrição imobiliária");
    } else if (numeros.length < 7) {
      setInscricaoError("Inscrição imobiliária incompleta");
    } else {
      setInscricaoError("");
    }
  };

  const handleCepChange = (valor: string) => {
    const cepFormatado = formatarCEP(valor);
    setCep(cepFormatado);
    
    const numeros = cepFormatado.replace(/\D/g, "");
    if (numeros.length === 0) {
      setCepError("Por favor, insira o CEP");
    } else if (numeros.length < 8) {
      setCepError("CEP incompleto");
    } else {
      setCepError("");
    }
  };

  const handleRuaChange = (valor: string) => {
    setRua(valor);
    if (valor.trim().length === 0) {
      setRuaError("Por favor, insira o nome da rua");
    } else {
      setRuaError("");
    }
  };

  const handleNumeroChange = (valor: string) => {
    setNumero(valor);
    if (valor.trim().length === 0) {
      setNumeroError("Por favor, insira o número");
    } else {
      setNumeroError("");
    }
  };

  const handleBairroChange = (valor: string) => {
    setBairro(valor);
    if (valor.trim().length === 0) {
      setBairroError("Por favor, insira o bairro");
    } else {
      setBairroError("");
    }
  };

  const handleCidadeChange = (valor: string) => {
    setCidade(valor);
    if (valor.trim().length === 0) {
      setCidadeError("Por favor, insira a cidade");
    } else {
      setCidadeError("");
    }
  };

  const handleEstadoChange = (valor: string) => {
    const estadoUpper = valor.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 2);
    setEstado(estadoUpper);
    if (estadoUpper.length === 0) {
      setEstadoError("Por favor, insira o estado");
    } else if (estadoUpper.length < 2) {
      setEstadoError("Estado incompleto");
    } else {
      setEstadoError("");
    }
  };

  // Validação de seções
  const isSectionValid = (section: number): boolean => {
    switch (section) {
      case 1: // Taxas
        return guia !== null && comprovante !== null;
      case 2: // Identificação
        const baseValid = tipoSolicitacao && nome && cpf && telefone && email;
        const noErrors = !nomeError && !cpfError && !telefoneError && !emailError;
        if (tipoSolicitacao === "renovacao") {
          const renovacaoValid = processoAnterior && certidaoAnterior;
          const noRenovacaoErrors = !processoAnteriorError && !certidaoAnteriorError;
          return !!(baseValid && noErrors && renovacaoValid && noRenovacaoErrors);
        }
        return !!(baseValid && noErrors);
      case 3: // Localização
        const imovelValid = inscricaoImobiliaria && cep && rua && numero && bairro && cidade && estado;
        const noImovelErrors = !inscricaoError && !cepError && !ruaError && !numeroError && !bairroError && !cidadeError && !estadoError;
        return !!(imovelValid && noImovelErrors);
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
        // Status Social e Estado Civil são obrigatórios
        if (!statusSocial || !estadoCivil) {
          return false;
        }
        // Se marcou residência própria, precisa informar o ano
        if (residenciaPropria && !anoInicio) {
          return false;
        }
        // Verificar se não há erros
        if (statusSocialError || estadoCivilError || anoInicioError) {
          return false;
        }
        // Se tem cônjuge, validar dados do cônjuge (RG não é obrigatório)
        if (temConjuge) {
          const conjugeValid = nomeConjuge && cpfConjuge && telefoneConjuge && emailConjuge;
          const noConjugeErrors = !nomeConjugeError && !cpfConjugeError && !telefoneConjugeError && !emailConjugeError;
          return !!(conjugeValid && noConjugeErrors);
        }
        return true;
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
      
      // Fechar a seção atual e expandir apenas a próxima seção
      setExpandedSections([currentSection + 1]);
      
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
    const numeros = cep.replace(/\D/g, "");
    if (numeros.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${numeros}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setRua(data.logradouro);
          setBairro(data.bairro);
          setCidade(data.localidade);
          setEstado(data.uf);
          setRuaError("");
          setBairroError("");
          setCidadeError("");
          setEstadoError("");
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  // Handlers da Seção 5
  const handleStatusSocialChange = (valor: string) => {
    setStatusSocial(valor);
    if (valor) {
      setStatusSocialError("");
    } else {
      setStatusSocialError("Por favor, selecione o status social");
    }
  };

  const handleEstadoCivilChange = (valor: string) => {
    setEstadoCivil(valor);
    if (valor) {
      setEstadoCivilError("");
    } else {
      setEstadoCivilError("Por favor, selecione o estado civil");
    }
  };

  const handleResidenciaPropriaChange = (checked: boolean) => {
    setResidenciaPropria(checked);
    if (!checked) {
      setAnoInicio("");
      setAnoInicioError("");
    }
    // Remove a mensagem de erro, pois não é mais obrigatório
    setResidenciaPropriaError("");
  };

  const handleAnoInicioChange = (valor: string) => {
    setAnoInicio(valor);
    const anoAtual = new Date().getFullYear();
    const ano = parseInt(valor);
    
    if (!valor) {
      setAnoInicioError("Por favor, informe o ano de início da residência");
    } else if (ano < 1900 || ano > anoAtual) {
      setAnoInicioError(`Ano deve estar entre 1900 e ${anoAtual}`);
    } else {
      setAnoInicioError("");
    }
  };

  // Handlers para campos do cônjuge
  const handleNomeConjugeChange = (valor: string) => {
    // Remove números e caracteres especiais (exceto espaço, hífen e apóstrofo)
    const nomeFormatado = valor.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, "");
    setNomeConjuge(nomeFormatado);
    
    if (nomeFormatado.trim().length === 0) {
      setNomeConjugeError("Por favor, insira o nome do cônjuge");
    } else if (!validarNome(nomeFormatado)) {
      setNomeConjugeError("Nome deve conter apenas letras");
    } else if (nomeFormatado.trim().length < 3) {
      setNomeConjugeError("Nome deve ter pelo menos 3 caracteres");
    } else {
      setNomeConjugeError("");
    }
  };

  const handleCpfConjugeChange = (valor: string) => {
    const cpfFormatado = formatarCPF(valor);
    setCpfConjuge(cpfFormatado);
    
    const numeros = cpfFormatado.replace(/\D/g, "");
    if (numeros.length === 0) {
      setCpfConjugeError("Por favor, insira o CPF do cônjuge");
    } else if (numeros.length === 11) {
      if (!validarCPF(cpfFormatado)) {
        setCpfConjugeError("CPF inválido");
      } else {
        setCpfConjugeError("");
      }
    } else {
      setCpfConjugeError("CPF incompleto");
    }
  };

  const handleTelefoneConjugeChange = (valor: string) => {
    const telefoneFormatado = formatarTelefone(valor);
    setTelefoneConjuge(telefoneFormatado);
    
    const numeros = telefoneFormatado.replace(/\D/g, "");
    if (numeros.length === 0) {
      setTelefoneConjugeError("");
    } else if (numeros.length < 10) {
      setTelefoneConjugeError("Telefone incompleto");
    } else if (numeros.length === 10 || numeros.length === 11) {
      setTelefoneConjugeError("");
    }
  };

  const handleEmailConjugeChange = (valor: string) => {
    setEmailConjuge(valor.trim().toLowerCase());
    
    if (valor.trim().length === 0) {
      setEmailConjugeError("");
    } else if (!validarEmail(valor.trim())) {
      if (!valor.includes("@")) {
        setEmailConjugeError("Email deve conter @");
      } else if (valor.split("@")[1] && !valor.split("@")[1].includes(".")) {
        setEmailConjugeError("Email deve conter um domínio válido");
      } else if (valor.includes("..")) {
        setEmailConjugeError("Email não pode conter pontos consecutivos");
      } else if (valor.split("@").length > 2) {
        setEmailConjugeError("Email deve conter apenas um @");
      } else {
        setEmailConjugeError("Email inválido");
      }
    } else {
      setEmailConjugeError("");
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
      setTelefoneConjuge("");
      setEmailConjuge("");
      setNomeConjugeError("");
      setCpfConjugeError("");
      setTelefoneConjugeError("");
      setEmailConjugeError("");
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

  // Função para gerar dados aleatórios para testes
  const gerarDadosAleatorios = () => {
    // Geradores de dados aleatórios
    const gerarNome = () => {
      const nomes = ["João Silva Santos", "Maria Oliveira Costa", "José Pereira Lima", "Ana Paula Souza", "Carlos Eduardo Mendes", "Fernanda Alves Rocha", "Roberto Carlos Dias", "Juliana Martins Ferreira", "Paulo Henrique Gomes", "Mariana Santos Ribeiro"];
      return nomes[Math.floor(Math.random() * nomes.length)];
    };

    const gerarCPF = () => {
      const n = Math.floor(Math.random() * 999999999) + 1;
      const cpf = String(n).padStart(9, '0');
      let soma = 0;
      for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
      }
      let resto = 11 - (soma % 11);
      const dig1 = resto >= 10 ? 0 : resto;
      
      soma = 0;
      for (let i = 0; i < 10; i++) {
        soma += parseInt((cpf + dig1).charAt(i)) * (11 - i);
      }
      resto = 11 - (soma % 11);
      const dig2 = resto >= 10 ? 0 : resto;
      
      return formatarCPF(cpf + dig1 + dig2);
    };

    const gerarTelefone = () => {
      const ddd = Math.floor(Math.random() * 90) + 11;
      const num = Math.floor(Math.random() * 900000000) + 100000000;
      return formatarTelefone(`${ddd}${num}`);
    };

    const gerarEmail = () => {
      const prefixos = ["joao", "maria", "jose", "ana", "carlos", "fernanda", "roberto", "juliana", "paulo", "mariana"];
      const dominios = ["email.com", "teste.com", "exemplo.com.br", "mail.com"];
      const prefixo = prefixos[Math.floor(Math.random() * prefixos.length)];
      const num = Math.floor(Math.random() * 9999);
      const dominio = dominios[Math.floor(Math.random() * dominios.length)];
      return `${prefixo}${num}@${dominio}`;
    };

    const gerarRG = () => {
      return String(Math.floor(Math.random() * 90000000) + 10000000);
    };

    const gerarInscricao = () => {
      return formatarInscricao(String(Math.floor(Math.random() * 9000000) + 1000000));
    };

    const gerarCEP = () => {
      return formatarCEP(String(Math.floor(Math.random() * 90000000) + 10000000));
    };

    const gerarAno = () => {
      const anoAtual = new Date().getFullYear();
      return String(Math.floor(Math.random() * (anoAtual - 1970)) + 1970);
    };

    // Função para criar arquivo fake para testes
    const criarArquivoFake = (nomeArquivo: string) => {
      const conteudo = `Documento de teste: ${nomeArquivo}\nGerado automaticamente em ${new Date().toLocaleString()}`;
      const blob = new Blob([conteudo], { type: 'application/pdf' });
      return new File([blob], nomeArquivo, { type: 'application/pdf' });
    };

    // Preencher dados de acordo com a seção ativa
    switch (activeSection) {
      case 2: // Identificação
        setTipoSolicitacao("primeira");
        setNome(gerarNome());
        setRg(gerarRG());
        setOrgaoEmissor("SSP/SP");
        const cpfGerado = gerarCPF();
        setCpf(cpfGerado);
        setCpfError("");
        const telGerado = gerarTelefone();
        setTelefone(telGerado);
        setTelefoneError("");
        const emailGerado = gerarEmail();
        setEmail(emailGerado);
        setEmailError("");
        setNomeError("");
        break;

      case 3: // Localização
        setInscricaoImobiliaria(gerarInscricao());
        setCep(gerarCEP());
        setRua("Rua das Flores");
        setNumero(String(Math.floor(Math.random() * 9999) + 1));
        setBairro("Centro");
        setCidade("São Paulo");
        setEstado("SP");
        setLote(String(Math.floor(Math.random() * 99) + 1));
        setQuadra(String(Math.floor(Math.random() * 99) + 1));
        setInscricaoError("");
        setCepError("");
        setRuaError("");
        setNumeroError("");
        setBairroError("");
        setCidadeError("");
        setEstadoError("");
        break;

      case 4: // Documentos
        setDocCertidaoImovel(criarArquivoFake("certidao_imovel.pdf"));
        setDocTaxas(criarArquivoFake("taxas_municipais.pdf"));
        setDocRgCpf(criarArquivoFake("rg_cpf.pdf"));
        setDocResidencia(criarArquivoFake("comprovante_residencia.pdf"));
        setDocRendimentos(criarArquivoFake("comprovante_rendimentos.pdf"));
        setDocEscritura(criarArquivoFake("escritura_imovel.pdf"));
        setDocUnicoImovel(criarArquivoFake("certidao_unico_imovel.pdf"));
        setDocFichaIptu(criarArquivoFake("ficha_iptu.pdf"));
        break;

      case 5: // Declaração
        setStatusSocial("aposentado");
        setEstadoCivil("solteiro");
        setUnicoImovel(true);
        setResidenciaPropria(true);
        setAnoInicio(gerarAno());
        setConfirmaRenda(true);
        setStatusSocialError("");
        setEstadoCivilError("");
        setAnoInicioError("");
        break;

      case 6: // Representação
        setPossuiProcurador(false);
        break;

      case 7: // Assinatura a Rogo
        setAssinaturaRogo(false);
        break;

      case 8: // Preferências
        setPreferenciaAR(true);
        setPreferenciaWhatsapp(true);
        setPreferenciaEmail(false);
        break;

      case 9: // Finalização
        setObservacoes("Observações de teste geradas automaticamente para facilitar o preenchimento do formulário.");
        setAceiteTermo(true);
        break;
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
                  onChange={(e) => handleProcessoAnteriorChange(e.target.value)}
                  className={`${styles.input} ${processoAnteriorError ? styles.inputError : ""}`}
                  placeholder="Ex: 202412345"
                />
                {processoAnteriorError && (
                  <p className={styles.fieldError}>
                    <WarningIcon sx={{ fontSize: 16, marginRight: "4px" }} />
                    {processoAnteriorError}
                  </p>
                )}
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Nº da Certidão <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={certidaoAnterior}
                  onChange={(e) => handleCertidaoAnteriorChange(e.target.value)}
                  className={`${styles.input} ${certidaoAnteriorError ? styles.inputError : ""}`}
                  placeholder="Ex: 987654"
                />
                {certidaoAnteriorError && (
                  <p className={styles.fieldError}>
                    <WarningIcon sx={{ fontSize: 16, marginRight: "4px" }} />
                    {certidaoAnteriorError}
                  </p>
                )}
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
              onChange={(e) => handleNomeChange(e.target.value)}
              className={`${styles.input} ${nomeError ? styles.inputError : ""}`}
              placeholder="Digite seu nome completo"
            />
            {nomeError && (
              <p className={styles.fieldError}>
                <WarningIcon sx={{ fontSize: 16, marginRight: "4px" }} />
                {nomeError}
              </p>
            )}
          </div>

          <div className={styles.gridThree}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                RG
              </label>
              <input
                type="text"
                value={rg}
                onChange={(e) => {
                  // Permite números, letras, pontos, hífens e espaços
                  const rgFormatado = e.target.value.replace(/[^0-9a-zA-Z.\-\s]/g, "");
                  setRg(rgFormatado);
                }}
                className={styles.input}
                placeholder="00.000.000-0"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Órgão Emissor
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
                onChange={(e) => handleCpfChange(e.target.value)}
                className={`${styles.input} ${cpfError ? styles.inputError : ""}`}
                placeholder="000.000.000-00"
              />
              {cpfError && (
                <p className={styles.fieldError}>
                  <WarningIcon sx={{ fontSize: 16, marginRight: "4px" }} />
                  {cpfError}
                </p>
              )}
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
                onChange={(e) => handleTelefoneChange(e.target.value)}
                className={`${styles.input} ${telefoneError ? styles.inputError : ""}`}
                placeholder="(00) 00000-0000"
              />
              {telefoneError && (
                <p className={styles.fieldError}>
                  <WarningIcon sx={{ fontSize: 16, marginRight: "4px" }} />
                  {telefoneError}
                </p>
              )}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                E-mail <span className={styles.required}>*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                className={`${styles.input} ${emailError ? styles.inputError : ""}`}
                placeholder="seu@email.com"
              />
              {emailError && (
                <p className={styles.fieldError}>
                  <WarningIcon sx={{ fontSize: 16, marginRight: "4px" }} />
                  {emailError}
                </p>
              )}
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
              onChange={(e) => handleInscricaoChange(e.target.value)}
              className={`${styles.input} ${inscricaoError ? styles.inputError : ""}`}
              placeholder="000000-0"
            />
            {inscricaoError && (
              <p className={styles.fieldError}>
                <WarningIcon sx={{ fontSize: 16, marginRight: "4px" }} />
                {inscricaoError}
              </p>
            )}
          </div>

          <div className={styles.gridTwo}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                CEP <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={cep}
                onChange={(e) => handleCepChange(e.target.value)}
                onBlur={handleCepBlur}
                className={`${styles.input} ${cepError ? styles.inputError : ""}`}
                placeholder="00000-000"
              />
              {cepError && (
                <p className={styles.fieldError}>
                  <WarningIcon sx={{ fontSize: 16, marginRight: "4px" }} />
                  {cepError}
                </p>
              )}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Rua/Logradouro <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={rua}
                onChange={(e) => handleRuaChange(e.target.value)}
                className={`${styles.input} ${ruaError ? styles.inputError : ""}`}
                placeholder="Nome da rua"
              />
              {ruaError && (
                <p className={styles.fieldError}>
                  <WarningIcon sx={{ fontSize: 16, marginRight: "4px" }} />
                  {ruaError}
                </p>
              )}
            </div>
          </div>

          <div className={styles.gridThree}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Bairro <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={bairro}
                onChange={(e) => handleBairroChange(e.target.value)}
                className={`${styles.input} ${bairroError ? styles.inputError : ""}`}
                placeholder="Bairro"
              />
              {bairroError && (
                <p className={styles.fieldError}>
                  <WarningIcon sx={{ fontSize: 16, marginRight: "4px" }} />
                  {bairroError}
                </p>
              )}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Cidade <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={cidade}
                onChange={(e) => handleCidadeChange(e.target.value)}
                className={`${styles.input} ${cidadeError ? styles.inputError : ""}`}
                placeholder="Cidade"
              />
              {cidadeError && (
                <p className={styles.fieldError}>
                  <WarningIcon sx={{ fontSize: 16, marginRight: "4px" }} />
                  {cidadeError}
                </p>
              )}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Estado <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={estado}
                onChange={(e) => handleEstadoChange(e.target.value)}
                className={`${styles.input} ${estadoError ? styles.inputError : ""}`}
                placeholder="UF"
                maxLength={2}
              />
              {estadoError && (
                <p className={styles.fieldError}>
                  <WarningIcon sx={{ fontSize: 16, marginRight: "4px" }} />
                  {estadoError}
                </p>
              )}
            </div>
          </div>

          <div className={styles.gridThree}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Número <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={numero}
                onChange={(e) => handleNumeroChange(e.target.value)}
                className={`${styles.input} ${numeroError ? styles.inputError : ""}`}
                placeholder="Nº"
              />
              {numeroError && (
                <p className={styles.fieldError}>
                  <WarningIcon sx={{ fontSize: 16, marginRight: "4px" }} />
                  {numeroError}
                </p>
              )}
            </div>
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
            <h2 className={styles.sectionTitle}>04. Documentação Necessária</h2>
            <div className={styles.sectionHeaderIcons}>
              {completedSections.includes(4) && <CheckCircleIcon className={styles.checkIcon} />}
              <ExpandMoreIcon 
                className={`${styles.expandIcon} ${expandedSections.includes(4) ? styles.expandIconOpen : ''}`}
              />
            </div>
          </div>

          {expandedSections.includes(4) && (
            <div className={styles.sectionContent} style={{ pointerEvents: activeSection >= 4 ? "auto" : "none" }}>
          <div className={styles.uploadGrid}>
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
              <div key={index} className={styles.uploadField}>
                <label className={styles.labelDoc}>
                  {doc.label} <span className={styles.required}>*</span>
                </label>
                <label className={styles.uploadButton}>
                  <CloudUploadIcon sx={{ marginRight: "8px" }} />
                  Anexar arquivo
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => e.target.files && doc.setFile(e.target.files[0])}
                    className={styles.fileInput}
                  />
                </label>
                {doc.file && <p className={styles.fileName}>{doc.file.name}</p>}
                  {/* Mensagem de erro removida, pois o botão Continuar já está bloqueado até anexar todos os arquivos obrigatórios */}
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
                onChange={(e) => handleStatusSocialChange(e.target.value)}
                className={`${styles.select} ${statusSocialError ? styles.inputError : ""}`}
              >
                <option value="">Selecione...</option>
                <option value="aposentado">Aposentado</option>
                <option value="pensionista">Pensionista</option>
                <option value="ambos">Aposentado e Pensionista</option>
              </select>
              {statusSocialError && (
                <p className={styles.fieldError}>
                  <WarningIcon sx={{ fontSize: 16, marginRight: "4px" }} />
                  {statusSocialError}
                </p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Estado Civil <span className={styles.required}>*</span>
              </label>
              <select
                value={estadoCivil}
                onChange={(e) => handleEstadoCivilChange(e.target.value)}
                className={`${styles.select} ${estadoCivilError ? styles.inputError : ""}`}
              >
                <option value="">Selecione...</option>
                <option value="solteiro">Solteiro(a)</option>
                <option value="casado">Casado(a)</option>
                <option value="viuvo">Viúvo(a)</option>
                <option value="divorciado">Divorciado(a)</option>
                <option value="uniao-estavel">União Estável</option>
              </select>
              {estadoCivilError && (
                <p className={styles.fieldError}>
                  <WarningIcon sx={{ fontSize: 16, marginRight: "4px" }} />
                  {estadoCivilError}
                </p>
              )}
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
              Único imóvel de propriedade
            </label>
          </div>

          <div className={styles.gridTwo}>
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={residenciaPropria}
                  onChange={(e) => handleResidenciaPropriaChange(e.target.checked)}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxCustom}></span>
                Residência própria <span className={styles.required}>*</span>
              </label>
              {residenciaPropriaError && (
                <p className={styles.fieldError}>
                  <WarningIcon sx={{ fontSize: 16, marginRight: "4px" }} />
                  {residenciaPropriaError}
                </p>
              )}
            </div>

            {residenciaPropria && (
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Ano de início da residência <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  value={anoInicio}
                  onChange={(e) => handleAnoInicioChange(e.target.value)}
                  className={`${styles.input} ${anoInicioError ? styles.inputError : ""}`}
                  placeholder="Ex: 2010"
                  min="1900"
                  max={new Date().getFullYear()}
                />
                {anoInicioError && (
                  <p className={styles.fieldError}>
                    <WarningIcon sx={{ fontSize: 16, marginRight: "4px" }} />
                    {anoInicioError}
                  </p>
                )}
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
              Confirmo que minha renda familiar não ultrapassa 2 salários mínimos
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
                  onChange={(e) => handleNomeConjugeChange(e.target.value)}
                  className={`${styles.input} ${nomeConjugeError ? styles.inputError : ""}`}
                  placeholder="Nome completo do cônjuge"
                />
                {nomeConjugeError && (
                  <p className={styles.fieldError}>
                    <WarningIcon sx={{ fontSize: 16, marginRight: "4px" }} />
                    {nomeConjugeError}
                  </p>
                )}
              </div>

              <div className={styles.gridTwo}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    CPF <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    value={cpfConjuge}
                    onChange={(e) => handleCpfConjugeChange(e.target.value)}
                    className={`${styles.input} ${cpfConjugeError ? styles.inputError : ""}`}
                    placeholder="000.000.000-00"
                  />
                  {cpfConjugeError && (
                    <p className={styles.fieldError}>
                      <WarningIcon sx={{ fontSize: 16, marginRight: "4px" }} />
                      {cpfConjugeError}
                    </p>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    RG
                  </label>
                  <input
                    type="text"
                    value={rgConjuge}
                    onChange={(e) => {
                      // Permite números, letras, pontos, hífens e espaços
                      const rgFormatado = e.target.value.replace(/[^0-9a-zA-Z.\-\s]/g, "");
                      setRgConjuge(rgFormatado);
                    }}
                    className={styles.input}
                    placeholder="00.000.000-0"
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
                    value={telefoneConjuge}
                    onChange={(e) => handleTelefoneConjugeChange(e.target.value)}
                    className={`${styles.input} ${telefoneConjugeError ? styles.inputError : ""}`}
                    placeholder="(00) 00000-0000"
                  />
                  {telefoneConjugeError && (
                    <p className={styles.fieldError}>
                      <WarningIcon sx={{ fontSize: 16, marginRight: "4px" }} />
                      {telefoneConjugeError}
                    </p>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    E-mail <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="email"
                    value={emailConjuge}
                    onChange={(e) => handleEmailConjugeChange(e.target.value)}
                    className={`${styles.input} ${emailConjugeError ? styles.inputError : ""}`}
                    placeholder="email@exemplo.com"
                  />
                  {emailConjugeError && (
                    <p className={styles.fieldError}>
                      <WarningIcon sx={{ fontSize: 16, marginRight: "4px" }} />
                      {emailConjugeError}
                    </p>
                  )}
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

      {/* Botão flutuante para gerar dados aleatórios */}
      {activeSection >= 2 && (
        <button
          onClick={gerarDadosAleatorios}
          className={styles.btnGerarDados}
          title="Gerar dados aleatórios para teste"
        >
          🎲 Gerar Dados
        </button>
      )}
    </div>
  );
}
