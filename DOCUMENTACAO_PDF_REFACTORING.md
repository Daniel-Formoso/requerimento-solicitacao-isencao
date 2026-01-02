# 📋 Documentação - Reestruturação de Geração de PDFs

## 🎯 Objetivo Atingido

Refatoração completa do sistema de geração de PDFs para **eliminar o gerador genérico** e implementar um **gerador específico para cada tipo de processo**, com estrutura escalável, centralizada e visualmente consistente.

---

## 📁 Estrutura Criada

```
utils/
├── pdf/                                  # Nova pasta centralizada
│   ├── index.ts                          # Exports centralizados
│   ├── pdfFactory.ts                     # Factory: lógica de seleção
│   │
│   ├── base/
│   │   ├── styles.ts                     # CSS base compartilhado
│   │   ├── helpers.ts                    # Funções utilitárias
│   │   └── types.ts                      # Interfaces base
│   │
│   ├── idoso/
│   │   └── gerador.ts                    # Gerador: Isenção Idoso
│   │
│   ├── excombatente/
│   │   └── gerador.ts                    # Gerador: Isenção Ex-combatente
│   │
│   ├── pcd/
│   │   └── gerador.ts                    # Gerador: Isenção PCD
│   │
│   ├── imovelcedido/
│   │   └── gerador.ts                    # Gerador: Isenção Imóvel Cedido
│   │
│   ├── temploligioso/
│   │   └── gerador.ts                    # Gerador: Isenção Templo Religioso
│   │
│   ├── taxasmercantis/
│   │   └── gerador.ts                    # Gerador: Isenção Taxas Mercantis
│   │
│   └── imunidade/
│       └── gerador.ts                    # Gerador: Todas as Imunidades
│
├── generatePdfIdoso.ts                   # ⚠️ COMPATIBILIDADE (re-exporta)
└── generatePdfGeneric.ts                 # ❌ REMOVIDO
```

---

## 🔑 Componentes Principais

### 1. **Base Compartilhada** (`utils/pdf/base/`)

#### `styles.ts`
- CSS centralizado usado por todos os PDFs
- Mantém identidade visual consistente
- Facilita atualizações globais
- Exemplo: cores, tipografia, margens

#### `helpers.ts`
- Funções utilitárias compartilhadas:
  - `formatValue()` - Formata valores ou retorna "-"
  - `formatarEstadoCivil()` - Mapeia estado civil
  - `formatarOrigemRenda()` - Mapeia origem de renda
  - `getLogoBASE64()` - Carrega logo em BASE64
  - `sanitizeFileName()` - Limpa nomes de arquivo

#### `types.ts`
- `BasePdfFormData` - Interface base para todos os formulários
- Campos compartilhados (nome, CPF, endereço, etc.)
- Estende-se em interfaces específicas

### 2. **Geradores Específicos**

Cada tipo de processo tem seu próprio gerador com:
- Interface de dados específica (estende `BasePdfFormData`)
- Função para gerar PDF (`generatePdf[Tipo]()`)
- Função para gerar nome de arquivo (`get[Tipo]FileName()`)

**Exemplos:**

- `idoso/gerador.ts` - Isenção Idoso (com testemunhas, cônjuge)
- `pcd/gerador.ts` - Isenção PCD (sem alguns campos)
- `imunidade/gerador.ts` - Todos os tipos de imunidade (genérico)

### 3. **Factory Centralizado** (`pdfFactory.ts`)

**Responsabilidades:**
- Resolve qual gerador usar baseado nos dados
- Executa a geração de PDF correta
- Retorna nome de arquivo apropriado
- Escalável: fácil adicionar novos tipos

**Fluxo:**
```
Dados → resolveFormType() → pdfFactory → Gerador Específico → PDF
```

**Resolução por prioridade:**
1. `data.formularioSlug` - Slug exato do formulário
2. `data.tipoFormulario` - Tipo genérico
3. Fallback: "isencao-idoso"

### 4. **Compatibilidade** (`generatePdfIdoso.ts`)

Arquivo de compatibilidade que re-exporta:
```typescript
export { generatePdfIdoso as generateRequerimentoPdf } from "./pdf/idoso/gerador";
```

