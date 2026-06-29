# Web — Frontend de Avaliação de Risco Cardíaco

Frontend React do projeto PIBIC. Interface em **português**, código em **inglês**.

## Stack

| Camada | Tecnologia |
|--------|------------|
| UI | React 19 + TypeScript |
| Build | Vite |
| Roteamento | TanStack Router (file-based) |
| State | TanStack React Query |
| Estilo | Tailwind CSS 4 |
| HTTP | Axios |
| Validação | Zod |
| API Client | Orval (gerado de OpenAPI) |

## Pré-requisitos

- Node.js >= 18
- Backend em `http://localhost:8000` (FastAPI)

## Instalação

```bash
cd apps/web
npm install
cp .env.example .env
```

| Variável | Padrão |
|----------|--------|
| `VITE_API_URL` | `http://localhost:8000` |

## Scripts

| Comando | Descrição |
|---------|-----------|
| `dev` | Servidor dev (HMR) |
| `build` | Compila TS + build produção |
| `preview` | Preview da build |
| `lint` | ESLint |
| `generate:api` | Regenera client Orval do OpenAPI |

## Estrutura

```
src/
├── components/
│   ├── dashboard/        # Cards, gráficos, estatísticas
│   ├── evaluation/       # Formulário de avaliação (wizard)
│   ├── result/           # Hero, fatores, importância, recomendações
│   ├── layout/           # Sidebar, MainLayout
│   └── ui/               # Componentes base (Button, Card, Input, etc.)
│
├── routes/
│   ├── __root.tsx        # Layout raiz
│   ├── index.tsx         # Dashboard (/)
│   ├── evaluation/       # Nova avaliação (/evaluation)
│   │   └── $id/          # Resultado da avaliação (/evaluation/$id)
│   ├── patients/         # Lista de pacientes (/patients)
│   ├── models/           # Modelos de ML (/models)
│   ├── reports/          # Relatórios (/reports)
│   └── results/          # Resultados (/results)
│
├── generated/            # ⚠️ Orval — não editar
│   ├── api/              # Hooks por domínio (dashboard, patients, result, etc.)
│   └── models/           # Tipos TS + schemas Zod
│
├── lib/                  # api.ts, utils, queryClient
└── store/                # Jotai atoms
```

## Geração de API

```bash
npm run generate:api      # busca /openapi.json do backend
```

Gera hooks React Query + schemas Zod em `src/generated/`. **Nunca editar.**

## Rotas

| Path | Página |
|------|--------|
| `/` | Dashboard |
| `/evaluation` | Nova Avaliação |
| `/evaluation/$id` | Resultado da Predição |
| `/patients` | Pacientes |
| `/models` | Modelos de IA |
| `/reports` | Relatórios |
| `/results` | Resultados |

## Backend

API FastAPI em `apps/server`. Rode antes do frontend.

## Licença

PIBIC — Programa Institucional de Bolsas de Iniciação Científica.
