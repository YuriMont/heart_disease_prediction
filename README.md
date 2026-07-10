# CardioPredict — Predição de Doença Cardíaca

Sistema completo para avaliação de risco de doença cardíaca utilizando machine learning. Desenvolvido no âmbito do PIBIC (Programa Institucional de Bolsas de Iniciação Científica).

O **código** (variáveis, funções, rotas, banco de dados) usa nomes em **inglês**. A **interface do usuário** é exibida em **português**.

## Funcionalidades

- **Predição de Risco** — ML para classificar risco cardíaco (KNN, SVM, Random Forest, Ensemble)
- **CRUD de Pacientes** — Cadastro e gerenciamento
- **Avaliações** — Registro de predições por paciente
- **Relatórios** — Geração e exportação
- **Dashboard** — Estatísticas e métricas em tempo real
- **Cache via Redis** — Resultados de avaliações em cache para resposta rápida

## Stack

### Backend (`apps/server`)

| Componente | Tecnologia |
|------------|------------|
| Framework | FastAPI |
| ML | scikit-learn, imbalanced-learn |
| Banco | SQLite + SQLAlchemy + Alembic |
| Cache | Redis + fastapi-cache2 |
| Validação | Pydantic |
| Servidor | Uvicorn |

### Frontend (`apps/web`)

| Componente | Tecnologia |
|------------|------------|
| UI | React 19 + TypeScript |
| Build | Vite |
| Roteamento | TanStack Router (file-based) |
| State async | TanStack React Query 5 |
| State local | Jotai |
| Componentes | shadcn/ui (Radix UI + Tailwind) |
| Estilo | Tailwind CSS 4 |
| HTTP | Axios |
| Validação | Zod 4 |
| Formulários | React Hook Form + Zod |
| Gráficos | Recharts |
| Ícones | Lucide React |
| API Client | Orval (gerado de OpenAPI) |

## Pré-requisitos

