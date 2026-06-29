# Server — API de Predição de Doença Cardíaca

API em Python com **machine learning** para prever risco de doença cardíaca.
Código e endpoints em inglês; UI do frontend em português.

---

## Estrutura

```
server/
├── src/
│   ├── api/                        # FastAPI
│   │   ├── app/app.py             # app + rotas
│   │   ├── middleware/redirect.py # 308 redirect (rotas antigas)
│   │   └── routes/
│   │       ├── dashboard.py       # /dashboard/*
│   │       ├── models.py          # /models/*
│   │       ├── pages.py           # /, /scalar
│   │       ├── patients.py        # /patients/*, /evaluations/*
│   │       ├── prediction.py      # /predict
│   │       ├── reports.py         # /reports/*
│   │       └── result.py          # /evaluations/{id}/factors, /importance
│   │
│   ├── database/
│   │   ├── connection.py          # SQLAlchemy + SQLite + get_db
│   │   └── models/               # ORM
│   │       ├── evaluation.py      # tabela evaluations
│   │       ├── model.py           # tabela model_metrics
│   │       ├── patient.py         # tabela patients
│   │       └── report.py          # tabela reports
│   │
│   ├── machine_learning/
│   │   ├── data.py               # preparação dos dados
│   │   ├── evaluation.py          # métricas / gráficos
│   │   └── models.py             # KNN, SVM, RF, Ensemble
│   │
│   ├── schemas/                   # Pydantic
│   │   ├── dashboard.py
│   │   ├── evaluation.py
│   │   ├── model.py
│   │   ├── patient.py
│   │   ├── report.py
│   │   └── result.py
│   │
│   ├── services/
│   │   ├── feature_analysis.py    # importância / fatores
│   │   ├── prediction_service.py  # carrega modelo e prediz
│   │   └── train_models.py        # treina e salva métricas
│   │
│   └── artifacts/                 # .pkl (gitignored)
│       ├── knn.pkl / svm.pkl / random_forest.pkl / ensemble.pkl
│       ├── scaler.pkl / feature_names.pkl
│
├── migrations/                    # Alembic
├── exemplos/paciente.json
└── notebooks/
```

---

## Como Rodar

```bash
cd apps/server
uv sync                                   # instalar dependências
uv run python -m services.train_models    # treinar (primeira vez)
uv run python run.py                      # http://127.0.0.1:8000
```

### Documentação

| Endereço | Interface |
|----------|-----------|
| `/scalar` | Scalar |
| `/docs`  | Swagger |
| `/redoc` | ReDoc |

---

## Endpoints

Rotas antigas (português) redirecionam com 308 para as novas.

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/patients` | Lista pacientes |
| POST | `/patients` | Criar paciente |
| GET | `/patients/{id}` | Paciente por ID |
| GET | `/evaluations` | Lista avaliações |
| POST | `/evaluations` | Criar avaliação |
| GET | `/evaluations/{id}` | Avaliação por ID |
| GET | `/evaluations/{id}/factors` | Fatores contribuintes |
| GET | `/evaluations/{id}/importance` | Importância das features |
| POST | `/predict` | Predizer risco |
| GET | `/models` | Lista modelos |
| GET | `/models/{id}/metrics` | Métricas do modelo |
| GET | `/reports` | Lista relatórios |
| GET | `/reports/{id}` | Relatório por ID |
| POST | `/reports/export` | Exportar relatório |
| GET | `/dashboard/stats` | Estatísticas |
| GET | `/dashboard/risks` | Distribuição de risco |
| GET | `/dashboard/factors` | Fatores de risco |

---

## Métricas dos Modelos

**`GET /models/{id}/metrics`**

```json
{
  "name": "Ensemble",
  "accuracy": 0.942,
  "precision": 0.935,
  "recall": 0.918,
  "f1_score": 0.926,
  "auc_roc": 0.96,
  "updated_at": "2026-06-24T15:30:00"
}
```

| Métrica | Significado |
|---------|-------------|
| accuracy | Percentual de acertos |
| precision | VP / (VP + FP) |
| recall | VP / (VP + FN) |
| f1_score | Média harmônica precision × recall |
| auc_roc | Discriminação entre classes |

---

## Banco de Dados

SQLite em `src/database/cardiopredict.db`

| Tabela | Descrição |
|--------|-----------|
| `patients` | Pacientes |
| `evaluations` | Avaliações/predições |
| `reports` | Relatórios |
| `model_metrics` | Métricas dos modelos |

### Migrations (Alembic)

```bash
uv run alembic revision --autogenerate -m "desc"
uv run alembic upgrade head
uv run alembic downgrade -1
```

---

## Exemplo via curl

```bash
# Criar paciente
curl -X POST http://localhost:8000/patients \
  -H "Content-Type: application/json" \
  -d '{"name": "João", "age": 55, "sex": 1}'

# Predizer
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d @exemplos/paciente.json

# Rotas antigas funcionam (308 redirect)
curl -v http://localhost:8000/pacientes
# → HTTP 308 → Location: /patients
```

---

## Aviso

Projeto **acadêmico/educacional**. Não usar para diagnóstico real.
