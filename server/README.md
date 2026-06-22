# Server — Predição de Doença Cardíaca 🫀

API simples, em Python, que usa **machine learning** para prever se um paciente
tem risco de doença cardíaca, a partir de dados clínicos (idade, pressão,
colesterol, exames...).

Este projeto foi pensado para **iniciantes**: cada arquivo cuida de uma parte e
tem comentários explicando o que faz.

---

## 📁 Estrutura das pastas

```
server/
├── README.md              # este guia
├── pyproject.toml         # lista das bibliotecas que o projeto usa
├── api.py                 # cria o app e conecta as rotas (como o server.js do Express)
├── servico.py             # lógica de previsão (carrega os modelos e prevê)
├── esquemas.py            # formato dos dados de entrada (validação - Pydantic)
├── treinar.py             # script que treina os modelos e gera os .pkl
│
├── rotas/                 # arquivos de rotas (como a pasta routes/ do Express)
│   ├── paginas.py         # rotas /  e  /scalar
│   └── previsao.py        # rotas /modelos  e  /prever
│
├── ml/                    # o "miolo" de machine learning
│   ├── dados.py           # baixa e prepara os dados
│   ├── modelos.py         # define os modelos (KNN, SVM, Random Forest, Ensemble)
│   └── avaliacao.py       # mede se o modelo está acertando
│
├── artefatos/             # modelos já treinados (.pkl) — a API lê daqui
│   ├── knn.pkl
│   ├── svm.pkl
│   ├── random_forest.pkl
│   ├── ensemble.pkl
│   ├── scaler.pkl
│   └── feature_names.pkl
│
├── exemplos/
│   └── paciente.json      # um exemplo de dados para testar a API
│
└── notebooks/             # cadernos Jupyter usados na pesquisa/exploração
```

---

## ✅ O que você precisa instalar

Apenas o **uv**, um gerenciador de Python que cuida de tudo (instala o Python
certo e as bibliotecas automaticamente).

- Windows (PowerShell):
  ```powershell
  powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
  ```
- Mais informações: https://docs.astral.sh/uv/

> Não precisa instalar Python nem criar ambiente virtual na mão — o `uv` faz isso.

---

## ▶️ Como rodar a API (passo a passo)

1. Abra o terminal **dentro da pasta `server`**.
2. Rode:
   ```bash
   uv run uvicorn api:app --reload
   ```
   Na primeira vez o `uv` baixa as bibliotecas (demora um pouquinho).
3. Quando aparecer `Application startup complete`, abra no navegador:

   👉 **http://127.0.0.1:8000/scalar**

Essa página é gerada automaticamente. Nela você clica em **POST /prever**,
já vem um exemplo preenchido, e é só executar para ver a resposta.

### Páginas de documentação disponíveis

A API gera, sozinha, três interfaces para você ler e testar tudo:

| Endereço   | Interface | Observação                         |
|------------|-----------|------------------------------------|
| `/scalar`  | Scalar    | mais moderna (alternativa ao Swagger) |
| `/docs`    | Swagger   | a padrão do FastAPI                |
| `/redoc`   | ReDoc     | só leitura, sem botão de testar    |

---

## 🔮 Testando pelo terminal (opcional)

Com a API rodando, em outro terminal:

```bash
curl -X POST "http://127.0.0.1:8000/prever" ^
     -H "Content-Type: application/json" ^
     -d @exemplos/paciente.json
```

Resposta parecida com:

```json
{
  "modelo_usado": "ensemble",
  "tem_doenca": false,
  "probabilidade_doenca": 0.18,
  "resultado": "Sem indício de doença"
}
```

Quer usar outro modelo? Adicione `?modelo=...` na URL. Opções: `knn`, `svm`,
`random_forest`, `ensemble`. Exemplo: `/prever?modelo=random_forest`.

---

## 🧠 As rotas da API

| Método | Rota        | O que faz                                            |
|--------|-------------|------------------------------------------------------|
| GET    | `/`         | Confirma que a API está no ar                        |
| GET    | `/modelos`  | Lista os modelos disponíveis                         |
| POST   | `/prever`   | Recebe um paciente e devolve a previsão              |

---

## 📋 Campos do paciente (entrada do `/prever`)

| Campo      | Significado                                       | Valores         |
|------------|---------------------------------------------------|-----------------|
| `age`      | Idade em anos                                     | ex.: 54         |
| `sex`      | Sexo                                              | 1 = masc, 0 = fem |
| `cp`       | Tipo de dor no peito                              | 1 a 4           |
| `trestbps` | Pressão arterial em repouso (mm Hg)               | ex.: 130        |
| `chol`     | Colesterol (mg/dl)                                | ex.: 250        |
| `fbs`      | Glicemia em jejum > 120 mg/dl                     | 1 = sim, 0 = não |
| `restecg`  | Eletrocardiograma em repouso                      | 0 a 2           |
| `thalach`  | Frequência cardíaca máxima atingida               | ex.: 150        |
| `exang`    | Angina induzida por exercício                     | 1 = sim, 0 = não |
| `oldpeak`  | Depressão do segmento ST no exercício             | ex.: 1.5        |
| `slope`    | Inclinação do segmento ST                         | 1 a 3           |
| `ca`       | Nº de vasos principais coloridos                  | 0 a 3           |
| `thal`     | Talassemia                                        | 3, 6 ou 7       |

---

## 🏋️ Re-treinar os modelos (opcional)

Os modelos treinados já vêm prontos na pasta `artefatos/`, então **não é
obrigatório**. Mas se quiser treinar de novo (por exemplo, depois de mudar algo
em `ml/`), rode:

```bash
uv run python treinar.py
```

Isso baixa os dados, treina os 4 modelos e salva tudo em `artefatos/`.
Pode demorar alguns minutos.

---

## ⚠️ Aviso

Este projeto é **acadêmico/educacional**. Não deve ser usado para diagnóstico
médico real. É apenas uma ferramenta de apoio e estudo.
