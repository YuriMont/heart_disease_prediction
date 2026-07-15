# CardioPredict — Manual do Agente

## Projeto

Monorepo de predição de risco cardíaco com ML. FastAPI + React 19 + TypeScript.

- **Código** (variáveis, funções, rotas, BD): **inglês**
- **Interface do usuário**: **português**

## Stack

| Camada | Tecnologia |
|--------|------------|
| Backend | FastAPI + Python 3.12 + SQLite + SQLAlchemy + Alembic |
| ML | scikit-learn, imbalanced-learn (KNN, SVM, RF, Ensemble) |
| Cache | Redis + fastapi-cache2 |
| Frontend | React 19 + TypeScript + Vite |
| Roteamento | TanStack Router (file-based) |
| State async | TanStack React Query 5 |
| State local | Jotai |
| UI | shadcn/ui (Radix UI + Tailwind CSS 4) |
| Validação | Zod 4 + React Hook Form |
| API Client | Orval (gerado de OpenAPI) |
| Gráficos | Recharts |
| Ícones | Lucide React |

## Estrutura

```
pibic/
├── apps/
│   ├── web/                    # React + TypeScript
│   │   ├── src/
│   │   │   ├── components/     # UI (dashboard, evaluation, layout, patients, result, ui)
│   │   │   ├── routes/         # TanStack Router (__root, index, evaluation/, patients/, models/, reports/, results/)
│   │   │   ├── generated/      # ⚠️ Orval — não editar
│   │   │   ├── lib/            # api.ts, utils, queryClient
│   │   │   ├── atoms/          # Jotai atoms
│   │   │   └── store/          # State management
│   │   ├── eslint.config.js    # Flat config ESLint
│   │   └── .prettierrc
│   │
│   └── server/                 # FastAPI + Python
│       ├── src/
│       │   ├── api/            # app + middleware + routes
│       │   ├── database/       # SQLAlchemy + models ORM
│       │   ├── machine_learning/ # KNN, SVM, RF, Ensemble
│       │   ├── schemas/        # Pydantic
│       │   └── services/       # prediction, training, feature analysis
│       └── pyproject.toml      # Ruff + Pyright config
│
├── design/                     # Design Penpot (pibic.pen)
├── docs/superpowers/           # Especificações e planos
└── openspec/                   # OpenSpec changes
```

## Comandos Essenciais

```bash
# Instalação
npm run install:all      # instalar dependências (root + web + server)

# Desenvolvimento
npm run dev              # front + back
npm run dev:web          # só front
npm run dev:api          # só back

# Lint
npm run lint             # ruff + ESLint
npm run lint:api         # ruff check
npm run lint:web         # eslint .
npm run lint:fix         # ruff check --fix

# Formatação
npm run format           # ruff format + prettier --check
npm run format:api       # ruff format
npm run format:web       # prettier --check
npm run format:web:fix   # prettier --write

# Type check
npm run typecheck        # pyright + tsc -b --noEmit
npm run typecheck:api    # pyright
npm run typecheck:web    # tsc -b --noEmit

# Banco
npm run db:migrate       # alembic upgrade head
npm run db:revision      # gerar migration
npm run db:downgrade     # reverter

# ML
npm run train            # treinar modelos

# Frontend
npm run generate:api     # regerar Orval do OpenAPI
npm run build            # build produção
```

## Habilidades (Skills)

O projeto possui skills organizadas em três diretórios. Use a skill correta automaticamente conforme o contexto da tarefa.

### Skills de fluxo de trabalho (.agents/skills/)

| Skill | Quando usar |
|-------|-------------|
| **brainstorming** | **SEMPRE** antes de qualquer trabalho criativo. Explora requisitos, faz perguntas, propõe abordagens. Não codificar sem aprovação. |
| **writing-plans** | Após brainstorming aprovado. Cria plano de implementação detalhado com tarefas de 2-5 min. |
| **grill-me** | Quando o usuário pedir crítica ou refinamento de um plano/design. Sessão de perguntas incisivas. |
| **frontend-design** | Ao criar/alterar UI. Direcionamento estético: tipografia, cores, layout, identidade visual. |
| **fastapi-templates** | Ao criar novos endpoints, serviços, ou módulos no backend. Padrões async, DI, repositórios. |
| **caveman** | Quando o usuário pedir comunicação ultra-compacta ou economia de tokens. |
| **find-skills** | Quando o usuário perguntar como fazer algo que nenhuma skill atual cobre. Busca no ecossistema. |

### Skills OpenSpec (.opencode/skills/ e .claude/skills/)

| Comando | Quando usar |
|---------|-------------|
| `/opsx-explore` | Pensar sobre problemas, requisitos, investigar sem implementar. |
| `/opsx-propose` | Propor mudança completa com proposal + design + tasks. |
| `/opsx-apply` | Implementar tarefas de uma change OpenSpec existente. |
| `/opsx-archive` | Arquivar change após implementação completa. |
| `/opsx-sync` | Sincronizar delta specs de uma change para as main specs. |

### Fluxo de ativação automática

1. Usuário descreve tarefa → carregar **brainstorming**
2. Design aprovado → carregar **writing-plans**
3. Plano aprovado → carregar **openspec-propose** ou implementar diretamente
4. Durante implementação:
   - UI → carregar **frontend-design**
   - Backend → carregar **fastapi-templates** se aplicável
   - Após código → rodar `npm run lint && npm run typecheck`

## Convenções de Código

### Python (apps/server)

- Ruff com seleção: E, F, I, N, UP, B, SIM, ARG, RUF
- Line length: 88
- Aspas duplas (`"`)
- Per-file ignores:
  - `__init__.py`: F401
  - `src/api/routes/*.py`: B008
  - `src/machine_learning/*.py`: N803, N806
- Pyright: mode `basic`, escopo `src/`
- FastAPI async handlers, Depends para DI
- SQLAlchemy async + Alembic para migrations

### TypeScript/React (apps/web)

- ESLint flat config com `@eslint/js`, `typescript-eslint`, `react-hooks`, `react-refresh`
- Prettier: singleQuote, trailingComma all, printWidth 80, semi true
- `@typescript-eslint/no-unused-vars`: warn com `argsIgnorePattern: '^_'`
- shadcn/ui + Tailwind CSS 4 para componentes
- TanStack Router file-based em `src/routes/`
- Orval gera client API em `src/generated/` — **não editar**
- CSS: Tailwind utility classes (sem CSS modules ou styled-components)

### Geral

- Código em inglês, UI em português
- Commits: mensagens descritivas em português ou inglês
- Testes: pytest (backend), Vitest (frontend) quando aplicável
