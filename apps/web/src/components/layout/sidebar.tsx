import { Link, useLocation } from '@tanstack/react-router';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  BrainCircuit,
  HeartPulse,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAtom } from 'jotai';
import { modelAtom } from '../../store/model';
import { sidebarOpenAtom } from '../../atoms/sidebar';

const navItems = [
  { label: 'Painel', icon: LayoutDashboard, to: '/' },
  { label: 'Pacientes', icon: Users, to: '/patients' },
  { label: 'Resultados', icon: ClipboardList, to: '/results' },
  { label: 'Modelo de IA', icon: BrainCircuit, to: '/models' },
];

function EcgAmbient() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden opacity-[0.04]">
      <svg
        viewBox="0 0 600 120"
        className="h-full w-[600px] animate-ecg"
        preserveAspectRatio="none"
      >
        <path
          d="M0 60 L50 60 L65 20 L80 100 L95 55 L110 55 L120 10 L130 55 L150 55 L165 60 L180 60 L200 60 L215 30 L230 90 L245 50 L260 50 L270 10 L280 50 L300 50 L315 60 L330 60 L350 60 L365 20 L380 100 L395 55 L410 55 L420 10 L430 55 L450 55 L465 60 L480 60 L500 60 L515 30 L530 90 L545 50 L560 50 L570 10 L580 50 L600 50"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-white"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function Sidebar() {
  const location = useLocation();
  const [open, setOpen] = useAtom(sidebarOpenAtom);

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  const [selectedModel] = useAtom(modelAtom);

  const close = () => setOpen(false);

  return (
    <>
      {/* Backdrop — mobile only */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={close}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col gap-2 overflow-hidden bg-sidebar p-7',
          'transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : '-translate-x-full',
          'lg:relative lg:translate-x-0 lg:transition-none lg:h-full',
        )}
      >
        {/* Close button — mobile only */}
        <button
          onClick={close}
          className="absolute right-4 top-4 z-10 rounded-lg p-1 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>

        <EcgAmbient />

        {/* Logo */}
        <div className="flex items-center gap-3 pb-7">
          <div className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-primary shadow-sm">
            <HeartPulse className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-[17px] font-bold text-sidebar-foreground">
              CardioPredict
            </span>
            <span className="text-xs font-semibold uppercase tracking-[1.5px] text-sidebar-accent-foreground/60">
              IA · Cardiologia
            </span>
          </div>
        </div>

      {/* Nav Label */}
      <span className="text-xs font-semibold uppercase tracking-wider text-sidebar-accent-foreground/50">
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
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground',
              )}
            >
              <item.icon
                className={cn(
                  'h-5 w-5 shrink-0',
                  active
                    ? 'text-primary-foreground'
                    : 'text-sidebar-foreground/40',
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
        <div className="rounded-2xl border border-sidebar-border bg-sidebar-accent/50 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="h-2 w-2 rounded-full bg-risk-low" />
              <div className="absolute inset-0 h-2 w-2 animate-pulse-ring rounded-full bg-risk-low/30" />
            </div>
            <span className="text-xs font-semibold text-sidebar-foreground">
              Modelo Ativo
            </span>
          </div>
          <p className="mt-2 text-xs text-sidebar-foreground/50 leading-relaxed">
            {selectedModel?.name} — {selectedModel.description}
          </p>
        </div>
      )}
    </aside>
    </>
  );
}
