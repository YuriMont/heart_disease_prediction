# Server — Predição de Doença Cardíaca 🫀

API em Python com **machine learning** para prever risco de doença cardíaca
a partir de dados clínicos (idade, pressão, colesterol, exames...).

---

## 📁 Estrutura das pastas

```
server/
├── README.md
├── pyproject.toml
│
├── src/
│   ├── api/                        # FastAPI
│   │   ├── app/
│   │   │   └── app.py             # cria o app e conecta as rotas
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── dashboard.py       # rotas do dashboard
│   │       ├── modelos.py         # GET /modelos, GET /modelos/{id}/metricas
│   │       ├── pacientes.py       # CRUD de pacientes
│   │       ├── paginas.py         # rotas de páginas
│   │       ├── previsao.py        # POST /prever
│   │       ├── relatorios.py      # CRUD de relatórios
│   │       └── resultado.py       # rotas de resultado
│   │
│   ├── database/
│   │   ├── __init__.py
│   │   └── database.py           # configuração do SQLAlchemy + SQLite
│   │
│   ├── machine_learning/          # "miolo" de ML
│   │   ├── __init__.py
│   │   ├── avaliacao.py           # métricas (accuracy, recall, precision, f1, AUC-ROC)
│   │   ├── dados.py               # baixa e prepara os dados
│   │   └── modelos.py             # define KNN, SVM, Random Forest, Ensemble
│   │
│   ├── models/                    # modelos ORM (banco de dados)
│   │   ├── __init__.py
│   │   ├── avaliacao.py           # tabela avaliacoes
│   │   ├── metrica.py             # tabela model_metricas (métricas dos modelos)
│   │   ├── paciente.py            # tabela pacientes
│   │   └── relatorio.py           # tabela relatorios
│   │
│   ├── schemas/                   # schemas Pydantic (validação)
│   │   ├── __init__.py
│   │   ├── dashboard.py
│   │   ├── paciente.py
│   │   └── relatorio.py
│   │
│   ├── services/                  # lógica de negócio
│   │   ├── __init__.py
│   │   ├── prediction_service.py  # carrega modelos e faz previsão
│   │   └── train_models.py        # treina modelos e salva métricas no banco
│   │
│   └── artifacts/                 # modelos treinados (.pkl)
│       ├── knn.pkl
│       ├── svm.pkl
│       ├── random_forest.pkl
│       ├── ensemble.pkl
│       ├── scaler.pkl
│       └── feature_names.pkl
│
├── exemplos/
│   └── paciente.json
│
└── notebooks/
```

---

## ✅ Pré-requisitos

Apenas o **uv** (gerenciador de Python):

