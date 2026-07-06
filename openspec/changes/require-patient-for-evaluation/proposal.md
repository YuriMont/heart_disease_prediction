## Why

Atualmente é possível acessar o formulário de avaliação sem um paciente selecionado, e o endpoint `/predict` permite predições avulsas sem vínculo com paciente. Isso compromete a rastreabilidade clínica — toda avaliação de risco cardíaco deve estar associada a um paciente cadastrado para permitir histórico, acompanhamento e auditoria.

## What Changes

- Criar tela dedicada de cadastro de paciente com campos `name`, `age`, `sex` (rota `/patients/new`)
- Adicionar `Select` de pacientes na tela de avaliação para escolher um paciente existente antes de preencher os dados clínicos
- Impedir acesso direto à rota de avaliação (`/evaluation/`) sem um paciente selecionado
- Modificar `POST /predict` para exigir `paciente_id` obrigatório e persistir a avaliação no banco (comportamento equivalente a `POST /evaluations`)
- Adicionar ação "Nova Avaliação" por paciente na listagem (`/patients/`)
- Tornar o botão "Novo Paciente" funcional na listagem de pacientes

## Capabilities

### New Capabilities
- `patient-selection-flow`: fluxo de seleção/criação de paciente como pré-requisito para avaliação
- `patient-registration`: cadastro dedicado de pacientes com nome, idade e sexo

### Modified Capabilities
- *(nenhuma — não existem specs definidas ainda)*

## Impact

- **Backend**: `POST /predict` — adicionar `paciente_id` obrigatório e persistir resultado no banco
- **Frontend**: nova rota `/patients/new` com formulário de cadastro; rota `/evaluation/` — adicionar `Select` de pacientes e guardrail; página `/patients/` — tornar botão "Novo Paciente" funcional e adicionar ação "Nova Avaliação" por paciente; remover criação automática de paciente do wizard
- **API Client**: gerar novamente via Orval após mudanças no schema OpenAPI
- **Testes**: atualizar testes existentes e adicionar testes para novo fluxo
