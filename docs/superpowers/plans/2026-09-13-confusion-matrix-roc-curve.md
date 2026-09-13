# Matriz de Confusão e Curva ROC Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement visual display of Confusion Matrix (2x2 heatmap) and ROC Curve (interactive Recharts line chart) on the frontend AI Models page (`/models`), with pre-calculated metrics saved in SQLite DB.

**Architecture:** Extend SQLAlchemy `Model` database table with `confusion_matrix` and `roc_curve` JSON columns. Update model training script to calculate and persist these metrics. Expose updated metrics via FastAPI `/models/{model_id}/metrics`. Update web client via Orval code generator and render interactive components on `/models`.

**Tech Stack:** FastAPI, Python 3.12, SQLAlchemy, scikit-learn, React 19, TypeScript, Recharts, Tailwind CSS 4, shadcn/ui.

## Global Constraints
- Language: English for code (variables, APIs, DB), Portuguese for UI text.
- Formatter/Linter: Ruff (backend), Prettier/ESLint (frontend).
- Standards: Run `npm run lint` and `npm run typecheck` after modifications.

---

### Task 1: Update Database Model & Alembic Migration

**Files:**
- Modify: `apps/server/src/database/models/model.py`
- Create: `apps/server/alembic/versions/<hash>_add_confusion_matrix_and_roc_curve.py` (via `npm run db:revision`)

**Interfaces:**
- Produces: `Model.confusion_matrix` (dict | None), `Model.roc_curve` (list | None)

- [ ] **Step 1: Update `Model` SQLAlchemy model class in `apps/server/src/database/models/model.py`**

Add `JSON` imports from `sqlalchemy` and declare `confusion_matrix` and `roc_curve` columns:

```python
from sqlalchemy import JSON, Boolean, DateTime, Float, String, UniqueConstraint
```

And in `Model`:
```python
    confusion_matrix: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    roc_curve: Mapped[list | None] = mapped_column(JSON, nullable=True)
```

- [ ] **Step 2: Generate database migration revision**

Run: `npm run db:revision -- -m "add_confusion_matrix_and_roc_curve"`
Expected: New migration file created in `apps/server/alembic/versions/`.

- [ ] **Step 3: Run migration upgrade**

Run: `npm run db:migrate`
Expected: Migration successfully applied to SQLite DB.

- [ ] **Step 4: Commit**

```bash
git add apps/server/src/database/models/model.py apps/server/alembic/versions/*.py
git commit -m "feat(db): add confusion_matrix and roc_curve JSON columns to Model"
```

---

### Task 2: Update Machine Learning Evaluation & Model Training

**Files:**
- Modify: `apps/server/src/machine_learning/evaluation.py`
- Modify: `apps/server/src/services/train_models.py`

**Interfaces:**
- Consumes: `sklearn.metrics.confusion_matrix`, `sklearn.metrics.roc_curve`
- Produces: `evaluate()` returning `metrics` dict with `confusion_matrix` and `roc_curve` keys.

- [ ] **Step 1: Update `evaluate()` in `apps/server/src/machine_learning/evaluation.py`**

Modify `evaluate` to compute `confusion_matrix` dict (`tn`, `fp`, `fn`, `tp`) and sampled `roc_curve` list of dicts (`fpr`, `tpr`):

