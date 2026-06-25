# CardioPredict - Sistema de Predição de Doença Cardíaca

Sistema completo para avaliação de risco de doença cardíaca utilizando machine learning, desenvolvido no âmbito do PIBIC (Programa Institucional de Bolsas de Iniciação Científica).

## Visão Geral

O CardioPredict combina uma API REST com modelos de machine learning para prever o risco de doença cardíaca a partir de dados clínicos de pacientes. O sistema permite cadastrar pacientes, realizar previsões, gerar relatórios e acompanhar métricas de desempenho dos modelos.

### Funcionalidades

- **Previsão de Risco**: Algoritmo de ML para predição de doença cardíaca
- **CRUD de Pacientes**: Cadastro e gerenciamento de dados de pacientes
- **Relatórios**: Geração e exportação de relatórios médicos
- **Dashboard**: Visualização de estatísticas e métricas
- **Modelos de ML**: KNN, SVM, Random Forest e Ensemble

## Arquitetura

```
pibic/
├── apps/
│   ├── web/          # Frontend React
│   └── server/       # Backend FastAPI + ML
├── design/           # Arquivos de design (Penpot)
└── docs/             # Documentação
```

## Stack Tecnológica

### Backend (`apps/server`)

| Componente | Tecnologia |
|------------|------------|
| Framework | FastAPI |
| ML | scikit-learn, imbalanced-learn |
| Banco de Dados | SQLite + SQLAlchemy |
| Validação | Pydantic |
| Servidor | Uvicorn |

### Frontend (`apps/web`)

| Componente | Tecnologia |
|------------|------------|
| UI | React 19 + TypeScript 6 |
| Build | Vite 8 |
| Roteamento | TanStack Router |
| State | TanStack React Query 5 |
| Estilo | Tailwind CSS 4 |
| HTTP | Axios |
| Validação | Zod 4 |

## Pré-requisitos

- **Node.js** >= 18
- **Python** >= 3.12
- **uv** (gerenciador de pacotes Python)

### Instalação do uv

```bash
# Linux/macOS
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

## Instalação

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd <nome-do-repositorio>
```

### 2. Instalar dependências

```bash
# Instalar dependências do monorepo
npm install

# Instalar dependências do backend
cd apps/server
uv sync
cd ../..
```

### 3. Configurar variáveis de ambiente

```bash
# Frontend
cp apps/web/.env.example apps/web/.env
```

Edite `apps/web/.env` conforme necessário:

```env
VITE_API_URL=http://localhost:8000
```

## Como Rodar

### Backend

```bash
# Acessar diretório do servidor
cd apps/server

# Treinar os modelos (primeira vez)
uv run python -m services.train_models

# Iniciar o servidor
uv run python run.py
```

A API estará disponível em: **http://localhost:8000**

### Frontend

```bash
# Acessar diretório do web
cd apps/web

# Iniciar servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em: **http://localhost:5173**

### Ambos simultaneamente

```bash
# Na raiz do projeto
npm run dev
```

## Endpoints da API

### Documentação

| Interface | URL |
|-----------|-----|
| Scalar | http://localhost:8000/scalar |
| Swagger | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |

### Rotas Principais

#### Pacientes

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/pacientes` | Lista todos os pacientes |
| POST | `/pacientes` | Cria um paciente |
| GET | `/pacientes/{id}` | Busca paciente por ID |
| PUT | `/pacientes/{id}` | Atualiza paciente |
| DELETE | `/pacientes/{id}` | Remove paciente |

#### Previsão

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/prever` | Realiza previsão de risco |

#### Modelos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/modelos` | Lista modelos disponíveis |
| GET | `/modelos/{nome}/metricas` | Métricas do modelo |

#### Relatórios

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/relatorios` | Lista relatórios |
| POST | `/relatorios` | Cria relatório |
| GET | `/relatorios/{id}` | Busca relatório por ID |

#### Dashboard

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/dashboard/stats` | Estatísticas gerais |

## Modelos de Machine Learning

O sistema utiliza 4 modelos para previsão:

