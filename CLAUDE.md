# CardioPredict — Guia de Desenvolvimento

Este projeto é um sistema de predição de risco de doença cardíaca utilizando machine learning, desenvolvido para o PIBIC.

## 📌 Visão Geral
- **Objetivo:** Avaliação de risco cardíaco via ML (KNN, SVM, Random Forest, Ensemble).
- **Idiomas:** Código, variáveis e banco de dados em **inglês**. Interface do usuário em **português**.
- **Aviso:** Projeto acadêmico. Não utilizar para diagnóstico médico real.

## 🛠 Stack Tecnológica
### Backend (`apps/server`)
- **Framework:** FastAPI
- **ML:** scikit-learn, imbalanced-learn
- **Banco de Dados:** PostgreSQL + SQLAlchemy + Alembic
- **Cache:** Redis + fastapi-cache2
- **Validação:** Pydantic
- **Execução:** Uvicorn / uv

### Frontend (`apps/web`)
- **UI:** React 19 + TypeScript + Vite
- **Roteamento:** TanStack Router (file-based)
- **Estado:** TanStack React Query 5 (async), Jotai (local)
- **Estilo:** Tailwind CSS 4 + shadcn/ui (Radix UI)
- **Validação/Forms:** Zod 4 + React Hook Form
- **Gráficos:** Recharts
- **API Client:** Orval (gerado via OpenAPI)

## ⚙️ Fluxo de Trabalho

### Execução
- **Ambos (Front + Back):** `npm run dev` (raiz)
- **Backend:** `cd apps/server && uv run python run.py`
- **Frontend:** `cd apps/web && npm run dev`

### Machine Learning
- **Treinar Modelos:** `npm run train` ou `cd apps/server && uv run python -m services.train_models`
- **Artefatos:** Modelos salvos em `.pkl` em `apps/server/src/artifacts/`

### Banco de Dados (Migrations)
Sempre que alterar modelos ORM:
1. Editar modelo em `apps/server/src/database/models/`
2. Atualizar schemas em `apps/server/src/schemas/`
3. Atualizar rota em `apps/server/src/api/routes/`
4. Gerar migration: `npm run db:revision -- -m "descrição"`
5. Aplicar migration: `npm run db:migrate`

## 📂 Estrutura do Projeto
```
pibic/
├── apps/
│   ├── web/                    # Frontend React
│   │   ├── src/
│   │   │   ├── components/     # Componentes de UI
│   │   │   ├── routes/         # Rotas TanStack
│   │   │   ├── generated/      # Orval API Client (não editar)
│   │   │   └── atoms/          # Estado Jotai
│   │   └── package.json
│   └── server/                 # Backend FastAPI
│       ├── src/
│       │   ├── api/            # Rotas e Middleware
│       │   ├── database/       # SQLAlchemy + Modelos
│       │   ├── machine_learning/ # Lógica de ML
│       │   ├── schemas/        # Pydantic Models
│       │   └── services/       # Regras de Negócio
│       ├── migrations/          # Alembic
│       └── pyproject.toml
├── design/                     # Design (Penpot)
└── package.json
```

## 🤖 Regras para o Agente (AI)

### Graphify (Knowledge Graph)
Este projeto possui um grafo de conhecimento em `graphify-out/`.
- **Consultas:** Use `graphify query "<pergunta>"` para entender o codebase.
- **Relacionamentos:** Use `graphify path "<A>" "<B>"` para ver como componentes se conectam.
- **Conceitos:** Use `graphify explain "<conceito>"` para explicações focadas.
- **Navegação:** Use `graphify-out/wiki/index.md` para navegação ampla.
- **Atualização:** Após modificar código, execute `graphify update .` para atualizar o grafo.
- **Ordem de Operação:** Execute `graphify` **antes** de ler arquivos fonte para se orientar.

### Convenções de Código
- **Nomenclatura:** Mantenha nomes de funções, variáveis e classes em inglês.
- **Interface:** Mantenha textos de UI em português.
- **Tipagem:** Use TypeScript rigoroso no frontend e Pyright/Pydantic no backend.
