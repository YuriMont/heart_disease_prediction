import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "@tanstack/react-router";
import {
  UserRound,
  HeartPulse,
  Activity,
  Check,
  Eraser,
  Sparkles,
  ShieldCheck,
  Cpu,
  ListChecks,
  CircleCheckBig,
  Circle,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Segmented } from "../ui/segmented";
import {
  useCriarPacientePacientesPost,
  useCriarAvaliacaoAvaliacoesPost,
} from "../../generated/api/pacientes/pacientes";
import type { ModeloInfo } from "../../generated/models";
import { modelAtom } from "../../store/model";
import { useAtom } from "jotai";
import { useListarModelosModelosGet } from "../../generated/api/modelos/modelos";

const formSchema = z.object({
  age: z.number().min(1).max(120),
  sex: z.number(),
  trestbps: z.number().min(60).max(250),
  thalach: z.number().min(40).max(250),
  chol: z.number().min(100).max(600),
  cp: z.number(),
  restecg: z.number(),
  slope: z.number(),
  thal: z.number(),
  fbs: z.number(),
  exang: z.number(),
  oldpeak: z.number().min(0).max(10),
  ca: z.number().min(0).max(3),
});

type FormData = z.infer<typeof formSchema>;

const steps = [
  { label: "Dados do paciente", num: 1 },
  { label: "Medições clínicas", num: 2 },
  { label: "Exames cardíacos", num: 3 },
];


