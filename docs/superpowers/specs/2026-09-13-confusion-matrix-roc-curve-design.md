# Design Spec: Matriz de Confusão e Curva ROC na Interface

## Visão Geral
Adicionar a visualização da **Matriz de Confusão** (grid 2x2) e da **Curva ROC** (gráfico interativo Recharts) na página de modelos de IA (`/models/index.tsx`) do CardioPredict, persistindo os dados pré-calculados no banco de dados SQLite.

---

## 1. Backend & Banco de Dados

### 1.1 Modelo SQLAlchemy (`database/models/model.py`)
Adicionar duas novas colunas do tipo `JSON` na tabela `modelos`:
- `confusion_matrix`: dict com chaves `tn`, `fp`, `fn`, `tp` (ex: `{"tn": 42, "fp": 5, "fn": 4, "tp": 49}`)
- `roc_curve`: list de objetos com `fpr` e `tpr` (ex: `[{"fpr": 0.0, "tpr": 0.0}, ..., {"fpr": 1.0, "tpr": 1.0}]`)

### 1.2 Migration Alembic
- Criar nova migration `add_confusion_matrix_and_roc_curve_to_models` para adicionar as colunas `confusion_matrix` e `roc_curve` no SQLite.

### 1.3 Avaliação & Treinamento (`machine_learning/evaluation.py` & `services/train_models.py`)
- Em `evaluation.py`, atualizar a função `evaluate` para retornar `confusion_matrix` (calculado via `sklearn.metrics.confusion_matrix`) e `roc_curve` (amostrado para ~30 pontos para limitar o tamanho do payload JSON).
- Em `train_models.py`, salvar essas estruturas no banco ao atualizar ou criar registros de `Model`.

### 1.4 Schemas & API (`schemas/dashboard.py` & `api/routes/models.py`)
- Em `schemas/dashboard.py`, atualizar `ModelMetrics`:
  ```python
  class ConfusionMatrixData(BaseModel):
      tn: int
      fp: int
      fn: int
      tp: int

  class RocPoint(BaseModel):
      fpr: float
      tpr: float

  class ModelMetrics(BaseModel):
      id: str
      name: str
      accuracy: float
      precision: float
      recall: float
      f1_score: float
      auc_roc: float
      updated_at: str
      confusion_matrix: ConfusionMatrixData | None = None
      roc_curve: list[RocPoint] | None = None
  ```

---

## 2. Frontend & Interface

### 2.1 Geração do API Client
- Executar `npm run generate:api` para atualizar os tipos TypeScript e hooks do Orval.

### 2.2 Componente: Matriz de Confusão (`components/models/confusion-matrix-card.tsx`)
- Card contendo Grid 2x2 estilizado com Tailwind:
  - Célula TN (Verdadeiro Negativo): fundo verde suave (`bg-emerald-500/10`, borda `emerald-500/30`)
  - Célula FP (Falso Positivo): fundo âmbar suave (`bg-amber-500/10`, borda `amber-500/30`)
  - Célula FN (Falso Negativo): fundo vermelho suave (`bg-rose-500/10`, borda `rose-500/30`)
  - Célula TP (Verdadeiro Positivo): fundo azul/primary suave (`bg-primary/10`, borda `primary/30`)
- Rótulos de eixos: **Classe Real** (Negativo/Positivo) vs **Predição** (Negativo/Positivo), exibindo valores absolutos e porcentagens.

### 2.3 Componente: Curva ROC (`components/models/roc-curve-card.tsx`)
- Card contendo gráfico Recharts (`ResponsiveContainer`, `LineChart`):
  - Linha ROC (`type="monotone"`, cor primária ou laranja/azul, `strokeWidth={2}`)
  - Linha Diagonal de Referência / Random Guess (`strokeDasharray="3 3"`, cor muted)
  - Eixos X (Taxa de Falsos Positivos - FPR) e Y (Taxa de Verdadeiros Positivos - TPR) formatados em porcentagem ou decimal de 0 a 1.
  - Tooltip interativo destacando Sensibilidade e (1 - Especificidade) ao passar o mouse.
  - Badge com valor do AUC-ROC.

### 2.4 Integração na Tela `/models/index.tsx`
- Adicionar os dois novos componentes na coluna principal/lateral da página de modelos para o modelo atualmente selecionado.

---

## 3. Plano de Verificação

1. **Treinamento ML:** Executar script de treino para atualizar o banco de dados local com as novas métricas e curvas.
2. **Backend Checks:** Rodar `npm run lint:api` e `npm run typecheck:api`.
3. **Frontend Codegen:** Executar `npm run generate:api`.
4. **Frontend Checks:** Rodar `npm run lint:web` e `npm run typecheck:web`.