Garante que código antigo continue funcionando.

---

## 🔄 Fluxo de Funcionamento

### Antes (Genérico)
```
Dados → generatePdfGeneric() → HTML Genérico → PDF único
```
❌ Problema: Todos os tipos usam mesmo layout

### Depois (Específico)
```
Dados → pdfFactory → resolve tipo → Gerador Específico → HTML Customizado → PDF próprio
```
✅ Solução: Cada tipo tem seu layout

---

## 📊 Tipos de Processo Suportados

| Slug | Descrição | Gerador |
|------|-----------|---------|
| `isencao-idoso` | Isenção de IPTU - Idoso | `idoso/gerador.ts` |
| `isencao-excombatente` | Isenção de IPTU - Ex-combatente | `excombatente/gerador.ts` |
| `isencao-pcd` | Isenção de IPTU - PCD | `pcd/gerador.ts` |
| `isencao-imovel-cedido` | Isenção de IPTU - Imóvel Cedido | `imovelcedido/gerador.ts` |
| `isencao-templo-religioso` | Isenção de IPTU - Templo Religioso | `temploligioso/gerador.ts` |
| `isencao-taxas-mercantis` | Isenção - Taxas Mercantis | `taxasmercantis/gerador.ts` |
| `imunidade-templo-religioso` | Imunidade - Templo Religioso | `imunidade/gerador.ts` |
| `imunidade-instituicoes` | Imunidade - Instituições Sem Fins Lucrativos | `imunidade/gerador.ts` |
| `imunidade-sindicatos` | Imunidade - Sindicatos | `imunidade/gerador.ts` |
| `imunidade-reciproca` | Imunidade Recíproca | `imunidade/gerador.ts` |

---

## 🔗 Atualizações no Sistema

### Rota de Geração de PDF (`app/api/generate-pdf/route.ts`)

**Antes:**
```typescript
import { generateRequerimentoPdf, IdosoFormData } from "@/utils/generatePdfIdoso";

const data: IdosoFormData = await req.json();
const pdfBuffer = await generateRequerimentoPdf(data);
const nomeArquivo = `Requerimento_Idoso_${nomeLimpo}.pdf`;
```

**Depois:**
```typescript
import { generatePdf, getPdfFileName } from "@/utils/pdf/pdfFactory";
import { BasePdfFormData } from "@/utils/pdf/base/types";

const data: BasePdfFormData = await req.json();
const pdfBuffer = await generatePdf(data);           // Usa factory
const nomeArquivo = await getPdfFileName(data);      // Nome específico
```

✅ Benefício: Automático para todos os tipos, sem if/else

---

## 🎨 Padrão Visual (Mantido)