```bash
# Linux/macOS
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Mais informações: https://docs.astral.sh/uv/

---

## ▶️ Como rodar o backend

### 1. Instalar dependências

```bash
cd apps/server
uv sync
```

### 2. Treinar os modelos (primeira vez ou ao re-treinar)

```bash
uv run python -m services.train_models
```

Isso:
- Baixa os dados do dataset Heart Disease
- Treina os 4 modelos (KNN, SVM, Random Forest, Ensemble)
- Salva os modelos em `src/artifacts/*.pkl`
- Salva as métricas (accuracy, precision, recall, f1, AUC-ROC) no banco `cardiopredict.db`

### 3. Iniciar a API

```bash
uv run python run.py
```

A API estará disponível em: **http://127.0.0.1:8000**

### 4. Acessar a documentação

| Endereço                          | Interface |
|-----------------------------------|-----------|
| http://127.0.0.1:8000/scalar      | Scalar    |
| http://127.0.0.1:8000/docs        | Swagger   |
| http://127.0.0.1:8000/redoc       | ReDoc     |

---

## 🧠 Rotas da API

### Pacientes

| Método | Rota                      | O que faz                    |
|--------|---------------------------|------------------------------|
| GET    | `/pacientes`              | Lista todos os pacientes     |
| POST   | `/pacientes`              | Cria um paciente             |
| GET    | `/pacientes/{id}`         | Busca paciente por ID        |
| PUT    | `/pacientes/{id}`         | Atualiza paciente            |
| DELETE | `/pacientes/{id}`         | Remove paciente              |

### Avaliações e Previsão

| Método | Rota                      | O que faz                              |
|--------|---------------------------|----------------------------------------|
| POST   | `/prever`                 | Recebe dados clínicos e devolve previsão |
| GET    | `/avaliacoes`             | Lista avaliações                       |
| GET    | `/avaliacoes/{id}`        | Busca avaliação por ID                 |

### Modelos

| Método | Rota                              | O que faz                              |
|--------|-----------------------------------|----------------------------------------|
| GET    | `/modelos`                        | Lista modelos disponíveis              |
| GET    | `/modelos/{nome}/metricas`        | Métricas reais do modelo (do banco)    |

### Relatórios

| Método | Rota                      | O que faz                    |
|--------|---------------------------|------------------------------|
| GET    | `/relatorios`             | Lista relatórios             |
| POST   | `/relatorios`             | Cria relatório               |
| GET    | `/relatorios/{id}`        | Busca relatório por ID       |

### Dashboard

| Método | Rota                      | O que faz                    |
|--------|---------------------------|------------------------------|
| GET    | `/dashboard/stats`        | Estatísticas gerais          |

---

## 📊 Métricas dos modelos

As métricas são calculadas durante o treino e salvas na tabela `model_metricas`
do banco SQLite (`cardiopredict.db`).

**Endpoint:** `GET /modelos/{nome}/metricas`

**Resposta exemplo:**
```json
{
  "nome": "Ensemble",
  "acuracia": 0.942,
  "precisao": 0.935,
  "recall": 0.918,
  "f1_score": 0.926,
  "auc_roc": 0.96,
  "atualizacao": "24/06/2026 15:30"
}
```

**Métricas disponíveis:**

| Métrica     | Significado                                                 |
|-------------|-------------------------------------------------------------|
| `acuracia`  | Percentual de acertos total                                 |
| `precisao`  | Dos que o modelo disse ser positivo, quantos são realmente  |
| `recall`    | Dos que são positivos, quantos o modelo encontrou           |
| `f1_score`  | Média harmônica entre precisão e recall                     |
| `auc_roc`   | Capacidade de distinguir entre classes (0.5 = aleatório, 1.0 = perfeito) |

---

## 📋 Campos do paciente (entrada do `/prever`)

| Campo      | Significado                                       | Valores           |
|------------|---------------------------------------------------|-------------------|
| `age`      | Idade em anos                                     | ex.: 54           |
| `sex`      | Sexo                                              | 1 = masc, 0 = fem |
| `cp`       | Tipo de dor no peito                              | 1 a 4             |
| `trestbps` | Pressão arterial em repouso (mm Hg)               | ex.: 130          |
| `chol`     | Colesterol (mg/dl)                                | ex.: 250          |
| `fbs`      | Glicemia em jejum > 120 mg/dl                     | 1 = sim, 0 = não  |
| `restecg`  | Eletrocardiograma em repouso                      | 0 a 2             |
| `thalach`  | Frequência cardíaca máxima atingida               | ex.: 150          |
| `exang`    | Angina induzida por exercício                     | 1 = sim, 0 = não  |
| `oldpeak`  | Depressão do segmento ST no exercício             | ex.: 1.5          |
| `slope`    | Inclinação do segmento ST                         | 1 a 3             |
| `ca`       | Nº de vasos principais coloridos                  | 0 a 3             |
| `thal`     | Talassemia                                        | 3, 6 ou 7         |

---

## 🗄️ Banco de dados

SQLite local: `src/database/cardiopredict.db`

**Tabelas:**

| Tabela           | Descrição                          |
|------------------|------------------------------------|
| `pacientes`      | Dados cadastrais dos pacientes     |
| `avaliacoes`     | Resultados de previsões            |
| `relatorios`     | Relatórios médicos                 |
| `model_metricas` | Métricas de desempenho dos modelos |

---

## 🔁 Migrations (Alembic)

As migrations versionam o schema do banco. Rode os comandos a partir de
`apps/server` (ou use os atalhos `npm run` na raiz do monorepo).

| Ação                        | `apps/server`                                         | Raiz do monorepo            |
|-----------------------------|-------------------------------------------------------|-----------------------------|
| Gerar migration (autogen)   | `uv run alembic revision --autogenerate -m "mensagem"`| `npm run db:revision -- -m "mensagem"` |
| Aplicar migrations          | `uv run alembic upgrade head`                         | `npm run db:migrate`        |
| Reverter última migration   | `uv run alembic downgrade -1`                         | `npm run db:downgrade`      |
| Ver versão atual            | `uv run alembic current`                              | `npm run db:current`        |
| Ver histórico               | `uv run alembic history`                              | `npm run db:history`        |

> Os argumentos depois de `--` são repassados ao Alembic. Ex.:
> `npm run db:revision -- -m "cria tabela pacientes"`.

---

## 🏋️ Re-treinar os modelos

```bash
uv run python -m services.train_models
```

O treino:
- Baixa o dataset automaticamente
- Executa GridSearchCV com validação cruzada
- Salva os modelos em `src/artifacts/`
- Atualiza as métricas no banco de dados (insere ou atualiza)

---

## 🔮 Exemplo de uso via terminal

```bash
# Criar um paciente
curl -X POST "http://127.0.0.1:8000/pacientes" \
     -H "Content-Type: application/json" \
     -d '{"nome": "João", "idade": 55, "sexo": 1}'

# Fazer uma previsão
curl -X POST "http://127.0.0.1:8000/prever" \
     -H "Content-Type: application/json" \
     -d @exemplos/paciente.json

# Ver métricas de um modelo
curl "http://127.0.0.1:8000/modelos/ensemble/metricas"
```

---

## ⚠️ Aviso

Este projeto é **acadêmico/educacional**. Não deve ser usado para diagnóstico
médico real. É apenas uma ferramenta de apoio e estudo.
