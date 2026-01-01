// Função utilitária para gerar dados aleatórios para formulários de isenção
// Pode ser expandida para outros formulários além do idoso

export type DadosAleatoriosOptions = {
  incluirDocumentos?: boolean;
  incluirConjuge?: boolean;
  incluirProcurador?: boolean;
  incluirTaxas?: boolean;
};

function gerarCPF() {
  let cpf = '';
  for (let i = 0; i < 11; i++) {
    cpf += Math.floor(Math.random() * 10);
  }
  return cpf;
}

function gerarRG() {
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let rg = '';
  for (let i = 0; i < 2; i++) rg += letras[Math.floor(Math.random() * letras.length)];
  for (let i = 0; i < 7; i++) rg += Math.floor(Math.random() * 10);
  return rg;
}

function gerarNome() {
  const nomes = ['João', 'Maria', 'José', 'Ana', 'Carlos', 'Paula', 'Lucas', 'Fernanda'];
  const sobrenomes = ['Silva', 'Souza', 'Oliveira', 'Santos', 'Lima', 'Ferreira', 'Costa'];
  return `${nomes[Math.floor(Math.random() * nomes.length)]} ${sobrenomes[Math.floor(Math.random() * sobrenomes.length)]}`;
}

function gerarEmail(nome: string) {
  return nome.toLowerCase().replace(/ /g, '.') + '@exemplo.com';
}

function gerarTelefone() {
  return `(${Math.floor(Math.random() * 90 + 10)}) 9${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}`;
}

function gerarDataAleatoria(anoInicio = 1940, anoFim = 2005) {
  const ano = Math.floor(Math.random() * (anoFim - anoInicio + 1)) + anoInicio;
  const mes = Math.floor(Math.random() * 12) + 1;
  const dia = Math.floor(Math.random() * 28) + 1;
  return `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}

function gerarArquivoPDF(nome = 'documento.pdf') {
  const blob = new Blob(['PDF de teste'], { type: 'application/pdf' });
  return new File([blob], nome, { type: 'application/pdf' });
}

export function gerarDadosAleatorios(options: DadosAleatoriosOptions = {}) {
  const nome = gerarNome();
  const dados: any = {
    nome,
    cpf: gerarCPF(),
    rg: gerarRG(),
    dataNascimento: gerarDataAleatoria(1940, 1965),
    email: gerarEmail(nome),
    telefone: gerarTelefone(),
    ...options.incluirTaxas && {
      guiaTaxa: gerarArquivoPDF('guia_pagamento.pdf'),
      comprovanteTaxa: gerarArquivoPDF('comprovante_pagamento.pdf'),
    },
    // Array de documentos anexados (nomes dos documentos)
    documentosAnexados: [
      'Certidão de Nascimento/Casamento',
      'Comprovante de pagamento das taxas',
      'RG e CPF',
      'Comprovante de residência',
      'Comprovante de rendimentos',
      'Escritura do imóvel',
      'Declaração de único imóvel',
      'Ficha de inscrição do IPTU',
      ...(options.incluirProcurador ? [
        'Procuração Autenticada',
        'CPF do Procurador',
        'Identidade do Procurador',
      ] : []),
      'Petição',
    ],
    ...options.incluirDocumentos && {
      documentos: [
        gerarArquivoPDF('doc1.pdf'),
        gerarArquivoPDF('doc2.pdf'),
      ],
    },
    ...options.incluirConjuge && {
      conjuge: {
        nome: gerarNome(),
        cpf: gerarCPF(),
        rg: gerarRG(),
        dataNascimento: gerarDataAleatoria(1940, 1980),
        email: gerarEmail(gerarNome()),
        telefone: gerarTelefone(),
      },
    },
    ...options.incluirProcurador && {
      procurador: {
        nome: gerarNome(),
        cpf: gerarCPF(),
        rg: gerarRG(),
        email: gerarEmail(gerarNome()),
        telefone: gerarTelefone(),
        documentos: [
          gerarArquivoPDF('proc1.pdf'),
          gerarArquivoPDF('proc2.pdf'),
          gerarArquivoPDF('proc3.pdf'),
        ],
      },
    },
  };
  return dados;
}
