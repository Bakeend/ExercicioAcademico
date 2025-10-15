# 🏫 Sistema Escolar - Gerenciamento de Boletins

Sistema desenvolvido em **TypeScript** para **gerenciamento de alunos**, **cálculo de médias** e **geração automática de boletins escolares**.

---

## 👥 Integrantes do Grupo

- Claudio Vinicius (RA: 2510639)
- Bruno Rigone (RA: 2503268)
---

## ⚙️ Funcionalidades

- Cadastro de alunos (nome e série)  
- Controle de faltas e frequência  
- Coleta de **8 notas por matéria**  
- Cálculo automático das médias  
- Verificação de **aprovação ou reprovação**  
- Geração de **boletim em arquivo `.txt`**  
- Armazenamento dos registros em **arquivo `.csv`**  
- Interface interativa via **terminal**

---

## 🧮 Critérios de Aprovação

| Critério | Exigência |
|-----------|------------|
| **Frequência mínima** | 75% |
| **Nota mínima por matéria** | 7.0 |
| **Matérias** | Matemática, Português, Geografia, História, Química |

---

## 🚀 Como Executar

### 🔧 Pré-requisitos

- **Node.js** (versão 14 ou superior)  
- **npm**

---

### 📥 Instalação

```bash
git clone [url-do-repositorio]
cd sistema-escolar
npm install
```

---

### ▶️ Execução

```bash
npm run dev
```

---

### 💡 Scripts Disponíveis

| Script | Função |
|--------|--------|
| `npm run dev` | Executa em modo desenvolvimento |
| `npm run build` | Compila o TypeScript |
| `npm start` | Executa a versão compilada |

---

## 📁 Estrutura do Projeto

```
sistema-escolar/
├── src/
│   └── index.ts
├── dist/
├── boletim_*.txt
├── alunos.csv
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🧑‍💻 Exemplo de Uso

1. Execute o programa:

```bash
npm run dev
```

2. No menu, selecione **"Cadastrar novo aluno"**  
3. Informe:
   - Nome do aluno  
   - Série  
   - Número de faltas  
   - 8 notas para cada matéria  

---

## 📄 Arquivos Gerados

### 📝 Boletim TXT

```
BOLETIM ESCOLAR
================

Aluno: João Silva
Série: 8º Ano
Faltas: 10
Frequência: 90.0%

NOTAS POR MATÉRIA:
==================
MATEMÁTICA:
  Notas: 8.0, 7.5, 9.0, 8.5, 7.0, 8.0, 9.5, 8.0
  Média: 8.2 ✓
...
```

---

### 📊 Arquivo CSV

```csv
Nome,Série,Faltas,Aprovado,Motivo,MediaMatematica,MediaPortugues,MediaGeografia,MediaHistoria,MediaQuimica
"João Silva","8º Ano",10,Sim,"Aprovado em todas as matérias e frequência adequada",8.2,7.8,8.5,7.9,8.1
```

---

## 🧠 Tecnologias Utilizadas

- **TypeScript**  
- **Node.js**  
- **File System (fs)**  
- **Readline**

