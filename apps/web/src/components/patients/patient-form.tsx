import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "@tanstack/react-router";
import { UserRound, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Segmented } from "../ui/segmented";
import { useCreatePatientPatientsPost } from "../../generated/api/patients/patients";
import { CreatePatientPatientsPostBody } from "../../generated/api/patients/patients.zod";

type PatientFormData = z.infer<typeof CreatePatientPatientsPostBody>;

export function PatientForm() {
  const navigate = useNavigate();
  const createPatient = useCreatePatientPatientsPost();

  const form = useForm<PatientFormData>({
    resolver: zodResolver(CreatePatientPatientsPostBody),
  });

  const values = form.watch();
  const { setValue } = form;

  const handleSubmit = async () => {
    const result = await form.trigger();
    if (!result) return;

    try {
      await createPatient.mutateAsync({
        data: {
          name: values.name || null,
          age: values.age,
          sex: values.sex,
        },
      });
      navigate({ to: "/patients" });
    } catch (error) {
      console.error("Error creating patient:", error);
    }
  };

  return (
      <div className="flex gap-[22px]">
        <div className="flex flex-1 flex-col gap-5 max-w-[600px]">
          <div className="flex flex-col gap-[18px] rounded-[18px] border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-primary/10">
                <UserRound className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="font-heading text-base font-bold text-foreground">
                  Dados do Paciente
                </span>
                <span className="text-xs text-muted-foreground">
                  Informações básicas do paciente
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <Label className="text-[13px] font-semibold text-muted-foreground">
                  Nome
                </Label>
                <div className="flex items-center rounded-[8px] border border-(--border-strong) bg-secondary px-3">
                  <Input
                    type="text"
                    placeholder="Ex.: João Silva"
                    value={values.name || ""}
                    onChange={(e) => setValue("name", e.target.value)}
                    className="w-full border-0 bg-transparent p-0 text-sm font-medium text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
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
                      required
                      placeholder="Ex.: 45"
                      value={values.age || ""}
                      onChange={(e) => setValue("age", Number(e.target.value))}
                      className="w-full border-0 bg-transparent p-0 text-sm font-medium text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <span className="text-[13px] text-muted-foreground">
                      anos
                    </span>
                  </div>
                  {form.formState.errors.age && (
                    <span className="text-xs text-red-500">
                      {form.formState.errors.age.message}
                    </span>
                  )}
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
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/patients" })}
              className="gap-2 rounded-xl border-[var(--border-strong)]"
            >
              <ArrowLeft className="h-[17px] w-[17px]" />
              Voltar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createPatient.isPending}
              className="gap-2 rounded-xl"
            >
              <Sparkles className="h-[17px] w-[17px]" />
              {createPatient.isPending ? "Salvando..." : "Salvar Paciente"}
            </Button>
          </div>
        </div>
      </div>
  );
}
