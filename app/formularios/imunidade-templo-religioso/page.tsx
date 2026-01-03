"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { gerarDadosAleatorios } from "@/utils/gerarDadosAleatorios";
import { enviarRequerimentoCompleto } from "@/utils/enviarEmail";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ComprovanteTaxa from "@/components/ComprovanteTaxa/ComprovanteTaxa";
import LoadingModal from "@/components/LoadingModal/LoadingModal";
import styles from "./page.module.css";
import ChurchIcon from "@mui/icons-material/Church";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WarningIcon from "@mui/icons-material/Warning";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GavelIcon from "@mui/icons-material/Gavel";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ImunidadeTemploReligiosoPage() {
  // Estado para controlar qual seção está ativa
  const [activeSection, setActiveSection] = useState(1);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [expandedSections, setExpandedSections] = useState<number[]>([]); // Seção 1 começa fechada
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);

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

  // Estados da Seção 3 - Procurador/Representação
  const [possuiProcurador, setPossuiProcurador] = useState(false);
  const [nomeProcurador, setNomeProcurador] = useState("");
  const [cpfProcurador, setCpfProcurador] = useState("");
  const [rgProcurador, setRgProcurador] = useState("");
  const [orgaoEmissorProcurador, setOrgaoEmissorProcurador] = useState("");
  const [telefoneProcurador, setTelefoneProcurador] = useState("");
  const [emailProcurador, setEmailProcurador] = useState("");
  const [docProcuracao, setDocProcuracao] = useState<File | null>(null);
  const [docCpfProcurador, setDocCpfProcurador] = useState<File | null>(null);
  const [docIdentidadeProcurador, setDocIdentidadeProcurador] =
    useState<File | null>(null);

  // Estados de validação e erro da Seção 3
  const [nomeProcuradorError, setNomeProcuradorError] = useState("");
  const [cpfProcuradorError, setCpfProcuradorError] = useState("");
  const [telefoneProcuradorError, setTelefoneProcuradorError] = useState("");
  const [emailProcuradorError, setEmailProcuradorError] = useState("");

  // Estados da Seção 4 - Localização do Imóvel
  const [inscricaoImobiliaria, setInscricaoImobiliaria] = useState("");
  const [inscricaoMercantil, setInscricaoMercantil] = useState("");
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [lote, setLote] = useState("");
  const [quadra, setQuadra] = useState("");

  // Estados de validação e erro da Seção 4
  const [inscricaoError, setInscricaoError] = useState("");
  const [inscricaoMercantilError, setInscricaoMercantilError] = useState("");
  const [cepError, setCepError] = useState("");
  const [ruaError, setRuaError] = useState("");
  const [numeroError, setNumeroError] = useState("");
  const [bairroError, setBairroError] = useState("");
  const [cidadeError, setCidadeError] = useState("");
  const [estadoError, setEstadoError] = useState("");

  // Estados da Seção 5 - Documentos (atualizados)
  const [docEstatuto, setDocEstatuto] = useState<File | null>(null);
  const [docAtaDiretoria, setDocAtaDiretoria] = useState<File | null>(null);
  const [docImovel, setDocImovel] = useState<File | null>(null);
  const [docIptu, setDocIptu] = useState<File | null>(null);
  const [docCroqui, setDocCroqui] = useState<File | null>(null);
  const [docCadastro, setDocCadastro] = useState<File | null>(null);
  const [docRgCpf, setDocRgCpf] = useState<File | null>(null);

  // Estados da Seção 6 - Preferências de Comunicação
  const [preferenciaAR, setPreferenciaAR] = useState(false);
  const [preferenciaWhatsapp, setPreferenciaWhatsapp] = useState(false);
  const [preferenciaEmail, setPreferenciaEmail] = useState(false);

  // Estados da Seção 7 - Finalização
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
    const regex =
      /^[a-zA-Z0-9]([a-zA-Z0-9._-])*[a-zA-Z0-9]@[a-zA-Z0-9]([a-zA-Z0-9-])*[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;

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

  // Validação de tamanho de arquivo (máximo 5MB)
  const validarTamanhoArquivo = (file: File): boolean => {
    const maxSize = 5 * 1024 * 1024; // 5MB em bytes
    if (file.size > maxSize) {
      const tamanhoMB = (file.size / (1024 * 1024)).toFixed(2);
      toast.error(
        `Arquivo muito grande! "${file.name}" possui ${tamanhoMB}MB. O tamanho máximo permitido é 5MB.`,
        {
          autoClose: 6000,
        }
      );
      return false;
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

  const handleInscricaoMercantilChange = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, "");
    setInscricaoMercantil(apenasNumeros);

    if (apenasNumeros.length < 4) {
      setInscricaoMercantilError("Inscrição mercantil muito curta");
    } else {
      setInscricaoMercantilError("");
    }
  };

  // Funções de validação e formatação da Seção 4
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
    const estadoUpper = valor
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .slice(0, 2);
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
        const noErrors =
          !nomeError && !cpfError && !telefoneError && !emailError;
        if (tipoSolicitacao === "renovacao") {
          const renovacaoValid = processoAnterior && certidaoAnterior;
          const noRenovacaoErrors =
            !processoAnteriorError && !certidaoAnteriorError;
          return !!(
            baseValid &&
            noErrors &&
            renovacaoValid &&
            noRenovacaoErrors
          );
        }
        return !!(baseValid && noErrors);
      case 3: // Procurador/Representação
        if (possuiProcurador) {
          const procuradorValid =
            nomeProcurador &&
            cpfProcurador &&
            telefoneProcurador &&
            emailProcurador;
          const docsValid =
            docProcuracao && docCpfProcurador && docIdentidadeProcurador;
          const noErrors =
            !nomeProcuradorError &&
            !cpfProcuradorError &&
            !telefoneProcuradorError &&
            !emailProcuradorError;
          return !!(procuradorValid && docsValid && noErrors);
        }
        return true;
      case 4: // Localização
        const temInscricao = inscricaoImobiliaria || inscricaoMercantil;
        const imovelValid =
          temInscricao &&
          cep &&
          rua &&
          numero &&
          bairro &&
          cidade &&
          estado;
        const noImovelErrors =
          !inscricaoError &&
          !inscricaoMercantilError &&
          !cepError &&
          !ruaError &&
          !numeroError &&
          !bairroError &&
          !cidadeError &&
          !estadoError;
        return !!(imovelValid && noImovelErrors);
      case 5: // Documentos (atualizados)
        return !!(
          docEstatuto &&
          docAtaDiretoria &&
          docImovel &&
          docIptu &&
          docCroqui &&
          docCadastro &&
          docRgCpf
        );
      case 6: // Preferências
        const selectedCount = [
          preferenciaAR,
          preferenciaWhatsapp,
          preferenciaEmail,
        ].filter(Boolean).length;
        return selectedCount >= 2;
      case 7: // Finalização
        return aceiteTermo;
      default:
        return false;
    }
  };

  // Toggle expansão de seção
  const toggleSection = (section: number) => {
    if (expandedSections.includes(section)) {
      setExpandedSections(expandedSections.filter((s) => s !== section));
    } else {
      setExpandedSections([...expandedSections, section]);
    }
  };

  // Função para iniciar o preenchimento do requerimento
  const handleStartFilling = () => {
    setActiveSection(1);
    setExpandedSections([1]);
    // Rolar até a seção 1
    setTimeout(() => {
      const section1 = document.querySelector('[data-section="1"]');
      if (section1) {
        section1.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
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
        const nextSection = document.querySelector(
          `[data-section="${currentSection + 1}"]`
        );
        if (nextSection) {
          const yOffset = -80;
          const y =
            nextSection.getBoundingClientRect().top +
            window.pageYOffset +
            yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 150);
    }
  };

  // Auto-complete de endereço via CEP
  const handleCepBlur = async () => {
    const numeros = cep.replace(/\D/g, "");
    if (numeros.length === 8) {
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${numeros}/json/`
        );
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
        } else {
          toast.error(
            "CEP não encontrado. Verifique o número digitado e tente novamente."
          );
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        toast.error("Erro ao buscar CEP. Tente novamente mais tarde.");
      }
    }
  };

  // Handlers da Seção 3 - Procurador
  const handleNomeProcuradorChange = (valor: string) => {
    const nomeFormatado = valor.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, "");
    setNomeProcurador(nomeFormatado);

    if (nomeFormatado.trim().length === 0) {
      setNomeProcuradorError("Por favor, insira o nome do procurador");
    } else if (!validarNome(nomeFormatado)) {
      setNomeProcuradorError("Nome deve conter apenas letras");
    } else if (nomeFormatado.trim().length < 3) {
      setNomeProcuradorError("Nome deve ter pelo menos 3 caracteres");
    } else {
      setNomeProcuradorError("");
    }
  };

  const handleCpfProcuradorChange = (valor: string) => {
    const cpfFormatado = formatarCPF(valor);
    setCpfProcurador(cpfFormatado);

    const numeros = cpfFormatado.replace(/\D/g, "");
    if (numeros.length === 0) {
      setCpfProcuradorError("Por favor, insira o CPF do procurador");
    } else if (numeros.length === 11) {
      if (!validarCPF(cpfFormatado)) {
        setCpfProcuradorError("CPF inválido");
      } else {
        setCpfProcuradorError("");
      }
    } else {
      setCpfProcuradorError("CPF incompleto");
    }
  };

  const handleTelefoneProcuradorChange = (valor: string) => {
    const telefoneFormatado = formatarTelefone(valor);
    setTelefoneProcurador(telefoneFormatado);

    const numeros = telefoneFormatado.replace(/\D/g, "");
    if (numeros.length === 0) {
      setTelefoneProcuradorError("Por favor, insira o telefone do procurador");
    } else if (numeros.length < 10) {
      setTelefoneProcuradorError("Telefone incompleto");
    } else if (numeros.length === 10 || numeros.length === 11) {
      setTelefoneProcuradorError("");
    }
  };

  const handleEmailProcuradorChange = (valor: string) => {
    setEmailProcurador(valor.trim().toLowerCase());

    if (valor.trim().length === 0) {
      setEmailProcuradorError("Por favor, insira o email do procurador");
    } else if (!validarEmail(valor.trim())) {
      if (!valor.includes("@")) {
        setEmailProcuradorError("Email deve conter @");
      } else if (valor.split("@")[1] && !valor.split("@")[1].includes(".")) {
        setEmailProcuradorError("Email deve conter um domínio válido");
      } else if (valor.includes("..")) {
        setEmailProcuradorError("Email não pode conter pontos consecutivos");
      } else if (valor.split("@").length > 2) {
        setEmailProcuradorError("Email deve conter apenas um @");
      } else {
        setEmailProcuradorError("Email inválido");
      }
    } else {
      setEmailProcuradorError("");
    }
  };

  // Handlers para campos das testemunhas
  const handleContinueTaxas = (
    guiaFile: File | null,
    comprovanteFile: File | null
  ) => {
    setGuia(guiaFile);
    setComprovante(comprovanteFile);
    if (guiaFile && comprovanteFile) {
      handleNextSection(1);
    }
  };

  const handleSubmit = async () => {
    if (!isSectionValid(7)) return;

    const dadosFormulario = {
      formularioSlug: "imunidade-templo-religioso",
      tipoFormulario: "Imunidade para Templos Religiosos",
      
      // Seção 1: Taxas
      possuiGuiaTaxa: guia !== null,
      possuiComprovanteTaxa: comprovante !== null,
      
      // Seção 2: Identificação
      tipoSolicitacao,
      processoAnterior,
      certidaoAnterior,
      nome,
      rg,
      orgaoEmissor,
      cpf,
      telefone,
      email,
      
      // Seção 3: Localização e Inscrições
      inscricaoImobiliaria,
      inscricaoMercantil,
      cep,
      rua,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      lote,
      quadra,
      
      // Seção 4: Documentos anexados
      documentosAnexados: [
        guia ? "Guia de Pagamento" : null,
        comprovante ? "Comprovante de Pagamento" : null,
        docEstatuto ? "Estatuto Social e alterações" : null,
        docAtaDiretoria ? "Ata de Eleição da diretoria" : null,
        docImovel ? "Documento do imóvel" : null,
        docIptu ? "Registro de IPTU do imóvel" : null,
        docCroqui ? "Croqui de localização" : null,
        docCadastro ? "Registro de cadastro imobiliário" : null,
        docRgCpf ? "Identificação (RG/CPF)" : null,
        // Documentos do Procurador
        possuiProcurador && docProcuracao ? "Procuração Autenticada" : null,
        possuiProcurador && docCpfProcurador ? "CPF do Procurador" : null,
        possuiProcurador && docIdentidadeProcurador ? "Identidade do Procurador" : null,
        // Outros documentos
        docPeticao ? "Petição" : null,
      ].filter(Boolean),

      // Mapeamento de nomes de arquivos originais
      nomesArquivos: {
        guia: guia?.name || "",
        comprovante: comprovante?.name || "",
        docEstatuto: docEstatuto?.name || "",
        docAtaDiretoria: docAtaDiretoria?.name || "",
        docImovel: docImovel?.name || "",
        docIptu: docIptu?.name || "",
        docCroqui: docCroqui?.name || "",
        docCadastro: docCadastro?.name || "",
        docRgCpf: docRgCpf?.name || "",
        docProcuracao: possuiProcurador ? (docProcuracao?.name || "") : "",
        docCpfProcurador: possuiProcurador ? (docCpfProcurador?.name || "") : "",
        docIdentidadeProcurador: possuiProcurador ? (docIdentidadeProcurador?.name || "") : "",
        docPeticao: docPeticao?.name || "",
      },
      
      // Seção 6: Procurador (se houver)
      possuiProcurador,
      nomeProcurador: possuiProcurador ? nomeProcurador : undefined,
      cpfProcurador: possuiProcurador ? cpfProcurador : undefined,
      rgProcurador: possuiProcurador ? rgProcurador : undefined,
      orgaoEmissorProcurador: possuiProcurador ? orgaoEmissorProcurador : undefined,
      telefoneProcurador: possuiProcurador ? telefoneProcurador : undefined,
      emailProcurador: possuiProcurador ? emailProcurador : undefined,
      
      // Seção 7: Preferências de Comunicação
      preferenciaAR,
      preferenciaWhatsapp,
      preferenciaEmail: preferenciaEmail,
      
      // Seção 8: Observações
      observacoes,
    };
    
    const arquivos = {
      guia: guia,
      comprovante: comprovante,
      docEstatuto: docEstatuto,
      docAtaDiretoria: docAtaDiretoria,
      docImovel: docImovel,
      docIptu: docIptu,
      docCroqui: docCroqui,
      docCadastro: docCadastro,
      docRgCpf: docRgCpf,
      docProcuracao: docProcuracao,
      docCpfProcurador: docCpfProcurador,
      docIdentidadeProcurador: docIdentidadeProcurador,
      docPeticao: docPeticao,
    };
    
    setIsLoadingModalOpen(true);

    const resultado = await enviarRequerimentoCompleto(dadosFormulario, arquivos);

    setIsLoadingModalOpen(false);

    if (resultado.success) {
      toast.success(
        "Requerimento enviado com sucesso! Em breve você receberá um e-mail de confirmação.",
        {
          autoClose: 5000,
        }
      );
    } else {
      toast.error(
        "Erro ao enviar o requerimento. Por favor, tente novamente.",
        {
          autoClose: 5000,
        }
      );
    }
  };

  // Função para preencher dados aleatórios usando utilitário externo
  const preencherDadosAleatorios = () => {
    const dados = gerarDadosAleatorios({
      incluirDocumentos: true,
      incluirConjuge: true,
      incluirProcurador: true,
      incluirTaxas: true,
    });

    switch (activeSection) {
      case 1:
        setGuia(dados.guiaTaxa || null);
        setComprovante(dados.comprovanteTaxa || null);
        break;
      case 2:
        setTipoSolicitacao("primeira");
        setNome(dados.nome);
        setRg(dados.rg);
        setOrgaoEmissor("SSP/SP");
        setCpf(dados.cpf);
        setCpfError("");
        setTelefone(dados.telefone);
        setTelefoneError("");
        setEmail(dados.email);
        setEmailError("");
        setNomeError("");
        break;
      case 3:
        setPossuiProcurador(true);
        if (dados.procurador) {
          setNomeProcurador(dados.procurador.nome);
          setCpfProcurador(dados.procurador.cpf);
          setRgProcurador(dados.procurador.rg);
          setTelefoneProcurador(dados.procurador.telefone);
          setEmailProcurador(dados.procurador.email);
          setDocProcuracao(dados.procurador.documentos?.[0] || null);
          setDocCpfProcurador(dados.procurador.documentos?.[1] || null);
          setDocIdentidadeProcurador(dados.procurador.documentos?.[2] || null);
        }
        break;
      case 4:
        setInscricaoImobiliaria("1234567-8");
        setInscricaoMercantil("123456");
        setCep("01001-000");
        setRua("Rua das Flores");
        setNumero("123");
        setBairro("Centro");
        setCidade("São Paulo");
        setEstado("SP");
        setLote("1");
        setQuadra("A");
        setInscricaoError("");
        setInscricaoMercantilError("");
        setCepError("");
        setRuaError("");
        setNumeroError("");
        setBairroError("");
        setCidadeError("");
        setEstadoError("");
        break;
      case 5:
        setDocEstatuto(dados.documentos?.[0] || null);
        setDocAtaDiretoria(dados.documentos?.[1] || null);
        setDocImovel(dados.documentos?.[0] || null);
        setDocIptu(dados.documentos?.[1] || null);
        setDocCroqui(dados.documentos?.[0] || null);
        setDocCadastro(dados.documentos?.[1] || null);
        setDocRgCpf(dados.documentos?.[0] || null);
        break;
      case 6:
        setPreferenciaAR(true);
        setPreferenciaWhatsapp(true);
        setPreferenciaEmail(false);
        break;
      case 7:
        setObservacoes(
          "Observações de teste geradas automaticamente para facilitar o preenchimento do formulário."
        );
        setAceiteTermo(true);
        break;
    }
  };

  return (
    <div className={styles.page}>
      <Header
        icon={<ChurchIcon sx={{ fontSize: 56, color: "#EB5F1A" }} />}
        processType="IMUNIDADE"
        title="Imunidade para Templo Religioso"
        description="Imóvel destinado ao funcionamento de templos religiosos."
      />
      <main className={styles.main}>
        {/* Seção de Explicação - Nova */}
        <section className={styles.explanationSection}>
          <div className={styles.explanationContent}>
            <div className={styles.explanationImageContainer}>
              {/* Imagem para Desktop (Vertical) */}
              <Image
                src="/assets/imunidade-templo-religioso/imunidade.webp"
                alt="Templo Religioso"
                width={300}
                height={300}
                className={`${styles.explanationImage} ${styles.explanationImageDesktop}`}
                priority
              />
              {/* Imagem para Mobile (Horizontal) */}
              <Image
                src="/assets/imunidade-templo-religioso/imunidade-mobile.webp"
                alt="Templo Religioso"
                width={800}
                height={400}
                className={`${styles.explanationImage} ${styles.explanationImageMobile}`}
                priority
              />
            </div>
            <div className={styles.explanationTextContainer}>
              <h2 className={styles.explanationTitle}>
                Imunidade Tributária para Templos Religiosos
              </h2>
              <div className={styles.explanationText}>
                <p>
                  <strong>Quem tem direito?</strong> Templos de qualquer culto religioso, assegurada pela Constituição Federal, para imóveis utilizados em suas atividades essenciais.
                </p>
                <p>
                  <strong>O que você precisa saber:</strong>
                </p>
                <ul>
                  <li>Ser templo de qualquer culto religioso</li>
                  <li>Imóvel utilizado para atividades religiosas</li>
                  <li>Vedação à distribuição de lucros</li>
                  <li>Aplicação de recursos nas finalidades essenciais</li>
                </ul>
                <p>
                  <strong>Documentos necessários:</strong> Estatuto da entidade religiosa, comprovante de CNPJ, ata de eleição da diretoria, certidão de matrícula do imóvel e outros documentos que serão solicitados ao longo do formulário.
                </p>
                <div className={styles.explanationAlert}>
                  <WarningIcon sx={{ fontSize: 24, color: "#EB5F1A" }} />
                  <span>
                    A imunidade é constitucional e permanente enquanto mantidas as condições previstas.
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.explanationButtonContainer}>
            <button 
              className={styles.btnStartFilling} 
              onClick={handleStartFilling}
            >
              <AssignmentIcon sx={{ fontSize: 24 }} />
              Solicitar Imunidade
            </button>
          </div>
        </section>

        <div className={styles.formContainer}>

        {/* Seção 1 - Taxas */}
        <section
          data-section="1"
          className={`${styles.section} ${
            activeSection === 1 ? styles.sectionActive : ""
          } ${completedSections.includes(1) ? styles.sectionCompleted : ""}`}
          style={{ opacity: activeSection >= 1 ? 1 : 0.5 }}
        >
          <div
            className={styles.sectionHeader}
            onClick={() => toggleSection(1)}
            style={{ cursor: "pointer" }}
          >
            <h2 className={styles.sectionTitle}>
              01. Comprovante da Taxa de Abertura
            </h2>
            <div className={styles.sectionHeaderIcons}>
              {completedSections.includes(1) && (
                <CheckCircleIcon className={styles.checkIcon} />
              )}
              <ExpandMoreIcon
                className={`${styles.expandIcon} ${
                  expandedSections.includes(1) ? styles.expandIconOpen : ""
                }`}
              />
            </div>
          </div>

          {expandedSections.includes(1) && (
            <div className={styles.sectionContent}>
              <ComprovanteTaxa
                titulo=""
                onContinue={handleContinueTaxas}
                guiaInicial={guia}
                comprovanteInicial={comprovante}
              />
            </div>
          )}
        </section>

        {/* Seção 2 - Identificação */}
        <section
          data-section="2"
          className={`${styles.section} ${
            activeSection === 2 ? styles.sectionActive : ""
          } ${completedSections.includes(2) ? styles.sectionCompleted : ""}`}
          style={{ opacity: activeSection >= 2 ? 1 : 0.5 }}
        >
          <div
            className={styles.sectionHeader}
            onClick={() => toggleSection(2)}
            style={{ cursor: "pointer" }}
          >
            <h2 className={styles.sectionTitle}>
              02. Identificação do Requerente
            </h2>
            <div className={styles.sectionHeaderIcons}>
              {completedSections.includes(2) && (
                <CheckCircleIcon className={styles.checkIcon} />
              )}
              <ExpandMoreIcon
                className={`${styles.expandIcon} ${
                  expandedSections.includes(2) ? styles.expandIconOpen : ""
                }`}
              />
            </div>
          </div>

          {expandedSections.includes(2) && (
            <div
              className={styles.sectionContent}
              style={{ pointerEvents: activeSection >= 2 ? "auto" : "none" }}
            >
              <p className={styles.sectionDescription}>
                Preencha com os dados da pessoa responsável ou da empresa
                responsável pelo imóvel.
              </p>

              <div className={styles.alertBox}>
                <div className={styles.alertContent}>
                  <span className={styles.alertTitle}>
                    <WarningIcon sx={{ fontSize: 28, color: "#EB5F1A" }} />
                    ATENÇÃO:
                  </span>
                  <p>
                    Se você não for o contribuinte responsável pelo imóvel, é
                    necessário preencher a procuração na próxima tela.
                  </p>
                </div>
              </div>

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
                      Nº do Processo Anterior{" "}
                      <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      value={processoAnterior}
                      onChange={(e) =>
                        handleProcessoAnteriorChange(e.target.value)
                      }
                      className={`${styles.input} ${
                        processoAnteriorError ? styles.inputError : ""
                      }`}
                      placeholder="Ex: 202412345"
                    />
                    {processoAnteriorError && (
                      <p className={styles.fieldError}>
                        <WarningIcon
                          sx={{ fontSize: 16, marginRight: "4px" }}
                        />
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
                      onChange={(e) =>
                        handleCertidaoAnteriorChange(e.target.value)
                      }
                      className={`${styles.input} ${
                        certidaoAnteriorError ? styles.inputError : ""
                      }`}
                      placeholder="Ex: 987654"
                    />
                    {certidaoAnteriorError && (
                      <p className={styles.fieldError}>
                        <WarningIcon
                          sx={{ fontSize: 16, marginRight: "4px" }}
                        />
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
                  className={`${styles.input} ${
                    nomeError ? styles.inputError : ""
                  }`}
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
                  <label className={styles.label}>RG</label>
                  <input
                    type="text"
                    value={rg}
                    onChange={(e) => {
                      // Permite números, letras, pontos, hífens e espaços
                      const rgFormatado = e.target.value.replace(
                        /[^0-9a-zA-Z.\-\s]/g,
                        ""
                      );
                      setRg(rgFormatado);
                    }}
                    className={styles.input}
                    placeholder="00.000.000-0"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Órgão Emissor</label>
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
                    className={`${styles.input} ${
                      cpfError ? styles.inputError : ""
                    }`}
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
                    className={`${styles.input} ${
                      telefoneError ? styles.inputError : ""
                    }`}
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
                    className={`${styles.input} ${
                      emailError ? styles.inputError : ""
                    }`}
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

        {/* Seção 3 - Informações do Procurador */}
        <section
          data-section="3"
          className={`${styles.section} ${
            activeSection === 3 ? styles.sectionActive : ""
          } ${completedSections.includes(3) ? styles.sectionCompleted : ""}`}
          style={{ opacity: activeSection >= 3 ? 1 : 0.5 }}
        >
          <div
            className={styles.sectionHeader}
            onClick={() => toggleSection(3)}
            style={{ cursor: "pointer" }}
          >
            <h2 className={styles.sectionTitle}>
              03. Identificação do Procurador
            </h2>
            <div className={styles.sectionHeaderIcons}>
              {completedSections.includes(3) && (
                <CheckCircleIcon className={styles.checkIcon} />
              )}
              <ExpandMoreIcon
                className={`${styles.expandIcon} ${
                  expandedSections.includes(3) ? styles.expandIconOpen : ""
                }`}
              />
            </div>
          </div>

          {expandedSections.includes(3) && (
            <div
              className={styles.sectionContent}
              style={{ pointerEvents: activeSection >= 3 ? "auto" : "none" }}
            >
              <p className={styles.sectionDescription}>
                Preencha com os dados do procurador responsável, caso exista.
              </p>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={possuiProcurador}
                    onChange={(e) => setPossuiProcurador(e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkboxCustom}></span>
                  Sou um procurador ou possuo uma procuração.
                </label>
              </div>

              {possuiProcurador && (
                <div className={styles.procuradorSection}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Nome do Procurador{" "}
                      <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      value={nomeProcurador}
                      onChange={(e) =>
                        handleNomeProcuradorChange(e.target.value)
                      }
                      className={`${styles.input} ${
                        nomeProcuradorError ? styles.inputError : ""
                      }`}
                      placeholder="Nome completo do procurador"
                    />
                    {nomeProcuradorError && (
                      <p className={styles.fieldError}>
                        <WarningIcon
                          sx={{ fontSize: 16, marginRight: "4px" }}
                        />
                        {nomeProcuradorError}
                      </p>
                    )}
                  </div>

                  <div className={styles.gridThree}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        CPF <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        value={cpfProcurador}
                        onChange={(e) =>
                          handleCpfProcuradorChange(e.target.value)
                        }
                        className={`${styles.input} ${
                          cpfProcuradorError ? styles.inputError : ""
                        }`}
                        placeholder="000.000.000-00"
                      />
                      {cpfProcuradorError && (
                        <p className={styles.fieldError}>
                          <WarningIcon
                            sx={{ fontSize: 16, marginRight: "4px" }}
                          />
                          {cpfProcuradorError}
                        </p>
                      )}
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>RG</label>
                      <input
                        type="text"
                        value={rgProcurador}
                        onChange={(e) => {
                          const rgFormatado = e.target.value.replace(
                            /[^0-9a-zA-Z.\-\s]/g,
                            ""
                          );
                          setRgProcurador(rgFormatado);
                        }}
                        className={styles.input}
                        placeholder="00.000.000-0"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Órgão Emissor</label>
                      <input
                        type="text"
                        value={orgaoEmissorProcurador}
                        onChange={(e) =>
                          setOrgaoEmissorProcurador(e.target.value)
                        }
                        className={styles.input}
                        placeholder="Ex: SSP/SP"
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
                        value={telefoneProcurador}
                        onChange={(e) =>
                          handleTelefoneProcuradorChange(e.target.value)
                        }
                        className={`${styles.input} ${
                          telefoneProcuradorError ? styles.inputError : ""
                        }`}
                        placeholder="(00) 00000-0000"
                      />
                      {telefoneProcuradorError && (
                        <p className={styles.fieldError}>
                          <WarningIcon
                            sx={{ fontSize: 16, marginRight: "4px" }}
                          />
                          {telefoneProcuradorError}
                        </p>
                      )}
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        E-mail <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="email"
                        value={emailProcurador}
                        onChange={(e) =>
                          handleEmailProcuradorChange(e.target.value)
                        }
                        className={`${styles.input} ${
                          emailProcuradorError ? styles.inputError : ""
                        }`}
                        placeholder="email@exemplo.com"
                      />
                      {emailProcuradorError && (
                        <p className={styles.fieldError}>
                          <WarningIcon
                            sx={{ fontSize: 16, marginRight: "4px" }}
                          />
                          {emailProcuradorError}
                        </p>
                      )}
                    </div>
                  </div>

                  <h3 className={styles.subTitle}>Documentos do Procurador</h3>

                  <div className={styles.uploadGrid}>
                    <div className={styles.uploadField}>
                      <label className={styles.labelDoc}>
                        Procuração Autenticada{" "}
                        <span className={styles.required}>*</span>
                      </label>
                      <label className={styles.uploadButton}>
                        <CloudUploadIcon sx={{ marginRight: "8px" }} />
                        Anexar arquivo
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              if (validarTamanhoArquivo(file)) {
                                setDocProcuracao(file);
                              } else {
                                e.target.value = "";
                              }
                            }
                          }}
                          className={styles.fileInput}
                        />
                      </label>
                      {docProcuracao && (
                        <p className={styles.fileName}>{docProcuracao.name}</p>
                      )}
                    </div>

                    <div className={styles.uploadField}>
                      <label className={styles.labelDoc}>
                        CPF do Procurador{" "}
                        <span className={styles.required}>*</span>
                      </label>
                      <label className={styles.uploadButton}>
                        <CloudUploadIcon sx={{ marginRight: "8px" }} />
                        Anexar arquivo
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              if (validarTamanhoArquivo(file)) {
                                setDocCpfProcurador(file);
                              } else {
                                e.target.value = "";
                              }
                            }
                          }}
                          className={styles.fileInput}
                        />
                      </label>
                      {docCpfProcurador && (
                        <p className={styles.fileName}>
                          {docCpfProcurador.name}
                        </p>
                      )}
                    </div>

                    <div className={styles.uploadField}>
                      <label className={styles.labelDoc}>
                        Identidade do Procurador{" "}
                        <span className={styles.required}>*</span>
                      </label>
                      <label className={styles.uploadButton}>
                        <CloudUploadIcon sx={{ marginRight: "8px" }} />
                        Anexar arquivo
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              if (validarTamanhoArquivo(file)) {
                                setDocIdentidadeProcurador(file);
                              } else {
                                e.target.value = "";
                              }
                            }
                          }}
                          className={styles.fileInput}
                        />
                      </label>
                      {docIdentidadeProcurador && (
                        <p className={styles.fileName}>
                          {docIdentidadeProcurador.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

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

        {/* Seção 4 - Localização do Imóvel */}
        <section
          data-section="4"
          className={`${styles.section} ${
            activeSection === 4 ? styles.sectionActive : ""
          } ${completedSections.includes(4) ? styles.sectionCompleted : ""}`}
          style={{ opacity: activeSection >= 4 ? 1 : 0.5 }}
        >
          <div
            className={styles.sectionHeader}
            onClick={() => toggleSection(4)}
            style={{ cursor: "pointer" }}
          >
            <h2 className={styles.sectionTitle}>04. Identificação do Imóvel</h2>
            <div className={styles.sectionHeaderIcons}>
              {completedSections.includes(4) && (
                <CheckCircleIcon className={styles.checkIcon} />
              )}
              <ExpandMoreIcon
                className={`${styles.expandIcon} ${
                  expandedSections.includes(4) ? styles.expandIconOpen : ""
                }`}
              />
            </div>
          </div>

          {expandedSections.includes(4) && (
            <div
              className={styles.sectionContent}
              style={{ pointerEvents: activeSection >= 4 ? "auto" : "none" }}
            >
              <p className={styles.sectionDescription}>
                Preencha todos os dados do imóvel conforme solicitado abaixo.
              </p>

              <div className={styles.gridTwo}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Inscrição Imobiliária{" "}
                    <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    value={inscricaoImobiliaria}
                    onChange={(e) => handleInscricaoChange(e.target.value)}
                    className={`${styles.input} ${
                      inscricaoError ? styles.inputError : ""
                    }`}
                    placeholder="000000-0"
                  />
                  {inscricaoError && (
                    <p className={styles.fieldError}>
                      <WarningIcon sx={{ fontSize: 16, marginRight: "4px" }} />
                      {inscricaoError}
                    </p>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Inscrição Mercantil
                  </label>
                  <input
                    type="text"
                    value={inscricaoMercantil}
                    onChange={(e) => handleInscricaoMercantilChange(e.target.value)}
                    className={`${styles.input} ${
                      inscricaoMercantilError ? styles.inputError : ""
                    }`}
                    placeholder="000000"
                  />
                  {inscricaoMercantilError && (
                    <p className={styles.fieldError}>
                      <WarningIcon sx={{ fontSize: 16, marginRight: "4px" }} />
                      {inscricaoMercantilError}
                    </p>
                  )}
                </div>
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
                    className={`${styles.input} ${
                      cepError ? styles.inputError : ""
                    }`}
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
                    className={`${styles.input} ${
                      ruaError ? styles.inputError : ""
                    }`}
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
                    className={`${styles.input} ${
                      bairroError ? styles.inputError : ""
                    }`}
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
                    className={`${styles.input} ${
                      cidadeError ? styles.inputError : ""
                    }`}
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
                    className={`${styles.input} ${
                      estadoError ? styles.inputError : ""
                    }`}
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
                    className={`${styles.input} ${
                      numeroError ? styles.inputError : ""
                    }`}
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
                  <label className={styles.label}>Complemento</label>
                  <input
                    type="text"
                    value={complemento}
                    onChange={(e) => setComplemento(e.target.value)}
                    className={styles.input}
                    placeholder="Apto, Casa, etc."
                  />
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

        {/* Seção 5 - Documentação */}
        <section
          data-section="5"
          className={`${styles.section} ${
            activeSection === 5 ? styles.sectionActive : ""
          } ${completedSections.includes(5) ? styles.sectionCompleted : ""}`}
          style={{ opacity: activeSection >= 5 ? 1 : 0.5 }}
        >
          <div
            className={styles.sectionHeader}
            onClick={() => toggleSection(5)}
            style={{ cursor: "pointer" }}
          >
            <h2 className={styles.sectionTitle}>05. Documentação Necessária</h2>
            <div className={styles.sectionHeaderIcons}>
              {completedSections.includes(5) && (
                <CheckCircleIcon className={styles.checkIcon} />
              )}
              <ExpandMoreIcon
                className={`${styles.expandIcon} ${
                  expandedSections.includes(5) ? styles.expandIconOpen : ""
                }`}
              />
            </div>
          </div>

          {expandedSections.includes(5) && (
            <div
              className={styles.sectionContent}
              style={{ pointerEvents: activeSection >= 5 ? "auto" : "none" }}
            >
              <p className={styles.sectionDescription}>
                Anexe todos os documentos obrigatórios ao processo.
              </p>

              <div className={styles.uploadGrid}>
                {[
                  {
                    label: "Estatuto Social e alterações",
                    file: docEstatuto,
                    setFile: setDocEstatuto,
                  },
                  {
                    label: "Ata de Eleição da diretoria (atualizada)",
                    file: docAtaDiretoria,
                    setFile: setDocAtaDiretoria,
                  },
                  {
                    label: "Documento do imóvel (RGI ou Promessa de compra e venda)",
                    file: docImovel,
                    setFile: setDocImovel,
                  },
                  {
                    label: "Registro de IPTU do imóvel",
                    file: docIptu,
                    setFile: setDocIptu,
                  },
                  {
                    label: "Croqui de localização",
                    file: docCroqui,
                    setFile: setDocCroqui,
                  },
                  {
                    label: "Registro de cadastro mobiliário e imobiliário",
                    file: docCadastro,
                    setFile: setDocCadastro,
                  },
                  {
                    label: "Identificação do requerente (RG/CPF)",
                    file: docRgCpf,
                    setFile: setDocRgCpf,
                  },
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
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            if (validarTamanhoArquivo(file)) {
                              doc.setFile(file);
                            } else {
                              e.target.value = ""; // Limpa o input
                            }
                          }
                        }}
                        className={styles.fileInput}
                      />
                    </label>
                    {doc.file && (
                      <p className={styles.fileName}>{doc.file.name}</p>
                    )}
                  </div>
                ))}
              </div>

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

        {/* Seção 6 - Preferências de Comunicação */}
        <section
          data-section="6"
          className={`${styles.section} ${
            activeSection === 6 ? styles.sectionActive : ""
          } ${completedSections.includes(6) ? styles.sectionCompleted : ""}`}
          style={{ opacity: activeSection >= 6 ? 1 : 0.5 }}
        >
          <div
            className={styles.sectionHeader}
            onClick={() => toggleSection(6)}
            style={{ cursor: "pointer" }}
          >
            <h2 className={styles.sectionTitle}>
              06. Como deseja receber o nosso contato?
            </h2>
            <div className={styles.sectionHeaderIcons}>
              {completedSections.includes(6) && (
                <CheckCircleIcon className={styles.checkIcon} />
              )}
              <ExpandMoreIcon
                className={`${styles.expandIcon} ${
                  expandedSections.includes(6) ? styles.expandIconOpen : ""
                }`}
              />
            </div>
          </div>

          {expandedSections.includes(6) && (
            <div
              className={styles.sectionContent}
              style={{ pointerEvents: activeSection >= 6 ? "auto" : "none" }}
            >
              <p className={styles.sectionDescription}>
                Escolha a melhor forma para receber atualizações sobre seu
                processo. Selecione pelo menos 2 opções de notificação.
              </p>

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
                onClick={() => handleNextSection(6)}
                disabled={!isSectionValid(6)}
                className={styles.btnContinue}
              >
                Continuar
              </button>
            </div>
          )}
        </section>

        {/* Seção 7 - Finalização */}
        <section
          data-section="7"
          className={`${styles.section} ${
            activeSection === 7 ? styles.sectionActive : ""
          } ${completedSections.includes(7) ? styles.sectionCompleted : ""}`}
          style={{ opacity: activeSection >= 7 ? 1 : 0.5 }}
        >
          <div
            className={styles.sectionHeader}
            onClick={() => toggleSection(7)}
            style={{ cursor: "pointer" }}
          >
            <h2 className={styles.sectionTitle}>07. Observações Finais</h2>
            <div className={styles.sectionHeaderIcons}>
              {completedSections.includes(7) && (
                <CheckCircleIcon className={styles.checkIcon} />
              )}
              <ExpandMoreIcon
                className={`${styles.expandIcon} ${
                  expandedSections.includes(7) ? styles.expandIconOpen : ""
                }`}
              />
            </div>
          </div>

          {expandedSections.includes(7) && (
            <div
              className={styles.sectionContent}
              style={{ pointerEvents: activeSection >= 7 ? "auto" : "none" }}
            >
              <p className={styles.sectionDescription}>
                Inclua informações adicionais que possam ser relevantes para o
                seu processo.
              </p>

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
                <span className={styles.charCount}>
                  {observacoes.length}/1000 caracteres
                </span>
              </div>

              <div className={styles.alertBox}>
                <div className={styles.alertContent}>
                  <span className={styles.alertTitle}>
                    <WarningIcon sx={{ fontSize: 28, color: "#EB5F1A" }} />
                    ATENÇÃO:
                  </span>
                  <p>
                    A petição serve para detalhar, justificar ou formalizar o
                    seu pedido junto à Prefeitura. Caso deseje apresentar
                    argumentos, solicitações específicas ou documentos
                    complementares, anexe o arquivo PDF aqui.
                  </p>
                </div>
              </div>

              <div className={styles.uploadField}>
                <label className={styles.labelDoc}>
                  Petição (Opcional - PDF)
                </label>
                <label className={styles.uploadButton}>
                  <CloudUploadIcon sx={{ marginRight: "8px" }} />
                  Anexar arquivo
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        if (validarTamanhoArquivo(file)) {
                          setDocPeticao(file);
                        } else {
                          e.target.value = "";
                        }
                      }
                    }}
                    className={styles.fileInput}
                  />
                </label>
                {docPeticao && (
                  <p className={styles.fileName}>{docPeticao.name}</p>
                )}
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
                    A presente declaração é a expressão da verdade, estando o
                    declarante ciente de que em caso de falsidade comprovada ou
                    omissão com o fim de prejudicar, criar obrigação ou alterar
                    a verdade sobre o fato jurídico, estará incurso nas penas
                    previstas no Código Penal Brasileiro, bem como ficará
                    sujeito à multa e correção monetária conforme legislação
                    vigente. <span className={styles.required}>*</span>
                  </span>
                </label>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!isSectionValid(7)}
                className={styles.btnSubmit}
              >
                ENVIAR REQUERIMENTO
              </button>
            </div>
          )}
        </section>

        {/* Rodapé Informativo */}
        <div className={styles.infoFooter}>
          <div className={styles.infoHeader}>
            <h3 className={styles.infoTitle}>Informações Importantes</h3>
          </div>
          <div className={styles.infoCards}>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}>
                <AssignmentIcon sx={{ fontSize: 28, color: "#EB5F1A" }} />
              </div>
              <div className={styles.infoCardContent}>
                <h4 className={styles.infoCardTitle}>CNPJ Próprio</h4>
                <p className={styles.infoCardText}>
                  Se algum templo não tiver CNPJ individualizado, a prefeitura solicitará que a instituição providencie essa inscrição (§ 2º).
                </p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}>
                <AccessTimeIcon sx={{ fontSize: 28, color: "#EB5F1A" }} />
              </div>
              <div className={styles.infoCardContent}>
                <h4 className={styles.infoCardTitle}>
                  Inscrição Municipal (CAMOB)
                </h4>
                <p className={styles.infoCardText}>
                  Se o templo não tiver cadastro mobiliário, a Secretaria de Finanças fará essa inscrição de forma automática (“de ofício”) durante o processo (§ 1º).
                </p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}>
                <GavelIcon sx={{ fontSize: 28, color: "#EB5F1A" }} />
              </div>
              <div className={styles.infoCardContent}>
                <h4 className={styles.infoCardTitle}>Apenas para “Atividade Fim”</h4>
                <p className={styles.infoCardText}>
                  A isenção só vale para os imóveis (ou partes deles) utilizados efetivamente para as atividades religiosas. Prédios usados para fins comerciais pela igreja, por exemplo, podem não ser isentos (§ 3º).
                </p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}>
                <WarningIcon sx={{ fontSize: 28, color: "#EB5F1A" }} />
              </div>
              <div className={styles.infoCardContent}>
                <h4 className={styles.infoCardTitle}>Imunidade vs. Isenção</h4>
                <p className={styles.infoCardText}>
                  Embora o texto fale em “isenção”, templos de qualquer culto possuem imunidade tributária garantida pela Constituição Federal. O processo descrito no Art. 12 serve para que a prefeitura reconheça oficialmente esse direito e pare de gerar as cobranças.
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>
      <Footer />

      <LoadingModal isOpen={isLoadingModalOpen} estimatedTime={5} />

      {/* ToastContainer para exibir notificações */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Botão flutuante para gerar dados aleatórios */}
      {activeSection >= 1 && (
        <button
          onClick={preencherDadosAleatorios}
          className={styles.btnGerarDados}
          title="Gerar dados aleatórios para teste"
        >
          🎲 Gerar Dados
        </button>
      )}
    </div>
  );
}
