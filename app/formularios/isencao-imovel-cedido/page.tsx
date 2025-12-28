"use client";

import React, { useState } from "react";
import Image from "next/image";
import { gerarDadosAleatorios } from "@/utils/gerarDadosAleatorios";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ComprovanteTaxa from "@/components/ComprovanteTaxa/ComprovanteTaxa";
import styles from "./page.module.css";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WarningIcon from "@mui/icons-material/Warning";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GavelIcon from "@mui/icons-material/Gavel";
import SendIcon from "@mui/icons-material/Send";
import UpdateIcon from "@mui/icons-material/Update";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function IsencaoImovelCedidoPage() {
  // Estado para controlar qual seção está ativa
  const [activeSection, setActiveSection] = useState(1);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [expandedSections, setExpandedSections] = useState<number[]>([]); // Seção 1 começa fechada
  const [inquilinoExpanded, setInquilinoExpanded] = useState(true); // Controla expansão da subseção do inquilino (começa expandida)

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
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [lote, setLote] = useState("");
  const [quadra, setQuadra] = useState("");

  // Dados do inquilino
  const [nomeInquilino, setNomeInquilino] = useState("");
  const [cpfInquilino, setCpfInquilino] = useState("");
  const [rgInquilino, setRgInquilino] = useState("");
  const [orgaoEmissorInquilino, setOrgaoEmissorInquilino] = useState("");
  const [telefoneInquilino, setTelefoneInquilino] = useState("");
  const [emailInquilino, setEmailInquilino] = useState("");

  // Estados de validação e erro da Seção 3
  const [inscricaoError, setInscricaoError] = useState("");
  const [cepError, setCepError] = useState("");
  const [ruaError, setRuaError] = useState("");
  const [numeroError, setNumeroError] = useState("");
  const [bairroError, setBairroError] = useState("");
  const [cidadeError, setCidadeError] = useState("");
  const [estadoError, setEstadoError] = useState("");
  const [nomeInquilinoError, setNomeInquilinoError] = useState("");
  const [cpfInquilinoError, setCpfInquilinoError] = useState("");
  const [telefoneInquilinoError, setTelefoneInquilinoError] = useState("");
  const [emailInquilinoError, setEmailInquilinoError] = useState("");

  // Estados da Seção 4 - Documentos
  const [docFichaIptu, setDocFichaIptu] = useState<File | null>(null);
  const [docRgCpf, setDocRgCpf] = useState<File | null>(null);
  const [docPropriedade, setDocPropriedade] = useState<File | null>(null);
  const [docContrato, setDocContrato] = useState<File | null>(null);
  const [docPublicidade, setDocPublicidade] = useState<File | null>(null);
  const [docCertidaoDebitos, setDocCertidaoDebitos] = useState<File | null>(
    null
  );

  // Estados da Seção 5 - Representação
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

  // Estados de validação e erro da Seção 5
  const [nomeProcuradorError, setNomeProcuradorError] = useState("");
  const [cpfProcuradorError, setCpfProcuradorError] = useState("");
  const [telefoneProcuradorError, setTelefoneProcuradorError] = useState("");
  const [emailProcuradorError, setEmailProcuradorError] = useState("");

  // Estados da Seção 6 - Assinatura a Rogo
  const [assinaturaRogo, setAssinaturaRogo] = useState(false);
  const [testemunha1Nome, setTestemunha1Nome] = useState("");
  const [testemunha1Cpf, setTestemunha1Cpf] = useState("");
  const [testemunha1Rg, setTestemunha1Rg] = useState("");
  const [testemunha1OrgaoEmissor, setTestemunha1OrgaoEmissor] = useState("");
  const [testemunha1Telefone, setTestemunha1Telefone] = useState("");
  const [testemunha1Email, setTestemunha1Email] = useState("");
  const [testemunha2Nome, setTestemunha2Nome] = useState("");
  const [testemunha2Cpf, setTestemunha2Cpf] = useState("");
  const [testemunha2Rg, setTestemunha2Rg] = useState("");
  const [testemunha2OrgaoEmissor, setTestemunha2OrgaoEmissor] = useState("");
  const [testemunha2Telefone, setTestemunha2Telefone] = useState("");
  const [testemunha2Email, setTestemunha2Email] = useState("");

  // Estados de validação e erro da Seção 6
  const [testemunha1NomeError, setTestemunha1NomeError] = useState("");
  const [testemunha1CpfError, setTestemunha1CpfError] = useState("");
  const [testemunha1TelefoneError, setTestemunha1TelefoneError] = useState("");
  const [testemunha1EmailError, setTestemunha1EmailError] = useState("");
  const [testemunha2NomeError, setTestemunha2NomeError] = useState("");
  const [testemunha2CpfError, setTestemunha2CpfError] = useState("");
  const [testemunha2TelefoneError, setTestemunha2TelefoneError] = useState("");
  const [testemunha2EmailError, setTestemunha2EmailError] = useState("");

  // Estados da Seção 7 - Preferências de Comunicação
  const [preferenciaAR, setPreferenciaAR] = useState(false);
  const [preferenciaWhatsapp, setPreferenciaWhatsapp] = useState(false);
  const [preferenciaEmail, setPreferenciaEmail] = useState(false);

  // Estados da Seção 8 - Finalização
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
    const digitoVerificador1 = resto >= 10 ? 0 : resto;

    if (digitoVerificador1 !== parseInt(numeros.charAt(9))) return false;

    // Valida segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(numeros.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    const digitoVerificador2 = resto >= 10 ? 0 : resto;

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

  // Handlers para campos do inquilino
  const handleNomeInquilinoChange = (valor: string) => {
    const nomeFormatado = valor.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, "");
    setNomeInquilino(nomeFormatado);

    if (nomeFormatado.trim().length === 0) {
      setNomeInquilinoError("Por favor, insira o nome do inquilino");
    } else if (!validarNome(nomeFormatado)) {
      setNomeInquilinoError("Nome deve conter apenas letras");
    } else if (nomeFormatado.trim().length < 3) {
      setNomeInquilinoError("Nome deve ter pelo menos 3 caracteres");
    } else {
      setNomeInquilinoError("");
    }
  };

  const handleCpfInquilinoChange = (valor: string) => {
    const cpfFormatado = formatarCPF(valor);
    setCpfInquilino(cpfFormatado);

    const numeros = cpfFormatado.replace(/\D/g, "");
    if (numeros.length === 0) {
      setCpfInquilinoError("Por favor, insira o CPF do inquilino");
    } else if (numeros.length === 11) {
      if (!validarCPF(cpfFormatado)) {
        setCpfInquilinoError("CPF inválido");
      } else {
        setCpfInquilinoError("");
      }
    } else {
      setCpfInquilinoError("CPF incompleto");
    }
  };

  const handleTelefoneInquilinoChange = (valor: string) => {
    const telefoneFormatado = formatarTelefone(valor);
    setTelefoneInquilino(telefoneFormatado);

    const numeros = telefoneFormatado.replace(/\D/g, "");
    if (numeros.length === 0) {
      setTelefoneInquilinoError("");
    } else if (numeros.length < 10) {
      setTelefoneInquilinoError("Telefone incompleto");
    } else if (numeros.length === 10 || numeros.length === 11) {
      setTelefoneInquilinoError("");
    }
  };

  const handleEmailInquilinoChange = (valor: string) => {
    setEmailInquilino(valor.trim().toLowerCase());

    if (valor.trim().length === 0) {
      setEmailInquilinoError("");
    } else if (!validarEmail(valor.trim())) {
      if (!valor.includes("@")) {
        setEmailInquilinoError("Email deve conter @");
      } else if (valor.split("@")[1] && !valor.split("@")[1].includes(".")) {
        setEmailInquilinoError("Email deve conter um domínio válido");
      } else if (valor.includes("..")) {
        setEmailInquilinoError("Email não pode conter pontos consecutivos");
      } else if (valor.split("@").length > 2) {
        setEmailInquilinoError("Email deve conter apenas um @");
      } else {
        setEmailInquilinoError("Email inválido");
      }
    } else {
      setEmailInquilinoError("");
    }
  };

  // Handlers para campos do procurador
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
  const handleTestemunha1NomeChange = (valor: string) => {
    const nomeFormatado = valor.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, "");
    setTestemunha1Nome(nomeFormatado);

    if (nomeFormatado.trim().length === 0) {
      setTestemunha1NomeError("Por favor, insira o nome da testemunha");
    } else if (!validarNome(nomeFormatado)) {
      setTestemunha1NomeError("Nome deve conter apenas letras");
    } else if (nomeFormatado.trim().length < 3) {
      setTestemunha1NomeError("Nome deve ter pelo menos 3 caracteres");
    } else {
      setTestemunha1NomeError("");
    }
  };

  const handleTestemunha1CpfChange = (valor: string) => {
    const cpfFormatado = formatarCPF(valor);
    setTestemunha1Cpf(cpfFormatado);

    const numeros = cpfFormatado.replace(/\D/g, "");
    if (numeros.length === 0) {
      setTestemunha1CpfError("Por favor, insira o CPF da testemunha");
    } else if (numeros.length === 11) {
      if (!validarCPF(cpfFormatado)) {
        setTestemunha1CpfError("CPF inválido");
      } else {
        setTestemunha1CpfError("");
      }
    } else {
      setTestemunha1CpfError("CPF incompleto");
    }
  };

  const handleTestemunha1TelefoneChange = (valor: string) => {
    const telefoneFormatado = formatarTelefone(valor);
    setTestemunha1Telefone(telefoneFormatado);

    const numeros = telefoneFormatado.replace(/\D/g, "");
    if (numeros.length === 0) {
      setTestemunha1TelefoneError("Por favor, insira o telefone da testemunha");
    } else if (numeros.length < 10) {
      setTestemunha1TelefoneError("Telefone incompleto");
    } else if (numeros.length === 10 || numeros.length === 11) {
      setTestemunha1TelefoneError("");
    }
  };

  const handleTestemunha1EmailChange = (valor: string) => {
    setTestemunha1Email(valor.trim().toLowerCase());

    if (valor.trim().length === 0) {
      setTestemunha1EmailError("Por favor, insira o email da testemunha");
    } else if (!validarEmail(valor.trim())) {
      if (!valor.includes("@")) {
        setTestemunha1EmailError("Email deve conter @");
      } else if (valor.split("@")[1] && !valor.split("@")[1].includes(".")) {
        setTestemunha1EmailError("Email deve conter um domínio válido");
      } else if (valor.includes("..")) {
        setTestemunha1EmailError("Email não pode conter pontos consecutivos");
      } else if (valor.split("@").length > 2) {
        setTestemunha1EmailError("Email deve conter apenas um @");
      } else {
        setTestemunha1EmailError("Email inválido");
      }
    } else {
      setTestemunha1EmailError("");
    }
  };

  const handleTestemunha2NomeChange = (valor: string) => {
    const nomeFormatado = valor.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, "");
    setTestemunha2Nome(nomeFormatado);

    if (nomeFormatado.trim().length === 0) {
      setTestemunha2NomeError("Por favor, insira o nome da testemunha");
    } else if (!validarNome(nomeFormatado)) {
      setTestemunha2NomeError("Nome deve conter apenas letras");
    } else if (nomeFormatado.trim().length < 3) {
      setTestemunha2NomeError("Nome deve ter pelo menos 3 caracteres");
    } else {
      setTestemunha2NomeError("");
    }
  };

  const handleTestemunha2CpfChange = (valor: string) => {
    const cpfFormatado = formatarCPF(valor);
    setTestemunha2Cpf(cpfFormatado);

    const numeros = cpfFormatado.replace(/\D/g, "");
    if (numeros.length === 0) {
      setTestemunha2CpfError("Por favor, insira o CPF da testemunha");
    } else if (numeros.length === 11) {
      if (!validarCPF(cpfFormatado)) {
        setTestemunha2CpfError("CPF inválido");
      } else {
        setTestemunha2CpfError("");
      }
    } else {
      setTestemunha2CpfError("CPF incompleto");
    }
  };

  const handleTestemunha2TelefoneChange = (valor: string) => {
    const telefoneFormatado = formatarTelefone(valor);
    setTestemunha2Telefone(telefoneFormatado);

    const numeros = telefoneFormatado.replace(/\D/g, "");
    if (numeros.length === 0) {
      setTestemunha2TelefoneError("Por favor, insira o telefone da testemunha");
    } else if (numeros.length < 10) {
      setTestemunha2TelefoneError("Telefone incompleto");
    } else if (numeros.length === 10 || numeros.length === 11) {
      setTestemunha2TelefoneError("");
    }
  };

  const handleTestemunha2EmailChange = (valor: string) => {
    setTestemunha2Email(valor.trim().toLowerCase());

    if (valor.trim().length === 0) {
      setTestemunha2EmailError("Por favor, insira o email da testemunha");
    } else if (!validarEmail(valor.trim())) {
      if (!valor.includes("@")) {
        setTestemunha2EmailError("Email deve conter @");
      } else if (valor.split("@")[1] && !valor.split("@")[1].includes(".")) {
        setTestemunha2EmailError("Email deve conter um domínio válido");
      } else if (valor.includes("..")) {
        setTestemunha2EmailError("Email não pode conter pontos consecutivos");
      } else if (valor.split("@").length > 2) {
        setTestemunha2EmailError("Email deve conter apenas um @");
      } else {
        setTestemunha2EmailError("Email inválido");
      }
    } else {
      setTestemunha2EmailError("");
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
      case 3: // Localização e Inquilino
        const imovelValid =
          inscricaoImobiliaria &&
          cep &&
          rua &&
          numero &&
          bairro &&
          cidade &&
          estado;
        const noImovelErrors =
          !inscricaoError &&
          !cepError &&
          !ruaError &&
          !numeroError &&
          !bairroError &&
          !cidadeError &&
          !estadoError;
        const inquilinoValid =
          nomeInquilino && cpfInquilino && telefoneInquilino && emailInquilino;
        const noInquilinoErrors =
          !nomeInquilinoError &&
          !cpfInquilinoError &&
          !telefoneInquilinoError &&
          !emailInquilinoError;
        return !!(
          imovelValid &&
          noImovelErrors &&
          inquilinoValid &&
          noInquilinoErrors
        );
      case 4: // Documentos
        return !!(
          docFichaIptu &&
          docRgCpf &&
          docPropriedade &&
          docContrato &&
          docPublicidade &&
          docCertidaoDebitos
        );
      case 5: // Representação
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
      case 6: // Assinatura a Rogo
        if (assinaturaRogo) {
          const testemunha1Valid =
            testemunha1Nome &&
            testemunha1Cpf &&
            testemunha1Telefone &&
            testemunha1Email;
          const testemunha2Valid =
            testemunha2Nome &&
            testemunha2Cpf &&
            testemunha2Telefone &&
            testemunha2Email;
          const noTestemunha1Errors =
            !testemunha1NomeError &&
            !testemunha1CpfError &&
            !testemunha1TelefoneError &&
            !testemunha1EmailError;
          const noTestemunha2Errors =
            !testemunha2NomeError &&
            !testemunha2CpfError &&
            !testemunha2TelefoneError &&
            !testemunha2EmailError;
          return !!(
            testemunha1Valid &&
            testemunha2Valid &&
            noTestemunha1Errors &&
            noTestemunha2Errors
          );
        }
        return true;
      case 7: // Preferências
        const selectedCount = [
          preferenciaAR,
          preferenciaWhatsapp,
          preferenciaEmail,
        ].filter(Boolean).length;
        return selectedCount >= 2;
      case 8: // Finalização
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

  const handleSubmit = () => {
    if (isSectionValid(8)) {
      console.log("Formulário enviado com sucesso!");
      toast.success(
        "Requerimento enviado com sucesso! Em breve você receberá um e-mail de confirmação.",
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
          setOrgaoEmissorProcurador("SSP/SP");
          setTelefoneProcurador(dados.procurador.telefone);
          setEmailProcurador(dados.procurador.email);
          setDocProcuracao(dados.procurador.documentos?.[0] || null);
          setDocCpfProcurador(dados.procurador.documentos?.[1] || null);
          setDocIdentidadeProcurador(dados.procurador.documentos?.[2] || null);
        }
        break;
      case 4:
        setInscricaoImobiliaria("1234567-8");
        setCep("01001-000");
        setRua("Avenida Paulista");
        setNumero("1000");
        setComplemento("Sala 500");
        setBairro("Bela Vista");
        setCidade("São Paulo");
        setEstado("SP");
        setLote("15");
        setQuadra("B");
        setInscricaoError("");
        setCepError("");
        setRuaError("");
        setNumeroError("");
        setBairroError("");
        setCidadeError("");
        setEstadoError("");
        // Dados do inquilino
        const inquilinoData = gerarDadosAleatorios({});
        setNomeInquilino(inquilinoData.nome);
        setCpfInquilino(inquilinoData.cpf);
        setRgInquilino(inquilinoData.rg);
        setOrgaoEmissorInquilino("SSP/SP");
        setTelefoneInquilino(inquilinoData.telefone);
        setEmailInquilino(inquilinoData.email);
        setNomeInquilinoError("");
        setCpfInquilinoError("");
        setTelefoneInquilinoError("");
        setEmailInquilinoError("");
        break;
      case 5:
        setDocFichaIptu(dados.documentos?.[0] || null);
        setDocRgCpf(dados.documentos?.[1] || null);
        setDocPropriedade(dados.documentos?.[0] || null);
        setDocContrato(dados.documentos?.[1] || null);
        setDocPublicidade(dados.documentos?.[0] || null);
        setDocCertidaoDebitos(dados.documentos?.[1] || null);
        break;
      case 6:
        setAssinaturaRogo(true);
        if (dados.procurador) {
          setNomeProcurador(dados.procurador.nome);
          setCpfProcurador(dados.procurador.cpf);
          setRgProcurador(dados.procurador.rg);
          setOrgaoEmissorProcurador("SSP/SP");
          setTelefoneProcurador(dados.procurador.telefone);
          setEmailProcurador(dados.procurador.email);
          setDocProcuracao(dados.procurador.documentos?.[0] || null);
          setDocCpfProcurador(dados.procurador.documentos?.[1] || null);
          setDocIdentidadeProcurador(dados.procurador.documentos?.[2] || null);
        }
        break;
      case 6:
        setAssinaturaRogo(true);
        // Testemunha 1
        const testemunha1Data = gerarDadosAleatorios({});
        setTestemunha1Nome(testemunha1Data.nome);
        setTestemunha1Cpf(testemunha1Data.cpf);
        setTestemunha1Rg(testemunha1Data.rg);
        setTestemunha1OrgaoEmissor("SSP/RJ");
        setTestemunha1Telefone(testemunha1Data.telefone);
        setTestemunha1Email(testemunha1Data.email);
        setTestemunha1NomeError("");
        setTestemunha1CpfError("");
        setTestemunha1TelefoneError("");
        setTestemunha1EmailError("");
        // Testemunha 2
        const testemunha2Data = gerarDadosAleatorios({});
        setTestemunha2Nome(testemunha2Data.nome);
        setTestemunha2Cpf(testemunha2Data.cpf);
        setTestemunha2Rg(testemunha2Data.rg);
        setTestemunha2OrgaoEmissor("SSP/SP");
        setTestemunha2Telefone(testemunha2Data.telefone);
        setTestemunha2Email(testemunha2Data.email);
        setTestemunha2NomeError("");
        setTestemunha2CpfError("");
        setTestemunha2TelefoneError("");
        setTestemunha2EmailError("");
        break;
      case 7:
        setPreferenciaAR(true);
        setPreferenciaWhatsapp(true);
        setPreferenciaEmail(false);
        break;
      case 8:
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
        icon={<AccountBalanceIcon sx={{ fontSize: 56, color: "#EB5F1A" }} />}
        processType="ISENÇÃO"
        title="Imóvel Locado a Órgão Público"
        description="Imóvel alugado ou cedido à Administração Pública Municipal."
      />
      <main className={styles.main}>
        {/* Seção de Explicação - Nova */}
        <section className={styles.explanationSection}>
          <div className={styles.explanationContent}>
            <div className={styles.explanationImageContainer}>
              {/* Imagem para Desktop (Vertical) */}
              <Image
                src="/assets/imovel-locado/imovel.webp"
                alt="Imóvel Cedido"
                width={300}
                height={300}
                className={`${styles.explanationImage} ${styles.explanationImageDesktop}`}
                priority
              />
              {/* Imagem para Mobile (Horizontal) */}
              <Image
                src="/assets/imovel-locado/imovel-mobile.webp"
                alt="Imóvel Cedido"
                width={800}
                height={400}
                className={`${styles.explanationImage} ${styles.explanationImageMobile}`}
                priority
              />
            </div>
            <div className={styles.explanationTextContainer}>
              <h2 className={styles.explanationTitle}>
                Isenção de IPTU para Imóvel Locado ou Cedido à Administração Pública
              </h2>
              <div className={styles.explanationText}>
                <p>
                  <strong>Quem tem direito?</strong> Proprietários de imóvel cedido gratuitamente para uso de entidade beneficente, assistencial ou cultural sem fins lucrativos, devidamente registrada.
                </p>
                <p>
                  <strong>O que você precisa saber:</strong>
                </p>
                <ul>
                  <li>O imóvel deve ser cedido gratuitamente</li>
                  <li>A entidade deve ser sem fins lucrativos</li>
                  <li>A entidade deve estar devidamente registrada</li>
                  <li>Deve haver contrato de cessão ou comodato registrado</li>
                </ul>
                <p>
                  <strong>Documentos necessários:</strong> Contrato de cessão ou comodato, documentos da entidade beneficiária, certidão de matrícula do imóvel, RG, CPF e outros documentos que serão solicitados ao longo do formulário.
                </p>
                <div className={styles.explanationAlert}>
                  <WarningIcon sx={{ fontSize: 24, color: "#EB5F1A" }} />
                  <span>
                    Este requerimento tem validade enquanto perdurar a cessão do imóvel.
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
              Solicitar Isenção
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
                Preencha com os dados do proprietário do imóvel cedido.
              </p>

              <div className={styles.alertBox}>
                <div className={styles.alertContent}>
                  <span className={styles.alertTitle}>
                    <WarningIcon sx={{ fontSize: 28, color: "#EB5F1A" }} />
                    ATENÇÃO:
                  </span>
                  <p>
                    O responsável pelo envio do requerimento deve ser o CPL ou a
                    Secretaria/Órgão contratante, não o proprietário do imóvel.
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
                  placeholder="Digite o nome completo"
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
                    RG <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    value={rg}
                    onChange={(e) => {
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

        {/* Seção 4 - Informações do Imóvel e Inquilino */}
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
            <h2 className={styles.sectionTitle}>
              04. Identificação do Imóvel
            </h2>
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
                Preencha todos os dados do imóvel cedido conforme solicitado
                abaixo.
              </p>

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
                    placeholder="Apto, Sala, etc."
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

              {/* Informações do Inquilino */}
              <div className={styles.inquilinoSection}>
                <h3 
                  className={styles.subTitle} 
                  onClick={() => setInquilinoExpanded(!inquilinoExpanded)}
                  style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  <span>Informações do Inquilino/Responsável pelo Imóvel</span>
                  <ExpandMoreIcon
                    style={{
                      transition: "transform 0.3s ease",
                      transform: inquilinoExpanded ? "rotate(180deg)" : "rotate(0deg)"
                    }}
                  />
                </h3>

                {inquilinoExpanded && (
                  <>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Nome Completo <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    value={nomeInquilino}
                    onChange={(e) => handleNomeInquilinoChange(e.target.value)}
                    className={`${styles.input} ${
                      nomeInquilinoError ? styles.inputError : ""
                    }`}
                    placeholder="Nome completo do inquilino"
                  />
                  {nomeInquilinoError && (
                    <p className={styles.fieldError}>
                      <WarningIcon sx={{ fontSize: 16, marginRight: "4px" }} />
                      {nomeInquilinoError}
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
                      value={cpfInquilino}
                      onChange={(e) => handleCpfInquilinoChange(e.target.value)}
                      className={`${styles.input} ${
                        cpfInquilinoError ? styles.inputError : ""
                      }`}
                      placeholder="000.000.000-00"
                    />
                    {cpfInquilinoError && (
                      <p className={styles.fieldError}>
                        <WarningIcon
                          sx={{ fontSize: 16, marginRight: "4px" }}
                        />
                        {cpfInquilinoError}
                      </p>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>RG</label>
                    <input
                      type="text"
                      value={rgInquilino}
                      onChange={(e) => {
                        const rgFormatado = e.target.value.replace(
                          /[^0-9a-zA-Z.\-\s]/g,
                          ""
                        );
                        setRgInquilino(rgFormatado);
                      }}
                      className={styles.input}
                      placeholder="00.000.000-0"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Órgão Emissor</label>
                    <input
                      type="text"
                      value={orgaoEmissorInquilino}
                      onChange={(e) => setOrgaoEmissorInquilino(e.target.value)}
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
                      value={telefoneInquilino}
                      onChange={(e) =>
                        handleTelefoneInquilinoChange(e.target.value)
                      }
                      className={`${styles.input} ${
                        telefoneInquilinoError ? styles.inputError : ""
                      }`}
                      placeholder="(00) 00000-0000"
                    />
                    {telefoneInquilinoError && (
                      <p className={styles.fieldError}>
                        <WarningIcon
                          sx={{ fontSize: 16, marginRight: "4px" }}
                        />
                        {telefoneInquilinoError}
                      </p>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      E-mail <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="email"
                      value={emailInquilino}
                      onChange={(e) =>
                        handleEmailInquilinoChange(e.target.value)
                      }
                      className={`${styles.input} ${
                        emailInquilinoError ? styles.inputError : ""
                      }`}
                      placeholder="email@exemplo.com"
                    />
                    {emailInquilinoError && (
                      <p className={styles.fieldError}>
                        <WarningIcon
                          sx={{ fontSize: 16, marginRight: "4px" }}
                        />
                        {emailInquilinoError}
                      </p>
                    )}
                  </div>
                </div>
                </>
                )}
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
                    label: "Ficha de Lançamento do IPTU",
                    file: docFichaIptu,
                    setFile: setDocFichaIptu,
                  },
                  {
                    label: "Documentos Pessoais (RG e CPF)",
                    file: docRgCpf,
                    setFile: setDocRgCpf,
                  },
                  {
                    label: "Comprovante de Propriedade",
                    file: docPropriedade,
                    setFile: setDocPropriedade,
                  },
                  {
                    label: "Instrumento Contratual",
                    file: docContrato,
                    setFile: setDocContrato,
                  },
                  {
                    label: "Comprovante de Publicidade (D.O.M.)",
                    file: docPublicidade,
                    setFile: setDocPublicidade,
                  },
                  {
                    label: "Certidão Negativa de Débitos",
                    file: docCertidaoDebitos,
                    setFile: setDocCertidaoDebitos,
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
                              e.target.value = "";
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

        {/* Seção 3 - Representação/Procurador */}
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
              03. Informações do Procurador
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

        {/* Seção 4 - Informações do Imóvel e Inquilino */}
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
            <h2 className={styles.sectionTitle}>
              07. Testemunhas (Assinatura a Rogo)
            </h2>
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
              <p className={styles.helperText}>
                Exclusivo para requerentes analfabetos ou impossibilitados de
                assinar
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
                <p className={styles.helperText} style={{ marginTop: "12px", marginBottom: "16px" }}>
                  <strong>Atenção:</strong> São obrigatoriamente necessárias 2 (duas) testemunhas.
                </p>
              )}

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
                        onChange={(e) =>
                          handleTestemunha1NomeChange(e.target.value)
                        }
                        className={`${styles.input} ${
                          testemunha1NomeError ? styles.inputError : ""
                        }`}
                        placeholder="Nome da testemunha"
                      />
                      {testemunha1NomeError && (
                        <p className={styles.fieldError}>
                          <WarningIcon
                            sx={{ fontSize: 16, marginRight: "4px" }}
                          />
                          {testemunha1NomeError}
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
                          value={testemunha1Cpf}
                          onChange={(e) =>
                            handleTestemunha1CpfChange(e.target.value)
                          }
                          className={`${styles.input} ${
                            testemunha1CpfError ? styles.inputError : ""
                          }`}
                          placeholder="000.000.000-00"
                        />
                        {testemunha1CpfError && (
                          <p className={styles.fieldError}>
                            <WarningIcon
                              sx={{ fontSize: 16, marginRight: "4px" }}
                            />
                            {testemunha1CpfError}
                          </p>
                        )}
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>RG</label>
                        <input
                          type="text"
                          value={testemunha1Rg}
                          onChange={(e) => {
                            const rgFormatado = e.target.value.replace(
                              /[^0-9a-zA-Z.\-\s]/g,
                              ""
                            );
                            setTestemunha1Rg(rgFormatado);
                          }}
                          className={styles.input}
                          placeholder="00.000.000-0"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Órgão Emissor</label>
                        <input
                          type="text"
                          value={testemunha1OrgaoEmissor}
                          onChange={(e) =>
                            setTestemunha1OrgaoEmissor(e.target.value)
                          }
                          className={styles.input}
                          placeholder="Ex: SSP/RJ"
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
                          value={testemunha1Telefone}
                          onChange={(e) =>
                            handleTestemunha1TelefoneChange(e.target.value)
                          }
                          className={`${styles.input} ${
                            testemunha1TelefoneError ? styles.inputError : ""
                          }`}
                          placeholder="(00) 00000-0000"
                        />
                        {testemunha1TelefoneError && (
                          <p className={styles.fieldError}>
                            <WarningIcon
                              sx={{ fontSize: 16, marginRight: "4px" }}
                            />
                            {testemunha1TelefoneError}
                          </p>
                        )}
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          E-mail <span className={styles.required}>*</span>
                        </label>
                        <input
                          type="email"
                          value={testemunha1Email}
                          onChange={(e) =>
                            handleTestemunha1EmailChange(e.target.value)
                          }
                          className={`${styles.input} ${
                            testemunha1EmailError ? styles.inputError : ""
                          }`}
                          placeholder="email@exemplo.com"
                        />
                        {testemunha1EmailError && (
                          <p className={styles.fieldError}>
                            <WarningIcon
                              sx={{ fontSize: 16, marginRight: "4px" }}
                            />
                            {testemunha1EmailError}
                          </p>
                        )}
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
                        onChange={(e) =>
                          handleTestemunha2NomeChange(e.target.value)
                        }
                        className={`${styles.input} ${
                          testemunha2NomeError ? styles.inputError : ""
                        }`}
                        placeholder="Nome da testemunha"
                      />
                      {testemunha2NomeError && (
                        <p className={styles.fieldError}>
                          <WarningIcon
                            sx={{ fontSize: 16, marginRight: "4px" }}
                          />
                          {testemunha2NomeError}
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
                          value={testemunha2Cpf}
                          onChange={(e) =>
                            handleTestemunha2CpfChange(e.target.value)
                          }
                          className={`${styles.input} ${
                            testemunha2CpfError ? styles.inputError : ""
                          }`}
                          placeholder="000.000.000-00"
                        />
                        {testemunha2CpfError && (
                          <p className={styles.fieldError}>
                            <WarningIcon
                              sx={{ fontSize: 16, marginRight: "4px" }}
                            />
                            {testemunha2CpfError}
                          </p>
                        )}
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>RG</label>
                        <input
                          type="text"
                          value={testemunha2Rg}
                          onChange={(e) => {
                            const rgFormatado = e.target.value.replace(
                              /[^0-9a-zA-Z.\-\s]/g,
                              ""
                            );
                            setTestemunha2Rg(rgFormatado);
                          }}
                          className={styles.input}
                          placeholder="00.000.000-0"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Órgão Emissor</label>
                        <input
                          type="text"
                          value={testemunha2OrgaoEmissor}
                          onChange={(e) =>
                            setTestemunha2OrgaoEmissor(e.target.value)
                          }
                          className={styles.input}
                          placeholder="Ex: SSP/RJ"
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
                          value={testemunha2Telefone}
                          onChange={(e) =>
                            handleTestemunha2TelefoneChange(e.target.value)
                          }
                          className={`${styles.input} ${
                            testemunha2TelefoneError ? styles.inputError : ""
                          }`}
                          placeholder="(00) 00000-0000"
                        />
                        {testemunha2TelefoneError && (
                          <p className={styles.fieldError}>
                            <WarningIcon
                              sx={{ fontSize: 16, marginRight: "4px" }}
                            />
                            {testemunha2TelefoneError}
                          </p>
                        )}
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          E-mail <span className={styles.required}>*</span>
                        </label>
                        <input
                          type="email"
                          value={testemunha2Email}
                          onChange={(e) =>
                            handleTestemunha2EmailChange(e.target.value)
                          }
                          className={`${styles.input} ${
                            testemunha2EmailError ? styles.inputError : ""
                          }`}
                          placeholder="email@exemplo.com"
                        />
                        {testemunha2EmailError && (
                          <p className={styles.fieldError}>
                            <WarningIcon
                              sx={{ fontSize: 16, marginRight: "4px" }}
                            />
                            {testemunha2EmailError}
                          </p>
                        )}
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
          className={`${styles.section} ${
            activeSection === 8 ? styles.sectionActive : ""
          } ${completedSections.includes(8) ? styles.sectionCompleted : ""}`}
          style={{ opacity: activeSection >= 8 ? 1 : 0.5 }}
        >
          <div
            className={styles.sectionHeader}
            onClick={() => toggleSection(8)}
            style={{ cursor: "pointer" }}
          >
            <h2 className={styles.sectionTitle}>
              08. Como deseja receber o nosso contato?
            </h2>
            <div className={styles.sectionHeaderIcons}>
              {completedSections.includes(8) && (
                <CheckCircleIcon className={styles.checkIcon} />
              )}
              <ExpandMoreIcon
                className={`${styles.expandIcon} ${
                  expandedSections.includes(8) ? styles.expandIconOpen : ""
                }`}
              />
            </div>
          </div>

          {expandedSections.includes(8) && (
            <div
              className={styles.sectionContent}
              style={{ pointerEvents: activeSection >= 8 ? "auto" : "none" }}
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
                  AR (Aviso de Recebimento)
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
          className={`${styles.section} ${
            activeSection === 9 ? styles.sectionActive : ""
          } ${completedSections.includes(9) ? styles.sectionCompleted : ""}`}
          style={{ opacity: activeSection >= 9 ? 1 : 0.5 }}
        >
          <div
            className={styles.sectionHeader}
            onClick={() => toggleSection(9)}
            style={{ cursor: "pointer" }}
          >
            <h2 className={styles.sectionTitle}>09. Observações Finais</h2>
            <div className={styles.sectionHeaderIcons}>
              {completedSections.includes(9) && (
                <CheckCircleIcon className={styles.checkIcon} />
              )}
              <ExpandMoreIcon
                className={`${styles.expandIcon} ${
                  expandedSections.includes(9) ? styles.expandIconOpen : ""
                }`}
              />
            </div>
          </div>

          {expandedSections.includes(9) && (
            <div
              className={styles.sectionContent}
              style={{ pointerEvents: activeSection >= 9 ? "auto" : "none" }}
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
          <div className={styles.infoHeader}>
            <h3 className={styles.infoTitle}>Informações Importantes</h3>
          </div>
          <div className={styles.infoCards}>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}>
                <SendIcon sx={{ fontSize: 28, color: "#EB5F1A" }} />
              </div>
              <div className={styles.infoCardContent}>
                <h4 className={styles.infoCardTitle}>Quem Deve Enviar</h4>
                <p className={styles.infoCardText}>
                  A responsabilidade do envio é da{" "}
                  <strong>CPL ou Secretaria/Órgão</strong> contratante, não do
                  proprietário.
                </p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}>
                <AccessTimeIcon sx={{ fontSize: 28, color: "#EB5F1A" }} />
              </div>
              <div className={styles.infoCardContent}>
                <h4 className={styles.infoCardTitle}>Prazo de Envio</h4>
                <p className={styles.infoCardText}>
                  Em <strong>até 30 dias</strong> contados da publicação do
                  extrato do contrato.
                </p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}>
                <WarningIcon sx={{ fontSize: 28, color: "#EB5F1A" }} />
              </div>
              <div className={styles.infoCardContent}>
                <h4 className={styles.infoCardTitle}>Pendências Fiscais</h4>
                <p className={styles.infoCardText}>
                  Proprietário notificado tem <strong>30 dias</strong> para
                  regularizar débitos sob risco de indeferimento (§ 2º).
                </p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}>
                <AssignmentIcon sx={{ fontSize: 28, color: "#EB5F1A" }} />
              </div>
              <div className={styles.infoCardContent}>
                <h4 className={styles.infoCardTitle}>Prazos de Análise</h4>
                <p className={styles.infoCardText}>
                  A Secretaria de Finanças tem <strong>até 90 dias</strong> para
                  reconhecer o benefício (§ 1º e § 3º).
                </p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}>
                <UpdateIcon sx={{ fontSize: 28, color: "#EB5F1A" }} />
              </div>
              <div className={styles.infoCardContent}>
                <h4 className={styles.infoCardTitle}>Renovações</h4>
                <p className={styles.infoCardText}>
                  Processo deve ser <strong>repetido</strong> em casos de
                  aditamento ou renovação contratual (§ 4º).
                </p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}>
                <GavelIcon sx={{ fontSize: 28, color: "#EB5F1A" }} />
              </div>
              <div className={styles.infoCardContent}>
                <h4 className={styles.infoCardTitle}>Base Legal</h4>
                <p className={styles.infoCardText}>
                  Pedido condicionado aos prazos e requisitos do{" "}
                  <strong>Decreto Municipal vigente</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>
      <Footer />

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
