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
import {
  useCreateEvaluationEvaluationsPost,
  useListPatientsPatientsGet,
} from '../../generated/api/patients/patients';
import { modelAtom } from '../../store/model';
import { selectedPatientAtom } from '../../atoms/patient';
import { useAtom } from 'jotai';
import { useListModelsModelsGet } from '../../generated/api/models/models';
import { CreateEvaluationEvaluationsPostBody } from '../../generated/api/patients/patients.zod';

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
  const { data: patients = [] } = useListPatientsPatientsGet();

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
    <div className="flex flex-col gap-[22px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-[5px]">
          <div className="flex items-center gap-[7px] text-xs">
            <span className="text-muted-foreground">Painel</span>
            <span className="text-muted-foreground">/</span>
            <span className="font-semibold text-primary">Nova Avaliação</span>
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Avaliação de Risco Cardiovascular
          </h1>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-[9px]">
          <Activity className="h-[15px] w-[15px] text-primary" />
          <span className="text-[13px] font-semibold text-primary">
            Entrada de dados clínicos
          </span>
        </div>
      </div>

      <div className="flex gap-[22px]">
        {/* Form Column */}
        <div className="flex flex-1 flex-col gap-5">
          {/* Patient Select */}
          <div className="flex flex-col gap-[18px] rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-primary/10">
                <UserRound className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="font-heading text-base font-bold text-foreground">
                  Paciente
                </span>
                <span className="text-xs text-muted-foreground">
                  Paciente em avaliação
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-[13px] font-semibold text-muted-foreground">
                Selecionar Paciente
              </Label>
              <Select
                value={selectedPatient?.id ?? ''}
                onValueChange={(value: string) => {
                  const patient = patients.find((p) => p.id === value);
                  if (patient) setSelectedPatient(patient);
                }}
              >
                <SelectTrigger className="w-full rounded-[0.5rem]">
                  <SelectValue placeholder="Selecione um paciente..." />
                </SelectTrigger>
                <SelectContent className="rounded-[0.5rem]">
                  {patients.map((patient) => (
                    <SelectItem
                      className="rounded-[0.5rem]"
                      key={patient.id}
                      value={patient.id}
                    >
                      {patient.name ?? 'Sem nome'} — {patient.age} anos (
                      {patient.sex === 1 ? 'M' : 'F'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Section 1 - Biometric Data */}
          <div className="flex flex-col gap-[18px] rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-primary/10">
                <HeartPulse className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="font-heading text-base font-bold text-foreground">
                  Dados Biométricos
                </span>
                <span className="text-xs text-muted-foreground">
                  Medidas clínicas do paciente
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="flex flex-1 flex-col gap-1">
                  <Label className="text-[13px] font-semibold text-muted-foreground">
                    Pressão Arterial em Repouso
                  </Label>
                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted px-3">
                    <Input
                      type="number"
                      required
                      placeholder="Ex.: 120"
                      value={values.trestbps || ''}
                      onChange={(e) =>
                        setValue('trestbps', Number(e.target.value))
                      }
                      className="w-full border-0 bg-transparent p-0 text-sm font-medium text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <span className="text-[13px] text-muted-foreground">
                      mmHg
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <Label className="text-[13px] font-semibold text-muted-foreground">
                    Frequência Cardíaca Máxima
                  </Label>
                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted px-3">
                    <Input
                      type="number"
                      required
                      placeholder="Ex.: 150"
                      value={values.thalach || ''}
                      onChange={(e) =>
                        setValue('thalach', Number(e.target.value))
                      }
                      className="w-full border-0 bg-transparent p-0 text-sm font-medium text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <span className="text-[13px] text-muted-foreground">
                      bpm
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-1 flex-col gap-1">
                  <Label className="text-[13px] font-semibold text-muted-foreground">
                    Colesterol Total
                  </Label>
                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted px-3">
                    <Input
                      type="number"
                      required
                      placeholder="Ex.: 200"
                      value={values.chol || ''}
                      onChange={(e) => setValue('chol', Number(e.target.value))}
                      className="w-full border-0 bg-transparent p-0 text-sm font-medium text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <span className="text-[13px] text-muted-foreground">
                      mg/dL
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 - Heart Exams */}
          <div className="flex flex-col gap-[18px] rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-primary/10">
                <HeartPulse className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="font-heading text-base font-bold text-foreground">
                  Exames Cardíacos
                </span>
                <span className="text-xs text-muted-foreground">
                  Resultados de exames clínicos específicos
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
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
              <div className="flex gap-4">
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
              <div className="flex gap-4">
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
              <div className="flex gap-4">
                <div className="flex flex-1 flex-col gap-1">
                  <Label className="text-[13px] font-semibold text-muted-foreground">
                    Depressão do Segmento ST
                  </Label>
                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted px-3">
                    <Input
                      type="number"
                      step="0.1"
                      required
                      placeholder="Ex.: 1.5"
                      value={values.oldpeak || ''}
                      onChange={(e) =>
                        setValue('oldpeak', Number(e.target.value))
                      }
                      className="w-full border-0 bg-transparent p-0 text-sm font-medium text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <span className="text-[13px] text-muted-foreground">
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
          <div className="flex items-center justify-between px-1 pt-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-[15px] w-[15px] text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Dados protegidos · processados conforme LGPD
              </span>
            </div>
            <Button
              variant="outline"
              onClick={handleClear}
              className="gap-2 rounded-xl"
            >
              <Eraser className="h-[17px] w-[17px]" />
              Limpar Dados
            </Button>
          </div>
        </div>

        {/* Info Column */}
        <div className="flex w-[330px] flex-col gap-4">
          {/* ControlPanel */}
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-[22px]">
            <div className="flex items-center gap-[11px]">
              <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-gradient-to-br from-primary to-primary/70">
                <Cpu className="h-[19px] w-[19px] text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-[15px] font-bold text-foreground">
                  Modelo de IA
                </span>
                <span className="text-xs text-muted-foreground">
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
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-[11px] transition-all ${
                    selectedModel?.name === model.name
                      ? 'border border-primary bg-primary/10'
                      : 'border border-border bg-muted'
                  }`}
                >
                  <div className="flex flex-1 flex-col items-start gap-[1px]">
                    <span className="text-[13px] font-semibold text-foreground">
                      {model.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {model.description}
                    </span>
                  </div>
                  {selectedModel?.name === model.name ? (
                    <CircleCheckBig className="h-[18px] w-[18px] text-primary shrink-0" />
                  ) : (
                    <Circle className="h-[18px] w-[18px] text-muted-foreground shrink-0" />
                  )}
                </button>
              ))}
            </div>

            <div className="h-px w-full bg-border" />

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={createEvaluation.isPending}
              className="flex w-full items-center justify-center gap-[9px] rounded-xl bg-primary px-0 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Sparkles className="h-[18px] w-[18px]" />
              {createEvaluation.isPending
                ? 'Processando...'
                : 'Executar Predição'}
            </button>
          </div>

          {/* VariablesGuide */}
          <div className="flex flex-1 flex-col gap-[18px] rounded-2xl border border-border bg-card p-[22px]">
            <div className="flex items-center gap-[11px]">
              <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-gradient-to-br from-primary to-primary/70">
                <ListChecks className="h-[19px] w-[19px] text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-[15px] font-bold text-foreground">
                  Legenda de Exames
                </span>
                <span className="text-xs text-muted-foreground">
                  Significados dos códigos
                </span>
              </div>
            </div>

            <div className="h-px w-full bg-border" />

            <div className="flex flex-1 flex-col gap-[18px]">
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
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex flex-col gap-[3px]">
                    <span className="text-[13px] font-semibold text-foreground">
                      {item.title}
                    </span>
                    <span className="text-xs leading-relaxed text-muted-foreground">
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
