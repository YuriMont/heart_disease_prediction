import { Search, Bell, Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";

export function DashboardHeader() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-[26px] font-bold text-foreground">Painel</h1>
        <p className="text-sm text-muted-foreground">
          Visão geral da análise de risco cardiovascular
        </p>
      </div>
      <div className="flex items-center gap-3.5">
        <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card">
          <Bell className="h-[19px] w-[19px] text-secondary-foreground" />
        </button>
        <Link to="/evaluation">
          <Button className="gap-2.5 rounded-xl px-5 py-3.5">
            <Plus className="h-[18px] w-[18px]" />
            Nova Avaliação
          </Button>
        </Link>
      </div>
    </div>
  );
}