| Modelo | Descrição |
|--------|-----------|
| KNN | K-Nearest Neighbors |
| SVM | Support Vector Machine |
| Random Forest | Floresta Aleatória |
| Ensemble | Combinação dos modelos anteriores |

### Métricas

| Métrica | Descrição |
|---------|-----------|
| Acurácia | Percentual de acertos |
| Precisão | Verdadeiros positivos / Preditos positivos |
| Recall | Verdadeiros positivos / Positivos reais |
| F1-Score | Média harmônica entre precisão e recall |
| AUC-ROC | Capacidade de distinção entre classes |

### Re-treinar Modelos

```bash
cd apps/server
PYTHONPATH=src uv run python -m services.train_models
```

## Campos do Paciente

| Campo | Tipo | Descrição | Valores |
|-------|------|-----------|---------|
| age | int | Idade | Anos |
| sex | int | Sexo | 1 = masculino, 0 = feminino |
| cp | int | Tipo de dor no peito | 1-4 |
| trestbps | int | Pressão arterial em repouso | mm Hg |
| chol | int | Colesterol | mg/dl |
| fbs | int | Glicemia em jejum > 120 | 1 = sim, 0 = não |
| restecg | int | Eletrocardiograma em repouso | 0-2 |
| thalach | int | Frequência cardíaca máxima | bpm |
| exang | int | Angina induzida por exercício | 1 = sim, 0 = não |
| oldpeak | float | Depressão do segmento ST | Valores positivos |
| slope | int | Inclinação do segmento ST | 1-3 |
| ca | int | Nº de vasos principais coloridos | 0-3 |
| thal | int | Talassemia | 3, 6 ou 7 |

## Estrutura do Banco de Dados

O sistema utiliza SQLite com as seguintes tabelas:

| Tabela | Descrição |
|--------|-----------|
| `pacientes` | Dados cadastrais dos pacientes |
| `avaliacoes` | Resultados de previsões |
| `relatorios` | Relatórios médicos |
| `model_metricas` | Métricas de desempenho dos modelos |

Localização: `apps/server/src/database/cardiopredict.db`

## Comandos Úteis

```bash
# Instalar dependências
npm install

# Rodar backend e frontend
npm run dev

# Rodar apenas o frontend
npm run dev:web

# Rodar apenas o backend
npm run dev:api

# Treinar modelos de ML
npm run train

# Gerar client de API (frontend)
cd apps/web && npm run generate:api

# Build de produção (frontend)
cd apps/web && npm run build

# Preview da build (frontend)
cd apps/web && npm run preview

# Lint (frontend)
cd apps/web && npm run lint

# Database (Alembic)
npm run db:revision   # Gerar nova revisão
npm run db:migrate    # Aplicar migrações
npm run db:downgrade  # Reverter última migração
npm run db:current    # Ver revisão atual
npm run db:history    # Histórico de revisões
```

## Estrutura de Pastas

```
pibic/
├── apps/
│   ├── web/                    # Frontend React
│   │   ├── src/
│   │   │   ├── components/     # Componentes React
│   │   │   ├── routes/         # Rotas (TanStack Router)
│   │   │   ├── generated/      # Código gerado pelo Orval
│   │   │   └── lib/            # Utilitários
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── server/                 # Backend FastAPI
│       ├── src/
│       │   ├── api/            # Rotas da API
│       │   ├── database/       # Configuração do banco
│       │   ├── machine_learning/ # Modelos de ML
│       │   ├── models/         # Modelos ORM
│       │   ├── schemas/        # Schemas Pydantic
│       │   ├── services/       # Lógica de negócio
│       │   └── artifacts/      # Modelos treinados (.pkl)
│       ├── notebooks/          # Jupyter notebooks
│       └── pyproject.toml
│
├── design/                     # Arquivos de design
├── docs/                       # Documentação
└── package.json                # Configuração do monorepo
```

## Considerações

- Este projeto é **acadêmico/educacional**
- Não deve ser utilizado para diagnóstico médico real
- Os modelos são treinados com o dataset UCI Heart Disease

## Licença

Projeto PIBIC - Programa Institucional de Bolsas de Iniciação Científica.
