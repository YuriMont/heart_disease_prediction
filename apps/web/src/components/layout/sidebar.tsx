import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  ClipboardList,
  FileText,
  BrainCircuit,
  HeartPulse,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAtom } from "jotai";
import { modelAtom } from "../../store/model";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/" },
  { label: "Nova Avaliação", icon: Stethoscope, to: "/avaliacao" },
  { label: "Pacientes", icon: Users, to: "/pacientes" },
  { label: "Resultados", icon: ClipboardList, to: "/resultados" },
  { label: "Relatórios", icon: FileText, to: "/relatorios" },
  { label: "Modelo de IA", icon: BrainCircuit, to: "/modelos" },
];

export function Sidebar() {
  const location = useLocation();

  const isActive = (to: string) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  const [selectedModel] = useAtom(modelAtom);

  return (
    <aside className="flex h-full w-[264px] flex-col gap-2 bg-gradient-to-br from-[var(--sidebar-bg)] to-[var(--sidebar-bg-2)] p-7 6">
      {/* Logo */}
      <div className="flex items-center gap-3 pb-7">
        <div className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
          <HeartPulse className="h-6 w-6 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-heading text-[17px] font-bold text-white">
            CardioPredict
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[1.5px] text-[#7FA8D9]">
            AI · Cardiology
          </span>
        </div>
      </div>

      {/* Nav Label */}
      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5E7BA0]">
        Menu
      </span>

      {/* Nav Items */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-white"
                  : "text-[#C2D0E4] hover:bg-white/10 hover:text-white",
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  active ? "text-white" : "text-[#9FB2CC]",
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Model Status */}
      {selectedModel && (
        <div className="rounded-[14px] border border-white/[0.12] bg-white/[0.08] p-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-risk-low" />
            <span className="text-xs font-semibold text-white">
              Modelo Ativo
            </span>
          </div>
          <p className="mt-2 text-[11px] text-[#9FB6D4]">
            {selectedModel?.nome} - {selectedModel.descricao}
          </p>
        </div>
      )}

      {/* Profile */}
      <div className="flex items-center gap-3 px-1 pt-0 pb-1">
        <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-primary/20">
          <span className="text-[13px] font-bold text-primary">DR</span>
        </div>
        <div className="flex flex-col flex-1">
          <span className="text-[13px] font-semibold text-white">
            Dra. Renata Lima
          </span>
          <span className="text-[11px] text-[#9FB6D4]">Cardiologista</span>
        </div>
      </div>
    </aside>
  );
}
