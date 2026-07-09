import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
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
  { label: "Painel", icon: LayoutDashboard, to: "/" },
  { label: "Pacientes", icon: Users, to: "/patients" },
  { label: "Resultados", icon: ClipboardList, to: "/results" },
  { label: "Relatórios", icon: FileText, to: "/reports" },
  { label: "Modelo de IA", icon: BrainCircuit, to: "/models" },
];

export function Sidebar() {
  const location = useLocation();

  const isActive = (to: string) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  const [selectedModel] = useAtom(modelAtom);

  return (
    <aside className="flex h-full w-[264px] flex-col gap-2 bg-primary p-7">
      {/* Logo */}
      <div className="flex items-center gap-3 pb-7">
        <div className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-secondary">
          <HeartPulse className="h-6 w-6 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="font-heading text-[17px] font-bold text-white">
            CardioPredict
          </span>
          <span className="text-xs font-semibold uppercase tracking-[1.5px] text-accent">
            IA · Cardiologia
          </span>
        </div>
      </div>

      {/* Nav Label */}
      <span className="text-xs font-semibold uppercase tracking-wider text-accent">
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
                "flex items-center gap-3.5 text-white rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                active
                  ? "bg-secondary/10"
                  : "hover:bg-secondary/20 hover:text-white/60",
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
        <div className="rounded-[14px] border border-secondary/40 bg-secondary/10 p-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-risk-low" />
            <span className="text-xs font-semibold text-white">
              Modelo Ativo
            </span>
          </div>
          <p className="mt-2 text-xs text-accent">
            {selectedModel?.name} - {selectedModel.description}
          </p>
        </div>
      )}
    </aside>
  );
}