```python
import numpy as np

def evaluate(y_true, y_pred, y_probability=None, name="Model"):
    print(f"\n--- Evaluation: {name} ---")
    print(classification_report(y_true, y_pred))

    metrics = {
        "accuracy": float(accuracy_score(y_true, y_pred)),
        "recall": float(recall_score(y_true, y_pred)),
        "precision": float(precision_score(y_true, y_pred)),
        "f1_score": float(f1_score(y_true, y_pred)),
    }

    # Confusion matrix: binary classification [[tn, fp], [fn, tp]]
    cm = confusion_matrix(y_true, y_pred, labels=[0, 1])
    if cm.shape == (2, 2):
        tn, fp, fn, tp = cm.ravel()
        metrics["confusion_matrix"] = {
            "tn": int(tn),
            "fp": int(fp),
            "fn": int(fn),
            "tp": int(tp),
        }

    if y_probability is not None:
        fpr, tpr, _ = roc_curve(y_true, y_probability)
        metrics["auc_roc"] = float(auc(fpr, tpr))
        
        # Sample points to keep payload concise (max ~30 points)
        if len(fpr) > 30:
            indices = np.linspace(0, len(fpr) - 1, 30, dtype=int)
            fpr_sampled = fpr[indices]
            tpr_sampled = tpr[indices]
        else:
            fpr_sampled = fpr
            tpr_sampled = tpr
            
        metrics["roc_curve"] = [
            {"fpr": round(float(f), 4), "tpr": round(float(t), 4)}
            for f, t in zip(fpr_sampled, tpr_sampled)
        ]
    else:
        metrics["auc_roc"] = 0.0
        metrics["roc_curve"] = []

    for name_metric, value in metrics.items():
        if isinstance(value, float):
            print(f"  {name_metric:10s}: {value:.4f}")

    return metrics
```

- [ ] **Step 2: Update `train_models.py` to persist `confusion_matrix` and `roc_curve` in DB**

In `apps/server/src/services/train_models.py`:
```python
            if model_db:
                model_db.accuracy = metrics["accuracy"]
                model_db.precision = metrics["precision"]
                model_db.recall = metrics["recall"]
                model_db.f1_score = metrics["f1_score"]
                model_db.auc_roc = metrics["auc_roc"]
                model_db.confusion_matrix = metrics.get("confusion_matrix")
                model_db.roc_curve = metrics.get("roc_curve")
                model_db.updated_at = datetime.now()
                print(f"   Metrics updated in database for: {model_config['name']}")
            else:
                new_metrics = Model(
                    name=model_config["name"],
                    description=DEFAULT_DESCRIPTIONS.get(
                        model_config["name"], model_config["name"]
                    ),
                    active=True,
                    accuracy=metrics["accuracy"],
                    precision=metrics["precision"],
                    recall=metrics["recall"],
                    f1_score=metrics["f1_score"],
                    auc_roc=metrics["auc_roc"],
                    confusion_matrix=metrics.get("confusion_matrix"),
                    roc_curve=metrics.get("roc_curve"),
                )
                db.add(new_metrics)
```

- [ ] **Step 3: Test model training script**

Run: `npm run train`
Expected: Models trained, output showing metrics saved to DB without errors.

- [ ] **Step 4: Commit**

```bash
git add apps/server/src/machine_learning/evaluation.py apps/server/src/services/train_models.py
git commit -m "feat(ml): compute and persist confusion matrix and ROC curve during training"
```

---

### Task 3: Update FastAPI Schemas & Model Metrics Endpoint

**Files:**
- Modify: `apps/server/src/schemas/dashboard.py`
- Modify: `apps/server/src/api/routes/models.py`

**Interfaces:**
- Consumes: `Model.confusion_matrix`, `Model.roc_curve`
- Produces: Updated `ModelMetrics` schema with `confusion_matrix` and `roc_curve`.

- [ ] **Step 1: Update `ModelMetrics` in `apps/server/src/schemas/dashboard.py`**

Add `ConfusionMatrixData` and `RocPoint` sub-models:

```python
class ConfusionMatrixData(BaseModel):
    tn: int = Field(..., description="Verdadeiros Negativos")
    fp: int = Field(..., description="Falsos Positivos")
    fn: int = Field(..., description="Falsos Negativos")
    tp: int = Field(..., description="Verdadeiros Positivos")


class RocPoint(BaseModel):
    fpr: float = Field(..., description="False Positive Rate")
    tpr: float = Field(..., description="True Positive Rate")


class ModelMetrics(BaseModel):
    id: str = Field(..., description="Identificador único do modelo")
    name: str = Field(..., description="Nome de exibição do modelo")
    accuracy: float = Field(..., description="Acurácia do modelo (0.0 a 1.0)")
    precision: float = Field(..., description="Precisão do modelo (0.0 a 1.0)")
    recall: float = Field(..., description="Recall do modelo (0.0 a 1.0)")
    f1_score: float = Field(..., description="F1-Score do modelo (0.0 a 1.0)")
    auc_roc: float = Field(..., description="Área sob a curva ROC (0.0 a 1.0)")
    updated_at: str = Field(
        ..., description="Data da última atualização formatada"
    )
    confusion_matrix: ConfusionMatrixData | None = Field(
        None, description="Matriz de confusão (TN, FP, FN, TP)"
    )
    roc_curve: list[RocPoint] | None = Field(
        None, description="Pontos da curva ROC (FPR, TPR)"
    )
```

