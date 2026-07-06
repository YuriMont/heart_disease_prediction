## Context

O CardioPredict atualmente permite dois caminhos para predição de risco cardíaco: (1) fluxo completo via `POST /evaluations` que exige `paciente_id` e persiste resultados, e (2) `POST /predict` que aceita dados avulsos sem vínculo com paciente. No frontend, a rota `/evaluation/` é acessível diretamente sem exigir que o usuário selecione ou cadastre um paciente primeiro. Isso gera avaliações órfãs sem rastreabilidade.

## Goals / Non-Goals

**Goals:**
- Todo fluxo de avaliação deve exigir um paciente cadastrado
- Unificar `POST /predict` com `POST /evaluations`, exigindo `paciente_id` e persistindo resultados
- Adicionar guardrail de navegação para impedir acesso a `/evaluation/` sem paciente
- Adicionar ação "Nova Avaliação" na listagem de pacientes (`/patients/`)

**Non-Goals:**
- Não alterar o modelo preditivo ou a lógica de ML
- Não modificar o dashboard ou relatórios
- Não implementar autenticação/autorização de usuários

## Decisions

1. **Modificar `POST /predict` para exigir `paciente_id` e persistir**
   - *Alternativa considerada*: Remover o endpoint e usar apenas `/evaluations`
   - *Decisão*: Manter `POST /predict` mas torná-lo equivalente a `POST /evaluations` — exige `paciente_id` obrigatório, persiste a avaliação no banco e retorna o resultado. O nome `/predict` é mais semântico para o domínio (predição de risco cardíaco) e já é usado pelo frontend. Evita quebra de API desnecessária.

2. **Contexto de paciente via estado da aplicação (Jotai)**
   - *Alternativa considerada*: Passar `paciente_id` como query param na URL
   - *Decisão*: Usar estado global Jotai (`selectedPatientAtom`) para manter o paciente selecionado. A URL permanece limpa e o estado persiste durante a sessão. Query params seriam frágeis com navegação e recarregamento.

3. **Guardrail de rota com componente wrapper**
   - *Alternativa considerada*: Middleware de rota no TanStack Router
   - *Decisão*: Criar um componente `RequirePatientGuard` que envolve a rota `/evaluation/` e redireciona para `/patients/` se nenhum paciente estiver selecionado. TanStack Router não tem middleware nativo, então um componente wrapper é mais simples e explícito.

4. **Tela dedicada de cadastro de paciente (`/patients/new`)**
   - *Alternativa considerada*: Modal/dialog na própria listagem de pacientes
   - *Decisão*: Rota dedicada para cadastro. O formulário reutilizará o padrão visual de cards com ícone já usado no `form-wizard.tsx` (seção "Dados Demográficos"). Inclui campo `name` (opcional) além de `age` e `sex`. Após salvar, redireciona para `/patients/`.

5. **Select de pacientes na tela de avaliação**
   - *Alternativa considerada*: Input de busca com autocomplete
   - *Decisão*: Usar componente `Select` (Radix UI via `apps/web/src/components/ui/`) que lista pacientes em um dropdown. O paciente selecionado é armazenado no `selectedPatientAtom` (Jotai). O formulário de avaliação passa a receber o paciente do estado em vez de criar um novo.

6. **Remover criação de paciente do `form-wizard.tsx`**
   - *Decisão*: O wizard de avaliação não criará mais paciente. O `handleSubmit` usará o `paciente_id` do `selectedPatientAtom`. O paciente deve ser cadastrado previamente em `/patients/new` ou selecionado na lista.

7. **Ação "Nova Avaliação" redireciona com paciente pré-selecionado**
   - *Decisão*: Na página `/patients/`, cada linha de paciente terá um botão "Avaliar" que seta o paciente no `selectedPatientAtom` e navega para `/evaluation/`. O formulário de avaliação usará esse paciente pré-selecionado.

## Risks / Trade-offs

- **[Quebra de API]** Adicionar `paciente_id` obrigatório ao `POST /predict` é breaking change → Mitigação: frontend e eventuais consumidores precisam ser atualizados para enviar o campo. O endpoint continua existindo, então a mudança é aditiva no contrato.
- **[Estado Jotai volátil]** Paciente selecionado é perdido ao recarregar a página → Mitigação: aceitável, redireciona para `/patients/` com guardrail
- **[Regressão em testes]** Testes existentes do `/predict` precisam ser migrados → Mitigação: atualizar testes para usar `/evaluations`
