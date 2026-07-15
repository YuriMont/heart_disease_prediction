import { Plus, HeartPulse } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '../ui/button';

export function DashboardHeader() {
  return (
    <div className="bg-card border-border flex flex-col gap-4 rounded-2xl border p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="bg-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm">
          <HeartPulse className="text-primary-foreground h-6 w-6" />
        </div>
        <div className="flex flex-col gap-[0.125rem]">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-heading text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              Painel
            </h1>
            <span className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-[0.6875rem] font-semibold tracking-wider uppercase">
              Visão Geral
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            Análise de risco cardiovascular · pacientes avaliados pelo modelo de
            IA
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/evaluation">
          <Button className="w-full gap-2.5 rounded-xl px-5 py-3.5 shadow-sm sm:w-auto">
            <Plus className="h-[1.125rem] w-[1.125rem]" />
            Nova Avaliação
          </Button>
        </Link>
      </div>
    </div>
  );
}