- [ ] **Step 2: Update `get_metrics` route in `apps/server/src/api/routes/models.py`**

Pass `confusion_matrix` and `roc_curve` to `ModelMetrics`:

```python
    return ModelMetrics(
        id=modelo_db.id,
        name=modelo_db.name,
        accuracy=modelo_db.accuracy,
        precision=modelo_db.precision,
        recall=modelo_db.recall,
        f1_score=modelo_db.f1_score,
        auc_roc=modelo_db.auc_roc,
        updated_at=modelo_db.updated_at.strftime("%d/%m/%Y %H:%M"),
        confusion_matrix=modelo_db.confusion_matrix,
        roc_curve=modelo_db.roc_curve,
    )
```

- [ ] **Step 3: Run Backend Typecheck & Lint**

Run: `npm run lint:api && npm run typecheck:api`
Expected: No errors found.

- [ ] **Step 4: Commit**

```bash
git add apps/server/src/schemas/dashboard.py apps/server/src/api/routes/models.py
git commit -m "feat(api): expose confusion_matrix and roc_curve in ModelMetrics"
```

---

### Task 4: Regenerate Frontend API Client & Build UI Components

**Files:**
- Modify (generated): `apps/web/src/generated/` (via `npm run generate:api`)
- Create: `apps/web/src/components/models/confusion-matrix-card.tsx`
- Create: `apps/web/src/components/models/roc-curve-card.tsx`

**Interfaces:**
- Consumes: `ModelMetrics` generated types with `confusion_matrix` and `roc_curve`.

- [ ] **Step 1: Regenerate API Client via Orval**

Run: `npm run generate:api`
Expected: Orval updates OpenAPI types and React Query hooks in `apps/web/src/generated/`.

- [ ] **Step 2: Create `ConfusionMatrixCard` component**

Create `apps/web/src/components/models/confusion-matrix-card.tsx`:
```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ConfusionMatrixCardProps {
  matrix?: {
    tn: number;
    fp: number;
    fn: number;
    tp: number;
  } | null;
}

export function ConfusionMatrixCard({ matrix }: ConfusionMatrixCardProps) {
  if (!matrix) return null;

  const total = matrix.tn + matrix.fp + matrix.fn + matrix.tp;
  const getPct = (val: number) => (total > 0 ? ((val / total) * 100).toFixed(1) : '0');

  return (
    <Card className="p-6">
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-base font-semibold">Matriz de Confusão</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-2 gap-3">
          {/* True Negative */}
          <div className="flex flex-col gap-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-900 dark:text-emerald-200">
            <span className="text-xs font-medium opacity-80">Verdadeiro Negativo (TN)</span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-2xl font-bold">{matrix.tn}</span>
              <span className="text-xs font-semibold">{getPct(matrix.tn)}%</span>
            </div>
            <span className="text-[10px] opacity-70">Sem Doença → Corretamente previsto</span>
          </div>

          {/* False Positive */}
          <div className="flex flex-col gap-1 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-amber-900 dark:text-amber-200">
            <span className="text-xs font-medium opacity-80">Falso Positivo (FP)</span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-2xl font-bold">{matrix.fp}</span>
              <span className="text-xs font-semibold">{getPct(matrix.fp)}%</span>
            </div>
            <span className="text-[10px] opacity-70">Sem Doença → Previsto com doença</span>
          </div>

          {/* False Negative */}
          <div className="flex flex-col gap-1 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-rose-900 dark:text-rose-200">
            <span className="text-xs font-medium opacity-80">Falso Negativo (FN)</span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-2xl font-bold">{matrix.fn}</span>
              <span className="text-xs font-semibold">{getPct(matrix.fn)}%</span>
            </div>
            <span className="text-[10px] opacity-70">Com Doença → Não detectado</span>
          </div>

          {/* True Positive */}
          <div className="flex flex-col gap-1 rounded-xl border border-primary/30 bg-primary/10 p-3 text-primary">
            <span className="text-xs font-medium opacity-80">Verdadeiro Positivo (TP)</span>
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-2xl font-bold">{matrix.tp}</span>
              <span className="text-xs font-semibold">{getPct(matrix.tp)}%</span>
            </div>
            <span className="text-[10px] opacity-70">Com Doença → Corretamente previsto</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 3: Create `RocCurveCard` component**

Create `apps/web/src/components/models/roc-curve-card.tsx`:
```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface RocPoint {
  fpr: number;
  tpr: number;
}

