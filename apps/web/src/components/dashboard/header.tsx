import { Plus, HeartPulse } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '../ui/button';

export function DashboardHeader() {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-card border border-border p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-sm">
          <HeartPulse className="h-6 w-6 text-primary-foreground" />
        </div>
        <div className="flex flex-col gap-[2px]">
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold text-foreground tracking-tight">
              Painel
            </h1>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
              Visão Geral
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Análise de risco cardiovascular · pacientes avaliados pelo modelo de
            IA
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/evaluation">
          <Button className="gap-2.5 rounded-xl px-5 py-3.5 shadow-sm">
            <Plus className="h-[18px] w-[18px]" />
            Nova Avaliação
          </Button>
        </Link>
      </div>
    </div>
  );
}
