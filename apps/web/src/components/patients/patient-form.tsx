import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from '@tanstack/react-router';
import { UserRound, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Segmented } from '../ui/segmented';
import { useCreatePatientPatientsPost } from '../../generated/api/patients/patients';
import { CreatePatientPatientsPostBody } from '../../generated/api/patients/patients.zod';

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
      navigate({ to: '/patients' });
    } catch (error) {
      console.error('Error creating patient:', error);
    }
  };

  return (
    <div className="flex flex-col gap-[1.375rem] xl:flex-row">
      <div className="flex max-w-[37.5rem] flex-1 flex-col gap-5">
        <div className="border-border bg-card flex flex-col gap-[1.125rem] rounded-2xl border p-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-[0.625rem]">
              <UserRound className="text-primary h-5 w-5" />
            </div>
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="font-heading text-foreground text-base font-bold">
                Dados do Paciente
              </span>
              <span className="text-muted-foreground text-xs">
                Informações básicas do paciente
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Label className="text-muted-foreground text-[0.8125rem] font-semibold">
                Nome
              </Label>
              <div className="border-border bg-muted flex items-center rounded-lg border px-3">
                <Input
                  type="text"
                  placeholder="Ex.: João Silva"
                  value={values.name || ''}
                  onChange={(e) => setValue('name', e.target.value)}
                  className="text-foreground w-full border-0 bg-transparent p-0 text-sm font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex flex-1 flex-col gap-1">
                <Label className="text-muted-foreground text-[0.8125rem] font-semibold">
                  Idade
                </Label>
                <div className="border-border bg-muted flex items-center justify-between rounded-lg border px-3">
                  <Input
                    type="number"
                    required
                    placeholder="Ex.: 45"
                    value={values.age || ''}
                    onChange={(e) => setValue('age', Number(e.target.value))}
                    className="text-foreground w-full border-0 bg-transparent p-0 text-sm font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <span className="text-muted-foreground text-[0.8125rem]">
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
                    { label: 'Masculino', value: 1 },
                    { label: 'Feminino', value: 0 },
                  ]}
                  value={values.sex}
                  onChange={(v) => setValue('sex', v as number)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/patients' })}
            className="gap-2 rounded-xl"
          >
            <ArrowLeft className="h-[1.0625rem] w-[1.0625rem]" />
            Voltar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createPatient.isPending}
            className="gap-2 rounded-xl"
          >
            <Sparkles className="h-[1.0625rem] w-[1.0625rem]" />
            {createPatient.isPending ? 'Salvando...' : 'Salvar Paciente'}
          </Button>
        </div>
      </div>
    </div>
  );
}
