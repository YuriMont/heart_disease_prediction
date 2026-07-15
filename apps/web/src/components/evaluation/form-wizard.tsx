import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from '@tanstack/react-router';
import {
  UserRound,
  HeartPulse,
  Activity,
  Eraser,
  Sparkles,
  ShieldCheck,
  Cpu,
  ListChecks,
  CircleCheckBig,
  Circle,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Segmented } from '../ui/segmented';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useCreateEvaluationEvaluationsPost } from '../../generated/api/evaluations/evaluations';
import { useListPatientsPatientsGet } from '../../generated/api/patients/patients';
import { modelAtom } from '../../store/model';
import { selectedPatientAtom } from '../../atoms/patient';
import { useAtom } from 'jotai';
import { useListModelsModelsGet } from '../../generated/api/models/models';
import { CreateEvaluationEvaluationsPostBody } from '../../generated/api/evaluations/evaluations.zod';

type FormData = z.infer<typeof CreateEvaluationEvaluationsPostBody>;

const DEFAULT_VALUES_FORM = {
  age: 0,
  sex: 0,
  trestbps: 0,
  thalach: 0,
  chol: 0,
  cp: 1,
  restecg: 0,
  slope: 1,
  thal: 3,
  fbs: 0,
  exang: 0,
  oldpeak: 0,
  ca: 0,
};

