## ADDED Requirements

### Requirement: Tela de cadastro de paciente
O sistema SHALL ter uma rota `/patients/new` com formulário dedicado para cadastro de pacientes com campos `name` (opcional), `age` e `sex`.

#### Scenario: Cadastrar paciente com sucesso
- **WHEN** usuário preenche nome, idade e sexo no formulário e clica em "Salvar"
- **THEN** sistema cria o paciente via `POST /patients`, redireciona para `/patients/` e exibe o novo paciente na listagem

#### Scenario: Cadastrar paciente sem nome
- **WHEN** usuário preenche apenas idade e sexo e clica em "Salvar"
- **THEN** sistema cria o paciente com `name: null` e redireciona para `/patients/`

#### Scenario: Idade inválida
- **WHEN** usuário tenta salvar com idade fora do intervalo 1-120
- **THEN** sistema exibe erro de validação e não cria o paciente

### Requirement: Botão "Novo Paciente" funcional
O sistema SHALL fazer o botão "Novo Paciente" na página `/patients/` navegar para a rota de cadastro `/patients/new`.

#### Scenario: Clicar em Novo Paciente
- **WHEN** usuário clica no botão "Novo Paciente" na listagem
- **THEN** sistema navega para `/patients/new`

### Requirement: Navegação lateral incluir cadastro de paciente
O sistema SHALL manter o link "Pacientes" na sidebar navegando para `/patients/` (listagem), de onde o usuário pode acessar o cadastro.
