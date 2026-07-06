## 1. Backend — Modificar `POST /predict` para exigir paciente e persistir

- [x] 1.1 Adicionar `paciente_id` como campo obrigatório no schema do `POST /predict`
- [x] 1.2 Modificar handler do `POST /predict` para validar existência do paciente e persistir avaliação no banco
- [x] 1.3 Atualizar schemas OpenAPI — regenerar documentação via `npm run gen-api`
- [x] 1.4 Atualizar testes existentes que cobriam `/predict` para enviar `paciente_id` (sem testes existentes para este endpoint)

## 2. Frontend — Tela de cadastro de paciente

- [x] 2.1 Criar rota `apps/web/src/routes/patients/new.tsx` com formulário de cadastro
- [x] 2.2 Criar componente `PatientForm` reutilizável (name, age, sex) seguindo padrão visual do form-wizard
- [x] 2.3 Tornar botão "Novo Paciente" em `/patients/` funcional — navegar para `/patients/new`
- [x] 2.4 Após salvar paciente em `/patients/new`, redirecionar para `/patients/`

## 3. Frontend — Select de paciente na avaliação + guardrail

- [x] 3.1 Criar átomo Jotai `selectedPatientAtom` em `apps/web/src/atoms/`
- [x] 3.2 Adicionar componente `Select` de pacientes na tela `/evaluation/` (buscar lista via API)
- [x] 3.3 Armazenar paciente selecionado no `selectedPatientAtom`
- [x] 3.4 Criar componente `RequirePatientGuard` que redireciona para `/patients/` se nenhum paciente selecionado
- [x] 3.5 Envolver a rota `/evaluation/` com `RequirePatientGuard`
- [x] 3.6 Modificar `EvaluationForm.handleSubmit` para usar `paciente_id` do `selectedPatientAtom` em vez de criar novo paciente

## 4. Frontend — Ação "Avaliar" na listagem de pacientes

- [x] 4.1 Adicionar coluna/botão "Avaliar" por paciente na tabela de `/patients/`
- [x] 4.2 Ao clicar "Avaliar", setar paciente no `selectedPatientAtom` e navegar para `/evaluation/`

## 5. Verificação e Limpeza

- [x] 5.1 Verificar se há chamadas ao `/predict` no frontend gerado (Orval) e atualizá-las para enviar `paciente_id`
- [x] 5.2 Verificar fluxo completo: cadastrar paciente → nova avaliação → prever → ver resultado