- **Node.js** >= 18
- **Python** >= 3.12
- **uv** (gerenciador Python) — [instalação](https://docs.astral.sh/uv/)
- **Docker** — para rodar Redis (cache da API)

## Instalação

```bash
git clone <url>
cd <repo>
npm install                     # dependências do monorepo
cd apps/server && uv sync && cd ../..
cp apps/web/.env.example apps/web/.env
```

### Redis (via Docker)

```bash
docker run -d --name cardiopredict-redis -p 6379:6379 redis:7-alpine
```

A API conecta em `localhost:6379` por padrão. Para configurar host/porta customizados, defina as variáveis `REDIS_HOST` e `REDIS_PORT` no ambiente do servidor.

## Como Rodar

```bash
# Backend (primeira vez: treinar modelos)
cd apps/server
uv run python -m services.train_models
uv run python run.py             # http://localhost:8000

# Frontend (outro terminal)
cd apps/web
npm run dev                      # http://localhost:5173

# Ambos
npm run dev                      # raiz do monorepo
```

## Endpoints da API

Rotas antigas (português) redirecionam com `308 Permanent Redirect` para as novas rotas em inglês.

### Documentação

| Interface | URL |
|-----------|------|
| Scalar | `/scalar` |
| Swagger | `/docs` |
| ReDoc | `/redoc` |

### Rotas

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/patients` | Lista pacientes |
| POST | `/patients` | Cria paciente |
| GET | `/patients/{id}` | Paciente por ID |
| GET | `/evaluations` | Lista avaliações |
| POST | `/evaluations` | Cria avaliação + predição |
| GET | `/evaluations/{id}` | Avaliação por ID |
| GET | `/evaluations/{id}/factors` | Fatores contribuintes |
| GET | `/evaluations/{id}/importance` | Importância das features |
| GET | `/models` | Lista modelos |
| GET | `/models/{id}/metrics` | Métricas do modelo |
| GET | `/reports` | Lista relatórios |
| GET | `/reports/{id}` | Relatório por ID |
| POST | `/reports/export` | Exportar relatório |
| GET | `/dashboard/stats` | Estatísticas do dashboard |
| GET | `/dashboard/risks` | Distribuição de risco |
| GET | `/dashboard/factors` | Fatores de risco |

## Modelos de ML

| Modelo | Descrição |
|--------|-----------|
| KNN | K-Nearest Neighbors |
| SVM | Support Vector Machine |
| Random Forest | Floresta Aleatória |
| Ensemble | Combinação dos anteriores |

Métricas: `accuracy`, `precision`, `recall`, `f1_score`, `auc_roc`.

Re-treinar:
```bash
cd apps/server
uv run python -m services.train_models
```

## Campos do Paciente (entrada da predição)

| Campo | Descrição | Valores |
|-------|-----------|---------|
| age | Idade | anos |
| sex | Sexo | 1 = M, 0 = F |
| cp | Dor torácica | 1–4 |
| trestbps | Pressão arterial (repouso) | mm Hg |
| chol | Colesterol | mg/dl |
| fbs | Glicemia jejum > 120 | 1 = sim, 0 = não |
| restecg | ECG em repouso | 0–2 |
| thalach | Frequência cardíaca máxima | bpm |
| exang | Angina por exercício | 1 = sim, 0 = não |
| oldpeak | Depressão ST | float |
| slope | Inclinação ST | 1–3 |
| ca | Vasos coloridos | 0–3 |
| thal | Talassemia | 3, 6, 7 |

## Banco de Dados

SQLite em `apps/server/src/database/cardiopredict.db`

| Tabela | Descrição |
|--------|-----------|
| `patients` | Pacientes |
| `evaluations` | Avaliações/predições |
| `reports` | Relatórios |
| `model_metrics` | Métricas dos modelos |

### Migrations (Alembic)

```bash
npm run db:revision -- -m "descrição"   # gerar migration
npm run db:migrate                       # aplicar
npm run db:downgrade                     # reverter
```

## Comandos Úteis

```bash
npm run dev              # front + back
npm run dev:web          # só front
npm run dev:api          # só back
npm run train            # treinar modelos
npm run db:migrate       # aplicar migrations pendentes
npm run db:revision      # gerar nova migration (passar -m "desc")
npm run db:downgrade     # reverter última migration
```

### Frontend (`apps/web`)

```bash
npm run generate:api     # regerar client Orval do OpenAPI
npm run build            # build produção
npm run lint             # ESLint
```

## Estrutura

```
pibic/
├── apps/
│   ├── web/                    # Frontend React
│   │   ├── src/
│   │   │   ├── components/     # UI components
│   │   │   ├── routes/         # TanStack Router
│   │   │   ├── generated/      # Orval (não editar)
│   │   │   ├── lib/            # utils, queryClient
│   │   │   ├── atoms/          # Jotai atoms
│   │   │   └── store/          # state management
│   │   └── package.json
│   │
│   └── server/                 # Backend FastAPI
│       ├── src/
│       │   ├── api/            # rotas + middleware redirect
│       │   │   ├── app/        # app FastAPI
│       │   │   ├── middleware/ # 308 redirect (rotas antigas)
│       │   │   └── routes/     # dashboard, models, pages, patients, reports, result
│       │   ├── database/       # SQLAlchemy + Alembic
│       │   │   └── models/     # ORM (evaluation, model, patient, report)
│       │   ├── machine_learning/
│       │   ├── schemas/        # Pydantic
│       │   ├── services/       # lógica de negócio
│       │   │   └── constants/  # config de features
│       │   └── artifacts/      # .pkl treinados
│       ├── migrations/         # Alembic
│       └── pyproject.toml
│
├── design/                     # Design (Penpot)
└── package.json
```

## Aviso

Projeto **acadêmico/educacional**. Não deve ser usado para diagnóstico médico real. Modelos treinados com dataset UCI Heart Disease.