interface RocCurveCardProps {
  rocCurve?: RocPoint[] | null;
  aucRoc?: number;
}

export function RocCurveCard({ rocCurve, aucRoc }: RocCurveCardProps) {
  if (!rocCurve || rocCurve.length === 0) return null;

  // Add random baseline reference line points if needed
  const chartData = rocCurve.map((pt) => ({
    fpr: pt.fpr,
    tpr: pt.tpr,
    baseline: pt.fpr,
  }));

  return (
    <Card className="p-6">
      <CardHeader className="flex flex-row items-center justify-between p-0 pb-4">
        <CardTitle className="text-base font-semibold">Curva ROC</CardTitle>
        {aucRoc !== undefined && (
          <Badge variant="outline" className="font-mono">
            AUC: {(aucRoc * 100).toFixed(1)}%
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="fpr"
                type="number"
                domain={[0, 1]}
                tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
                fontSize={11}
              />
              <YAxis
                dataKey="tpr"
                type="number"
                domain={[0, 1]}
                tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
                fontSize={11}
              />
              <Tooltip
                formatter={(value: any, name: any) => [
                  `${(Number(value) * 100).toFixed(1)}%`,
                  name === 'tpr' ? 'Sensibilidade (TPR)' : 'Acaso',
                ]}
                labelFormatter={(label) => `FPR: ${(Number(label) * 100).toFixed(1)}%`}
              />
              <Line
                type="monotone"
                dataKey="baseline"
                stroke="var(--muted-foreground)"
                strokeDasharray="4 4"
                dot={false}
                strokeWidth={1.5}
                name="baseline"
              />
              <Line
                type="monotone"
                dataKey="tpr"
                stroke="var(--primary)"
                strokeWidth={2.5}
                dot={false}
                name="tpr"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 4: Commit UI components**

```bash
git add apps/web/src/components/models/ apps/web/src/generated/
git commit -m "feat(web): add ConfusionMatrixCard and RocCurveCard components"
```

---

### Task 5: Integrate Components into Models Page & Verify

**Files:**
- Modify: `apps/web/src/routes/models/index.tsx`

**Interfaces:**
- Consumes: `ConfusionMatrixCard`, `RocCurveCard`, `useGetMetricsModelsModelIdMetricsGet`

- [ ] **Step 1: Update `apps/web/src/routes/models/index.tsx` to render Confusion Matrix & ROC Curve cards**

Import components and add them to the page layout alongside performance metrics:

```tsx
import { ConfusionMatrixCard } from '../../components/models/confusion-matrix-card';
import { RocCurveCard } from '../../components/models/roc-curve-card';
```

In `ModelsPage`:
Render `<ConfusionMatrixCard matrix={metrics?.confusion_matrix} />` and `<RocCurveCard rocCurve={metrics?.roc_curve} aucRoc={metrics?.auc_roc} />` in the details section of the active/selected model.

- [ ] **Step 2: Run Full Project Typecheck and Formatting**

Run: `npm run typecheck && npm run lint`
Expected: Both frontend and backend pass without errors or warnings.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/routes/models/index.tsx
git commit -m "feat(web): integrate confusion matrix and ROC curve into models page"
```