export function AvaliacaoForm() {
  const [selectedModel, setSelectedModel] = useAtom(modelAtom);

  const { data: models = [] } = useListarModelosModelosGet();

  const navigate = useNavigate();

  const criarPaciente = useCriarPacientePacientesPost();
  const criarAvaliacao = useCriarAvaliacaoAvaliacoesPost();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 54,
      sex: 1,
      trestbps: 130,
      thalach: 150,
      chol: 250,
      cp: 1,
      restecg: 0,
      slope: 1,
      thal: 3,
      fbs: 0,
      exang: 0,
      oldpeak: 1.5,
      ca: 0,
    },
  });

  const { watch, setValue } = form;
  const values = watch();

  const totalFields = Object.keys(formSchema.shape).length;
  const filledFields = Object.values(values).filter(
    (v) => v !== undefined && v !== null,
  ).length;
  const progress = Math.round((filledFields / totalFields) * 100);

  const handleSubmit = async () => {
    try {
      const paciente = await criarPaciente.mutateAsync({
        data: { idade: values.age, sexo: values.sex },
      });
      const avaliacao = await criarAvaliacao.mutateAsync({
        data: { paciente_id: paciente.id, ...values, modelo: selectedModel?.nome },
      });
      navigate({ to: `/avaliacao/${avaliacao.id}` });
    } catch (error) {
      console.error("Erro ao criar avaliação:", error);
    }
  };

  const handleClear = () => {
    form.reset({
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
    });
  };

  return (
    <div className="flex flex-col gap-[22px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-[5px]">
          <div className="flex items-center gap-[7px]">
            <span className="text-xs font-medium text-muted-foreground">
              Dashboard
            </span>
            <span className="text-muted-foreground">/</span>
            <span className="text-xs font-semibold text-primary">
              Nova Avaliação
            </span>
          </div>
          <h1 className="font-heading text-[26px] font-bold text-foreground">
            Avaliação de Risco Cardiovascular
          </h1>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-[9px]">
          <Activity className="h-[15px] w-[15px] text-primary-dark" />
          <span className="text-[13px] font-semibold text-primary-dark">
            Preenchimento dos dados clínicos
          </span>
        </div>
      </div>

      <div className="flex gap-[22px]">
        {/* Form Column */}
        <div className="flex flex-1 flex-col gap-5">
          {/* Stepper */}
          <div className="flex items-center justify-around gap-[14px] rounded-[18px] border border-border bg-card px-6 py-[18px]">
            {steps.map((step, index) => (
              <>
              <div key={step.num} className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary">
                  <span className="font-heading text-[13px] font-bold text-white">
                    {step.num}
                  </span>
                </div>
                <span className="text-[13px] font-semibold text-foreground">
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                  <div className="ml-2.5 h-[2px] flex-1 rounded bg-primary" />
                )}
              </>
              
            ))}
          </div>

          {/* Section 1 - Dados Demográficos */}
          <div className="flex flex-col gap-[18px] rounded-[18px] border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-primary/10">
                <UserRound className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="font-heading text-base font-bold text-foreground">
                  Dados Demográficos
                </span>
                <span className="text-xs text-muted-foreground">
                  Informações básicas do paciente
                </span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-risk-low-soft px-[11px] py-[5px]">
                <Check className="h-3.5 w-3.5 text-risk-low" />
                <span className="text-xs font-semibold text-risk-low">
                  Completo
                </span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-1 flex-col gap-1">
                <Label className="text-[13px] font-semibold text-muted-foreground">
                  Idade
                </Label>
                <div className="flex items-center justify-between rounded-[8px] border border-(--border-strong) bg-secondary px-3">
                  <Input
                    type="number"
                    value={values.age || ""}
                    onChange={(e) => setValue("age", Number(e.target.value))}
                    className="w-full border-0 bg-transparent p-0 text-sm font-medium text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <span className="text-[13px] text-muted-foreground">
                    anos
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <Segmented
                  label="Sexo"
                  options={[
                    { label: "Masculino", value: 1 },
                    { label: "Feminino", value: 0 },
                  ]}
                  value={values.sex}
                  onChange={(v) => setValue("sex", v as number)}
                />
              </div>
            </div>
          </div>

          {/* Section 2 - Dados Biométricos */}
          <div className="flex flex-col gap-[18px] rounded-[18px] border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-primary/10">
                <HeartPulse className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="font-heading text-base font-bold text-foreground">
                  Dados Biométricos
                </span>
                <span className="text-xs text-muted-foreground">
                  Medições clínicas do paciente
                </span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-risk-low-soft px-[11px] py-[5px]">
                <Check className="h-3.5 w-3.5 text-risk-low" />
                <span className="text-xs font-semibold text-risk-low">
                  Completo
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="flex flex-1 flex-col gap-1">
                  <Label className="text-[13px] font-semibold text-muted-foreground">
                    Pressão em repouso
                  </Label>
                  <div className="flex items-center justify-between rounded-[8px] border border-(--border-strong) bg-secondary px-3">
                    <Input
                      type="number"
                      value={values.trestbps || ""}
                      onChange={(e) =>
                        setValue("trestbps", Number(e.target.value))
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
                    Freq. cardíaca máx.
                  </Label>
                  <div className="flex items-center justify-between rounded-[8px] border border-(--border-strong) bg-secondary px-3">
                    <Input
                      type="number"
                      value={values.thalach || ""}
                      onChange={(e) =>
                        setValue("thalach", Number(e.target.value))
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
                    Colesterol total
                  </Label>
                  <div className="flex items-center justify-between rounded-[8px] border border-(--border-strong) bg-secondary px-3">
                    <Input
                      type="number"
                      value={values.chol || ""}
                      onChange={(e) => setValue("chol", Number(e.target.value))}
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

          {/* Section 3 - Exames Cardíacos */}
          <div className="flex flex-col gap-[18px] rounded-[18px] border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-primary/10">
                <HeartPulse className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="font-heading text-base font-bold text-foreground">
                  Exames Cardíacos
                </span>
                <span className="text-xs text-muted-foreground">
                  Resultados de testes clínicos específicos
                </span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-risk-low-soft px-[11px] py-[5px]">
                <Check className="h-3.5 w-3.5 text-risk-low" />
                <span className="text-xs font-semibold text-risk-low">
                  Completo
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="flex flex-1 flex-col gap-2">
                  <Segmented
                    label="Tipo de dor no peito"
                    options={[
                      { label: "Típica", value: 1 },
                      { label: "Atípica", value: 2 },
                      { label: "Não anginosa", value: 3 },
                      { label: "Assintomática", value: 4 },
                    ]}
                    value={values.cp}
                    onChange={(v) => setValue("cp", v as number)}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <Segmented
                    label="Eletrocardiograma em repouso"
                    options={[
                      { label: "Normal", value: 0 },
                      { label: "Anormal", value: 1 },
                      { label: "Hipertrofia", value: 2 },
                    ]}
                    value={values.restecg}
                    onChange={(v) => setValue("restecg", v as number)}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-1 flex-col gap-2">
                  <Segmented
                    label="Inclinação do segmento ST"
                    options={[
                      { label: "Subida", value: 1 },
                      { label: "Plano", value: 2 },
                      { label: "Descida", value: 3 },
                    ]}
                    value={values.slope}
                    onChange={(v) => setValue("slope", v as number)}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <Segmented
                    label="Talassemia"
                    options={[
                      { label: "Normal", value: 3 },
                      { label: "Fixo", value: 6 },
                      { label: "Reversível", value: 7 },
                    ]}
                    value={values.thal}
                    onChange={(v) => setValue("thal", v as number)}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-1 flex-col gap-2">
                  <Segmented
                    label="Glicemia em jejum &gt; 120 mg/dl"
                    options={[
                      { label: "Sim", value: 1 },
                      { label: "Não", value: 0 },
                    ]}
                    value={values.fbs}
                    onChange={(v) => setValue("fbs", v as number)}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <Segmented
                    label="Angina induzida por exercício"
                    options={[
                      { label: "Sim", value: 1 },
                      { label: "Não", value: 0 },
                    ]}
                    value={values.exang}
                    onChange={(v) => setValue("exang", v as number)}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-1 flex-col gap-1">
                  <Label className="text-[13px] font-semibold text-muted-foreground">
                    Depressão do segmento ST
                  </Label>
                  <div className="flex items-center justify-between rounded-[10px] border border-(--border-strong) bg-secondary px-3">
                    <Input
                      type="number"
                      step="0.1"
                      value={values.oldpeak || ""}
                      onChange={(e) =>
                        setValue("oldpeak", Number(e.target.value))
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
                    label="Vasos principais coloridos"
                    options={[
                      { label: "0", value: 0 },
                      { label: "1", value: 1 },
                      { label: "2", value: 2 },
                      { label: "3", value: 3 },
                    ]}
                    value={values.ca}
                    onChange={(v) => setValue("ca", v as number)}
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
                Dados protegidos · processamento conforme LGPD
              </span>
            </div>
            <Button
              variant="outline"
              onClick={handleClear}
              className="gap-2 rounded-xl border-[var(--border-strong)]"
            >
              <Eraser className="h-[17px] w-[17px]" />
              Limpar Dados
            </Button>
          </div>
        </div>

        {/* Info Column */}
        <div className="flex w-[330px] flex-col gap-4">
          {/* ControlPanel */}
          <div className="flex flex-col gap-4 rounded-[18px] border border-border bg-card p-[22px]">
            <div className="flex items-center gap-[11px]">
              <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-gradient-to-br from-primary to-accent">
                <Cpu className="h-[19px] w-[19px] text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-[15px] font-bold text-foreground">
                  Modelo de IA
                </span>
                <span className="text-xs text-muted-foreground">
                  Algoritmo de previsão
                </span>
              </div>
            </div>

            {/* Model List */}
            <div className="flex flex-col gap-2">
              {models.map((model) => (
                <button
                  key={model.nome}
                  type="button"
                  onClick={() => setSelectedModel(model)}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-[11px] transition-all ${
                    selectedModel?.nome === model.nome
                      ? "border border-primary bg-primary/10"
                      : "border border-border bg-secondary"
                  }`}
                >
                  <div className="flex flex-1 flex-col items-start gap-[1px]">
                    <span className="text-[13px] font-semibold text-foreground">
                      {model.nome}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {model.descricao}
                    </span>
                  </div>
                  {selectedModel?.nome === model.nome ? (
                    <CircleCheckBig className="h-[18px] w-[18px] text-primary" />
                  ) : (
                    <Circle className="h-[18px] w-[18px] text-muted-foreground" />
                  )}
                </button>
              ))}
            </div>

            <div className="h-px w-full bg-border" />

            {/* Progress */}
            <div className="flex flex-col gap-[9px]">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Campos preenchidos
                </span>
                <span className="font-heading text-[13px] font-bold text-foreground">
                  {filledFields} / {totalFields}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded bg-secondary">
                <div
                  className="h-full rounded bg-gradient-to-r from-primary to-accent transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={criarPaciente.isPending || criarAvaliacao.isPending}
              className="flex w-full items-center justify-center gap-[9px] rounded-xl bg-primary px-0 py-3.5 text-sm font-semibold text-white shadow-[0_6px_16px_-4px_#1E63E966] transition-all hover:bg-primary/90 disabled:opacity-50"
            >
              <Sparkles className="h-[18px] w-[18px]" />
              {criarPaciente.isPending || criarAvaliacao.isPending
                ? "Processando..."
                : "Executar Predição"}
            </button>
          </div>

          {/* VariablesGuide */}
          <div className="flex flex-1 flex-col gap-[18px] rounded-[18px] border border-border bg-card p-[22px]">
            <div className="flex items-center gap-[11px]">
              <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-gradient-to-br from-primary to-accent">
                <ListChecks className="h-[19px] w-[19px] text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-[15px] font-bold text-foreground">
                  Legenda dos exames
                </span>
                <span className="text-xs text-muted-foreground">
                  Significado dos códigos
                </span>
              </div>
            </div>

            <div className="h-px w-full bg-border" />

            <div className="flex flex-1 flex-col gap-[18px]">
              {[
                {
                  icon: HeartPulse,
                  title: "Tipo de dor no peito",
                  desc: "Típica, atípica, não anginosa ou assintomática",
                },
                {
                  icon: HeartPulse,
                  title: "Eletrocardiograma",
                  desc: "Normal, ST-T ou hipertrofia",
                },
                {
                  icon: Activity,
                  title: "Inclinação ST",
                  desc: "Subida, plano ou descida",
                },
                {
                  icon: Activity,
                  title: "Talassemia",
                  desc: "Normal, fixo ou reversível",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-secondary">
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
