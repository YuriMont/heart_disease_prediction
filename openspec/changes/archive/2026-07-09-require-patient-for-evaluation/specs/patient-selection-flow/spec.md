## ADDED Requirements

### Requirement: Avaliação usa paciente pré-cadastrado
O sistema SHALL usar o paciente do `selectedPatientAtom` ao criar uma avaliação, em vez de criar um novo paciente.

#### Scenario: Submeter avaliação com paciente selecionado
- **WHEN** usuário submete o formulário de avaliação com um paciente selecionado
- **THEN** sistema envia `POST /evaluations` com o `paciente_id` do paciente selecionado (sem criar novo paciente)

### Requirement: Seleção de paciente como pré-condição para avaliação
O sistema SHALL exigir que um paciente esteja selecionado ou cadastrado antes de permitir acesso ao formulário de avaliação.

#### Scenario: Acesso sem paciente selecionado
- **WHEN** usuário navega para `/evaluation/` sem ter um paciente selecionado
- **THEN** sistema redireciona para `/patients/`

#### Scenario: Acesso com paciente selecionado
- **WHEN** usuário navega para `/evaluation/` com um paciente selecionado
- **THEN** sistema exibe o formulário de avaliação com o paciente pré-selecionado

### Requirement: Ação "Nova Avaliação" na listagem de pacientes
O sistema SHALL exibir um botão "Avaliar" para cada paciente na listagem que permite iniciar uma avaliação com aquele paciente.

#### Scenario: Iniciar avaliação a partir da listagem
- **WHEN** usuário clica em "Avaliar" em um paciente na listagem
- **THEN** sistema seleciona o paciente, navega para `/evaluation/` e exibe o formulário com o paciente pré-selecionado

### Requirement: Unificação do endpoint de predição
O sistema SHALL modificar `POST /predict` para exigir `paciente_id` obrigatório e persistir a avaliação no banco.

#### Scenario: Predição com paciente existente
- **WHEN** cliente envia `POST /predict` com `paciente_id` válido e dados clínicos
- **THEN** sistema persiste a avaliação, executa a predição e retorna o resultado

#### Scenario: Predição sem paciente
- **WHEN** cliente envia `POST /predict` sem `paciente_id`
- **THEN** sistema retorna erro de validação (422) exigindo o campo

### Requirement: Select de paciente na tela de avaliação
O sistema SHALL exibir um componente `Select` na tela de avaliação para o usuário escolher um paciente cadastrado antes de preencher os dados clínicos.

#### Scenario: Selecionar paciente no dropdown
- **WHEN** usuário acessa `/evaluation/` com pacientes cadastrados
- **THEN** sistema exibe um dropdown listando todos os pacientes (nome, idade, sexo)

#### Scenario: Avaliação sem paciente selecionado no select
- **WHEN** usuário tenta submeter o formulário de avaliação sem selecionar um paciente no dropdown
- **THEN** sistema exibe erro e impede submissão

### Requirement: Estado de paciente selecionado na sessão
O sistema SHALL manter o paciente selecionado em estado global (Jotai) durante a sessão do usuário.

#### Scenario: Paciente mantido entre navegações
- **WHEN** usuário seleciona um paciente e navega entre páginas
- **THEN** sistema mantém o paciente selecionado

#### Scenario: Recarregamento da página
- **WHEN** usuário recarrega a página
- **THEN** sistema perde o estado do paciente selecionado e redireciona para `/patients/`
