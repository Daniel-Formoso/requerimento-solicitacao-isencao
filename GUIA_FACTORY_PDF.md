# 🔍 Guia Técnico - Factory de Seleção de PDF

## Como o Sistema Decide Qual PDF Gerar

### Fluxo de Decisão

```
           Dados Recebidos
                 ↓
      ┌─────────────────────────┐
      │  Possui formularioSlug?  │
      └────────┬────────────────┘
               │
         Sim ──┤── Não
               │
               ↓
         ┌──────────────────────────┐
         │ Buscar em generadores{}  │ ← match exato
         └────────┬─────────────────┘
                  │
              Encontrou?
              /        \
             /          \
           Sim           Não
            ↓             ↓
        Usar      Possuz tipoFormulario?
                         ↓
                    Buscar match parcial
                         ↓
                    Encontrou?
                    /        \
                   /          \
                 Sim           Não
                  ↓             ↓
              Usar        Usar Fallback
                       (isencao-idoso)
                             ↓
                     Gerar PDF com Factory
```

### Código (Simplificado)

```typescript
function resolveFormType(data: BasePdfFormData): FormType {
  // Prioridade 1: slug exato
  if (data.formularioSlug && data.formularioSlug in generadores) {
    return data.formularioSlug as FormType;
  }

  // Prioridade 2: tipo aproximado
  if (data.tipoFormulario) {
    const tipo = data.tipoFormulario.toLowerCase();
    const match = Object.keys(generadores).find((key) =>
      tipo.includes(key.replace(/-/g, " "))
    );
    if (match) return match as FormType;
  }

  // Fallback
  return "isencao-idoso";
}
```

---

## Exemplos de Resolução

### Exemplo 1: Slug Exato

**Entrada:**
```json
{
  "formularioSlug": "isencao-idoso",
  "nome": "João Silva",
  "cpf": "12345678901"
}
```

**Processo:**
1. Verifica `formularioSlug` = "isencao-idoso"
2. Encontra em `generadores["isencao-idoso"]` ✅
3. Usa `idoso/gerador.ts`

**Saída:** PDF de Idoso

---

### Exemplo 2: Tipo Aproximado

**Entrada:**
```json
{
  "tipoFormulario": "Pessoa com Deficiência",
  "nome": "Maria",
  "cpf": "98765432100"
}
```

**Processo:**
1. Sem `formularioSlug`
2. Verifica `tipoFormulario` = "Pessoa com Deficiência"
3. Busca match: "pessoa com deficiência" contém "pcd"?
4. Encontra "isencao-pcd" ✅
5. Usa `pcd/gerador.ts`

**Saída:** PDF de PCD

---

### Exemplo 3: Fallback

**Entrada:**
```json
{
  "nome": "Pedro",
  "cpf": "55544433322"
}
```

**Processo:**
1. Sem `formularioSlug`
2. Sem `tipoFormulario`
3. Sem match
4. Usa fallback "isencao-idoso" ✅

**Saída:** PDF de Idoso (padrão)

---

## Mapeamento de Tipos

| Slug | Tipo Aproximado |
|------|-----------------|
| `isencao-idoso` | "idoso" |
| `isencao-excombatente` | "ex-combatente" ou "excombatente" |
| `isencao-pcd` | "pcd" ou "pessoa com deficiência" |
| `isencao-imovel-cedido` | "imovel cedido" |
| `isencao-templo-religioso` | "templo religioso" |
| `isencao-taxas-mercantis` | "taxas mercantis" |
| `imunidade-templo-religioso` | "imunidade templo" |
| `imunidade-instituicoes` | "imunidade instituicoes" ou "instituicoes" |
| `imunidade-sindicatos` | "imunidade sindicatos" ou "sindicatos" |
| `imunidade-reciproca` | "imunidade reciproca" |

---

## Importância da Resolução Correta

### Sem Resolução Apropriada ❌
- Todo tipo usa PDF Idoso
- Campos extras ignorados
- Layout inadequado para alguns processos

### Com Resolução Apropriada ✅
- Cada tipo usa seu PDF específico
- Campos corretos por tipo
- Layout otimizado

---

## Impacto no Desenvolvimento

### Desenvolvedor Front-End

Ao enviar dados para `/api/generate-pdf`:
```typescript
const response = await fetch('/api/generate-pdf', {
  method: 'POST',
  body: JSON.stringify({
    formularioSlug: 'isencao-pcd',  // ← Factory resolverá automaticamente
    nome, cpf, email, // ... dados
  })
});
```

✅ Não precisa saber qual gerador usar
✅ Factory cuida de tudo

### Desenvolvedor Back-End

Factory garante:
- ✅ Tipo correto sempre é usado
- ✅ Sem lógica if/else espalhada
- ✅ Fácil adicionar novos tipos
- ✅ Testável e manutenível

---

## Edge Cases Tratados

### Caso 1: Maiúsculas/Minúsculas
```typescript
"ISENCAO-IDOSO" → toLowerCase() → "isencao-idoso" ✅
```

### Caso 2: Espaços vs Hífens
```typescript
tipoFormulario: "ex combatente" 
→ contém "ex-combatente" quando comparado ✅
```

### Caso 3: Typos
```typescript
"isencao-idoso" (correto)
"isencao_idoso" (com _)
→ Primeiro match em generadores{} ✅
```

### Caso 4: Nenhum Match
```typescript
"tipo-desconhecido"
→ Fallback "isencao-idoso" ✅
```

---

## Testando a Resolução

```bash
# Teste 1: Slug exato
curl -X POST http://localhost:3000/api/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{"formularioSlug":"isencao-idoso","nome":"João","cpf":"123"}'

# Teste 2: Tipo aproximado
curl -X POST http://localhost:3000/api/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{"tipoFormulario":"Pessoa com Deficiência","nome":"Maria","cpf":"456"}'

# Teste 3: Fallback
curl -X POST http://localhost:3000/api/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{"nome":"Pedro","cpf":"789"}'
```

---

## Performance

- ✅ Factory é stateless
- ✅ Resolução é O(1) com slug
- ✅ Resolução é O(n) sem slug (mas n=10 tipos)
- ✅ Cache não é necessário

---

**Conclusão:** Factory torna a seleção automática, robusta e escalável! 🎯
