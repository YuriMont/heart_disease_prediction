# Web — Sistema de Avaliação de Risco de Pacientes

Frontend React do projeto PIBIC para avaliação de risco de pacientes.

## Stack

| Camada | Tecnologia |
|---|---|
| UI | React 19 + TypeScript 6 |
| Build | Vite 8 |
| Roteamento | TanStack Router (file-based) |
| State async | TanStack React Query 5 |
| Estilo | Tailwind CSS 4 |
| HTTP | Axios |
| Validação | Zod 4 |
| API Client | Orval (gera hooks + schemas a partir de OpenAPI) |

## Pré-requisitos

- Node.js >= 18
- Backend rodando em `http://localhost:8000` (FastAPI com OpenAPI em `/openapi.json`)

## Instalação

```bash
# Na raiz do monorepo
npm install

# Ou apenas no web/
cd apps/web
npm install
```

## Variáveis de Ambiente

Copie `.env.example` para `.env`:

```bash
cp .env.example .env
```

| Variável | Descrição | Padrão |
|---|---|---|
| `VITE_API_URL` | URL do backend API | `http://localhost:8000` |

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento (HMR) |
| `npm run build` | Compila TS + gera build de produção |
| `npm run preview` | Visualiza o build de produção localmente |
| `npm run lint` | Executa ESLint em todos os arquivos |
| `npm run generate:api` | Regenera client de API + schemas Zod a partir do backend |

## Estrutura

```
src/
├── main.tsx                 # Entry point
├── index.css                # Estilos globais (Tailwind)
├── routeTree.gen.ts         # Árvore de rotas (gerada automaticamente)
├── assets/                  # Imagens e SVGs
├── lib/
│   ├── api.ts               # Instância Axios (baseURL = VITE_API_URL)
│   └── queryClient.ts       # Instância do React Query
├── routes/
│   ├── __root.tsx           # Layout raiz
│   └── index.tsx            # Rota "/"
└── generated/               # ⚠️ Gerado pelo Orval — NÃO EDITAR
    ├── api/                 # Hooks React Query por domínio
    │   ├── dashboard/
    │   ├── geral/
    │   ├── modelos/
    │   ├── pacientes/
    │   ├── previsão/
    │   ├── relatorios/
    │   └── resultado/
    └── models/              # Tipos TypeScript + schemas Zod
```

## Geração de API

O projeto usa **Orval** para gerar automaticamente hooks React Query e schemas Zod a partir da spec OpenAPI do backend.

```bash
npm run generate:api
```

Isso busca `http://localhost:8000/openapi.json` e gera o código em `src/generated/`. **Nunca edite arquivos em `src/generated/`** — eles são sobrescritos a cada geração.

### Domínios de API gerados

- **dashboard** — Estatísticas do dashboard
- **geral** — Endpoints gerais
- **modelos** — Modelos de ML disponíveis
- **pacientes** — CRUD de pacientes
- **previsão** — Previsão de risco
- **relatorios** — Exportação de relatórios
- **resultado** — Resultados de avaliação

## Roteamento

Usa TanStack Router com **file-based routing**. As rotas são definidas em `src/routes/` e a árvore é gerada automaticamente em `src/routeTree.gen.ts`.

Para adicionar uma rota, crie um arquivo em `src/routes/`:

```
src/routes/
├── __root.tsx        # Layout raiz (presente)
├── index.tsx         # "/"
├── pacientes.tsx     # "/pacientes"
└── pacientes/
    └── $id.tsx       # "/pacientes/:id"
```

## Backend

O frontend se comunica com um backend que expõe uma API REST com spec OpenAPI. O Vite faz proxy de `/api` para o backend durante o desenvolvimento.

Certifique-se de que o backend esteja rodando antes de iniciar o frontend.

## Licença

Projeto PIBIC — Programa Institucional de Bolsas de Iniciação Científica.