export function EvaluationForm() {
  const [selectedModel, setSelectedModel] = useAtom(modelAtom);
  const [selectedPatient, setSelectedPatient] = useAtom(selectedPatientAtom);

  const { data: models = [] } = useListModelsModelsGet();
  const { data: patientsData } = useListPatientsPatientsGet();
  const patients = patientsData?.data ?? [];

  const navigate = useNavigate();

  const createEvaluation = useCreateEvaluationEvaluationsPost();

  const form = useForm<FormData>({
    resolver: zodResolver(CreateEvaluationEvaluationsPostBody),
    defaultValues: DEFAULT_VALUES_FORM,
  });

  const { setValue } = form;

  const values = form.watch();

  useEffect(() => {
    if (selectedPatient) {
      setValue('paciente_id', selectedPatient.id);
      setValue('age', selectedPatient.age);
      setValue('sex', selectedPatient.sex);
    }
  }, [selectedPatient, setValue]);

  const handleSubmit = async () => {
    if (!selectedPatient) return;
    try {
      const evaluation = await createEvaluation.mutateAsync({
        data: {
          ...values,
          model_id: selectedModel!.id,
        },
      });
      navigate({ to: `/evaluation/${evaluation.id}` });
    } catch (error) {
      console.error('Error creating evaluation:', error);
    }
  };

  const handleClear = () => {
    form.reset(DEFAULT_VALUES_FORM);
  };

  return (
    <div className="flex max-w-full flex-col gap-[1.375rem] overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-[0.3125rem]">
          <div className="flex items-center gap-[0.4375rem] text-xs">
            <span className="text-muted-foreground">Painel</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-primary font-semibold">Nova Avaliação</span>
          </div>
          <h1 className="font-heading text-foreground text-xl font-bold tracking-tight sm:text-2xl">
            Avaliação de Risco Cardiovascular
          </h1>
        </div>
        <div className="bg-primary/10 flex items-center gap-2 self-start rounded-full px-4 py-[0.5625rem] sm:self-auto">
          <Activity className="text-primary h-[0.9375rem] w-[0.9375rem]" />
          <span className="text-primary text-[0.8125rem] font-semibold whitespace-nowrap">
            Entrada de dados clínicos
          </span>
        </div>
      </div>

      <div className="flex max-w-full flex-col gap-[1.375rem] overflow-x-hidden xl:flex-row">
        {/* Form Column */}
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          {/* Patient Select */}
          <div className="border-border bg-card flex flex-col gap-[1.125rem] rounded-2xl border p-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-[0.625rem]">
                <UserRound className="text-primary h-5 w-5" />
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="font-heading text-foreground text-base font-bold">
                  Paciente
                </span>
                <span className="text-muted-foreground text-xs">
                  Paciente em avaliação
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-muted-foreground text-[0.8125rem] font-semibold">
                Selecionar Paciente
              </Label>
              <div className="">
                <Select
                  value={selectedPatient?.id ?? ''}
                  onValueChange={(value: string) => {
                    const patient = patients.find((p) => p.id === value);
                    if (patient) setSelectedPatient(patient);
                  }}
                >
                  <SelectTrigger className="w-full rounded-[0.5rem] [&>[data-slot=select-value]>span]:truncate">
                    <SelectValue placeholder="Selecione um paciente...">
                      <span className="block truncate">
                        {selectedPatient?.name ?? ''}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="overflow-hidden rounded-[0.5rem]">
                    {patients.map((patient) => (
                      <SelectItem
                        className="min-w-0 rounded-[0.5rem]"
                        key={patient.id}
                        value={patient.id}
                      >
                        <span className="block min-w-0 truncate max-md:max-w-75">
                          {patient.name ?? 'Sem nome'} — {patient.age} anos (
                          {patient.sex === 1 ? 'M' : 'F'})
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Section 1 - Biometric Data */}
          <div className="border-border bg-card flex flex-col gap-[1.125rem] rounded-2xl border p-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-[0.625rem]">
                <HeartPulse className="text-primary h-5 w-5" />
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="font-heading text-foreground text-base font-bold">
                  Dados Biométricos
                </span>
                <span className="text-muted-foreground text-xs">
                  Medidas clínicas do paciente
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex flex-1 flex-col gap-1">
                  <Label className="text-muted-foreground text-[0.8125rem] font-semibold">
                    Pressão Arterial em Repouso
                  </Label>
                  <div className="border-border bg-muted flex items-center justify-between rounded-lg border px-3">
                    <Input
                      type="number"
                      required
                      placeholder="Ex.: 120"
                      value={values.trestbps || ''}
                      onChange={(e) =>
                        setValue('trestbps', Number(e.target.value))
                      }
                      className="text-foreground w-full border-0 bg-transparent p-0 text-sm font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <span className="text-muted-foreground text-[0.8125rem]">
                      mmHg
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <Label className="text-muted-foreground text-[0.8125rem] font-semibold">
                    Frequência Cardíaca Máxima
                  </Label>
                  <div className="border-border bg-muted flex items-center justify-between rounded-lg border px-3">
                    <Input
                      type="number"
                      required
                      placeholder="Ex.: 150"
                      value={values.thalach || ''}
                      onChange={(e) =>
                        setValue('thalach', Number(e.target.value))
                      }
                      className="text-foreground w-full border-0 bg-transparent p-0 text-sm font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <span className="text-muted-foreground text-[0.8125rem]">
                      bpm
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex flex-1 flex-col gap-1">
                  <Label className="text-muted-foreground text-[0.8125rem] font-semibold">
                    Colesterol Total
                  </Label>
                  <div className="border-border bg-muted flex items-center justify-between rounded-lg border px-3">
                    <Input
                      type="number"
                      required
                      placeholder="Ex.: 200"
                      value={values.chol || ''}
                      onChange={(e) => setValue('chol', Number(e.target.value))}
                      className="text-foreground w-full border-0 bg-transparent p-0 text-sm font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <span className="text-muted-foreground text-[0.8125rem]">
                      mg/dL
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 - Heart Exams */}
          <div className="border-border bg-card flex flex-col gap-[1.125rem] rounded-2xl border p-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-[0.625rem]">
                <HeartPulse className="text-primary h-5 w-5" />
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="font-heading text-foreground text-base font-bold">
                  Exames Cardíacos
                </span>
                <span className="text-muted-foreground text-xs">
                  Resultados de exames clínicos específicos
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex flex-1 flex-col gap-2">
                  <Segmented
                    label="Tipo de Dor Torácica"
                    options={[
                      { label: 'Típica', value: 1 },
                      { label: 'Atípica', value: 2 },
                      { label: 'Não anginosa', value: 3 },
                      { label: 'Assintomática', value: 4 },
                    ]}
                    value={values.cp}
                    onChange={(v) => setValue('cp', v as number)}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <Segmented
                    label="ECG em Repouso"
                    options={[
                      { label: 'Normal', value: 0 },
                      { label: 'Anormal', value: 1 },
                      { label: 'Hipertrofia', value: 2 },
                    ]}
                    value={values.restecg}
                    onChange={(v) => setValue('restecg', v as number)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex flex-1 flex-col gap-2">
                  <Segmented
                    label="Inclinação do Segmento ST"
                    options={[
                      { label: 'Ascendente', value: 1 },
                      { label: 'Plano', value: 2 },
                      { label: 'Descendente', value: 3 },
                    ]}
                    value={values.slope}
                    onChange={(v) => setValue('slope', v as number)}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <Segmented
                    label="Talassemia"
                    options={[
                      { label: 'Normal', value: 3 },
                      { label: 'Defeito fixo', value: 6 },
                      { label: 'Defeito reversível', value: 7 },
                    ]}
                    value={values.thal}
                    onChange={(v) => setValue('thal', v as number)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex flex-1 flex-col gap-2">
                  <Segmented
                    label="Glicemia em Jejum > 120 mg/dl"
                    options={[
                      { label: 'Sim', value: 1 },
                      { label: 'Não', value: 0 },
                    ]}
                    value={values.fbs}
                    onChange={(v) => setValue('fbs', v as number)}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <Segmented
                    label="Angina Induzida por Exercício"
                    options={[
                      { label: 'Sim', value: 1 },
                      { label: 'Não', value: 0 },
                    ]}
                    value={values.exang}
                    onChange={(v) => setValue('exang', v as number)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex flex-1 flex-col gap-1">
                  <Label className="text-muted-foreground text-[0.8125rem] font-semibold">
                    Depressão do Segmento ST
                  </Label>
                  <div className="border-border bg-muted flex items-center justify-between rounded-lg border px-3">
                    <Input
                      type="number"
                      step="0.1"
                      required
                      placeholder="Ex.: 1.5"
                      value={values.oldpeak || ''}
                      onChange={(e) =>
                        setValue('oldpeak', Number(e.target.value))
                      }
                      className="text-foreground w-full border-0 bg-transparent p-0 text-sm font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <span className="text-muted-foreground text-[0.8125rem]">
                      mm
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <Segmented
                    label="Vasos Principais"
                    options={[
                      { label: '0', value: 0 },
                      { label: '1', value: 1 },
                      { label: '2', value: 2 },
                      { label: '3', value: 3 },
                    ]}
                    value={values.ca}
                    onChange={(v) => setValue('ca', v as number)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 px-1 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-muted-foreground h-[0.9375rem] w-[0.9375rem] shrink-0" />
              <span className="text-muted-foreground text-xs">
                Dados protegidos · processados conforme LGPD
              </span>
            </div>
            <Button
              variant="outline"
              onClick={handleClear}
              className="gap-2 rounded-xl"
            >
              <Eraser className="h-[1.0625rem] w-[1.0625rem]" />
              Limpar Dados
            </Button>
          </div>
        </div>

        {/* Info Column */}
        <div className="flex w-full flex-col gap-4 xl:w-[20.625rem]">
          {/* ControlPanel */}
          <div className="border-border bg-card flex flex-col gap-4 rounded-2xl border p-[1.375rem]">
            <div className="flex items-center gap-[0.6875rem]">
              <div className="from-primary to-primary/70 flex h-[2.375rem] w-[2.375rem] items-center justify-center rounded-[0.625rem] bg-gradient-to-br">
                <Cpu className="text-primary-foreground h-[1.1875rem] w-[1.1875rem]" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-foreground text-[0.9375rem] font-bold">
                  Modelo de IA
                </span>
                <span className="text-muted-foreground text-xs">
                  Algoritmo de Predição
                </span>
              </div>
            </div>

            {/* Model List */}
            <div className="flex flex-col gap-2">
              {models.map((model) => (
                <button
                  key={model.name}
                  type="button"
                  onClick={() => setSelectedModel(model)}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-[0.6875rem] transition-all ${
                    selectedModel?.name === model.name
                      ? 'border-primary bg-primary/10 border'
                      : 'border-border bg-muted border'
                  }`}
                >
                  <div className="flex flex-1 flex-col items-start gap-[0.0625rem]">
                    <span className="text-foreground text-[0.8125rem] font-semibold">
                      {model.name}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {model.description}
                    </span>
                  </div>
                  {selectedModel?.name === model.name ? (
                    <CircleCheckBig className="text-primary h-[1.125rem] w-[1.125rem] shrink-0" />
                  ) : (
                    <Circle className="text-muted-foreground h-[1.125rem] w-[1.125rem] shrink-0" />
                  )}
                </button>
              ))}
            </div>

            <div className="bg-border h-px w-full" />

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={createEvaluation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex w-full items-center justify-center gap-[0.5625rem] rounded-xl px-0 py-3.5 text-sm font-semibold shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Sparkles className="h-[1.125rem] w-[1.125rem]" />
              {createEvaluation.isPending
                ? 'Processando...'
                : 'Executar Predição'}
            </button>
          </div>

          {/* VariablesGuide */}
          <div className="border-border bg-card flex flex-1 flex-col gap-[1.125rem] rounded-2xl border p-[1.375rem]">
            <div className="flex items-center gap-[0.6875rem]">
              <div className="from-primary to-primary/70 flex h-[2.375rem] w-[2.375rem] items-center justify-center rounded-[0.625rem] bg-gradient-to-br">
                <ListChecks className="text-primary-foreground h-[1.1875rem] w-[1.1875rem]" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-foreground text-[0.9375rem] font-bold">
                  Legenda de Exames
                </span>
                <span className="text-muted-foreground text-xs">
                  Significados dos códigos
                </span>
              </div>
            </div>

            <div className="bg-border h-px w-full" />

            <div className="flex flex-1 flex-col gap-[1.125rem]">
              {[
                {
                  icon: HeartPulse,
                  title: 'Tipo de Dor Torácica',
                  desc: 'Típica, atípica, não anginosa ou assintomática',
                },
                {
                  icon: HeartPulse,
                  title: 'Eletrocardiograma',
                  desc: 'Normal, ST-T ou hipertrofia',
                },
                {
                  icon: Activity,
                  title: 'Inclinação ST',
                  desc: 'Ascendente, plano ou descendente',
                },
                {
                  icon: Activity,
                  title: 'Talassemia',
                  desc: 'Normal, defeito fixo ou reversível',
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                    <item.icon className="text-primary h-4 w-4" />
                  </div>
                  <div className="flex flex-col gap-[0.1875rem]">
                    <span className="text-foreground text-[0.8125rem] font-semibold">
                      {item.title}
                    </span>
                    <span className="text-muted-foreground text-xs leading-relaxed">
                      {item.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