Todos os PDFs seguem a identidade visual do PDF do Idoso:
- Logo da prefeitura no topo
- Cabeçalho com 3 linhas de título
- Seções com fundo azul (#2b2862)
- Grid 2 colunas para campos
- Declaração de concordância no fim
- Rodapé com data/hora

---

## ➕ Como Adicionar um Novo Tipo de Processo

### Passo 1: Criar Pasta e Interface

```bash
mkdir utils/pdf/novoTipo
```

### Passo 2: Criar Gerador

```typescript
// utils/pdf/novoTipo/gerador.ts
import { BasePdfFormData } from "../base/types";
import { generatePdfGenerico, getGenericoFileName } from "../imovelcedido/gerador";

export interface NovoTipoFormData extends BasePdfFormData {
  // Campos específicos deste tipo
  campoEspecifico?: string;
}

export async function generatePdfNovoTipo(data: NovoTipoFormData): Promise<Buffer> {
  return generatePdfGenerico(data, "Requerimento Digital - Novo Tipo");
}

export async function getNovoTipoFileName(data: NovoTipoFormData): Promise<string> {
  return getGenericoFileName(data, "Requerimento_NovoTipo");
}
```

### Passo 3: Registrar no Factory

```typescript
// utils/pdf/pdfFactory.ts
import { generatePdfNovoTipo, getNovoTipoFileName } from "./novoTipo/gerador";

const generadores: Record<FormType, PdfGeneratorConfig> = {
  // ... tipos existentes
  "novo-tipo": {
    generador: generatePdfNovoTipo,
    getNomeArquivo: getNovoTipoFileName,
  },
};
```

### Passo 4: Usar Normalmente

```typescript
const pdfBuffer = await generatePdf({ 
  formularioSlug: "novo-tipo",
  nome: "João",
  cpf: "12345678901",
  // ... outros dados
});
```

---

## ✅ Checklist de Implementação

- ✅ Estrutura de pastas criada
- ✅ CSS base centralizado
- ✅ Helpers compartilhados
- ✅ Interfaces base
- ✅ Gerador Idoso (com testemunhas)
- ✅ Gerador Ex-combatente
- ✅ Gerador PCD
- ✅ Gerador Imóvel Cedido
- ✅ Gerador Templo Religioso
- ✅ Gerador Taxas Mercantis
- ✅ Gerador Imunidades (genérico)
- ✅ Factory centralizado
- ✅ Rota generate-pdf atualizada
- ✅ Compatibilidade mantida
- ✅ Gerador genérico removido

---

## 🚀 Benefícios Alcançados

### Qualidade
- ✅ Layout consistente entre PDFs
- ✅ Campos específicos por tipo
- ✅ Sem duplicação de código CSS
- ✅ Identidade visual unificada

### Manutenibilidade
- ✅ CSS em um único lugar
- ✅ Fácil atualizar visual de todos os PDFs
- ✅ Helpers centralizados
- ✅ Código organizado por tipo

### Escalabilidade
- ✅ Adicionar novo tipo é simples
- ✅ Sem lógica espalhada em if/else
- ✅ Factory gerencia tudo automaticamente
- ✅ Tipos TypeScript garantem segurança

### Compatibilidade
- ✅ Código antigo continua funcionando
- ✅ Re-exportações mantêm imports existentes
- ✅ Sem breaking changes

---

## 📌 Próximos Passos (Opcional)

1. **Testes**: Gerar PDFs de cada tipo e validar
2. **Personalização**: Cada gerador pode ter CSS sobrescrito
3. **Campos extras**: Facilmente adicionáveis à interface
4. **Validação**: Adicionar validação específica por tipo

---

## 📞 Dúvidas Frequentes

**P: E se um tipo de processo não tiver gerador específico?**  
R: Factory usa fallback "isencao-idoso". Crie um gerador próprio quando necessário.

**P: Como alterar o logo que aparece no PDF?**  
R: O logo vem de `public/assets/brasao-vertical.png`. Substitua o arquivo.

**P: Posso usar a rota antiga `generateRequerimentoPdf`?**  
R: Sim! `utils/generatePdfIdoso.ts` mantém compatibilidade re-exportando.

**P: Como adiciono um campo novo só para um tipo?**  
R: Estenda a interface: `interface IdosoFormData extends BasePdfFormData { novo?: string; }`

---

## 📂 Arquivos Removidos

- ❌ `utils/generatePdfGeneric.ts` - Não é mais necessário

## 📂 Arquivos Modificados

- 📝 `utils/generatePdfIdoso.ts` - Agora apenas compatibilidade
- 📝 `app/api/generate-pdf/route.ts` - Usa factory

## 📂 Arquivos Criados

- 📄 `utils/pdf/index.ts`
- 📄 `utils/pdf/pdfFactory.ts`
- 📄 `utils/pdf/base/styles.ts`
- 📄 `utils/pdf/base/helpers.ts`
- 📄 `utils/pdf/base/types.ts`
- 📄 `utils/pdf/idoso/gerador.ts`
- 📄 `utils/pdf/excombatente/gerador.ts`
- 📄 `utils/pdf/pcd/gerador.ts`
- 📄 `utils/pdf/imovelcedido/gerador.ts`
- 📄 `utils/pdf/temploligioso/gerador.ts`
- 📄 `utils/pdf/taxasmercantis/gerador.ts`
- 📄 `utils/pdf/imunidade/gerador.ts`

---

**Implementação concluída com sucesso! 🎉**
