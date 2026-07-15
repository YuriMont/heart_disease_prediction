import { Outlet } from '@tanstack/react-router';
import { Sidebar } from './sidebar';
import { useListModelsModelsGet } from '../../generated/api/models/models';
import { useAtom } from 'jotai';
import { modelAtom } from '../../store/model';
import { sidebarOpenAtom } from '../../atoms/sidebar';
import { useEffect } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Toaster } from '../ui/sonner';
import { HeartPulse, Menu } from 'lucide-react';

export function MainLayout() {
  const { data: models = [] } = useListModelsModelsGet();

  const [selectedModel, setSelectedModel] = useAtom(modelAtom);
  const [, setSidebarOpen] = useAtom(sidebarOpenAtom);

  useEffect(() => {
    if (selectedModel === null && models.length > 0) {
      setSelectedModel(models[0]);
    }
  }, [selectedModel, models, setSelectedModel]);

  return (
    <div className="bg-background flex h-screen w-full">
      <Sidebar />

      <ScrollArea className="flex-1">
        {/* Mobile header bar */}
        <div className="border-border bg-background sticky top-0 z-30 flex items-center gap-3 border-b px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-foreground/60 hover:bg-muted hover:text-foreground rounded-lg p-1.5"
          >
            <Menu className="h-5 w-5" />
          </button>
          <HeartPulse className="text-primary h-5 w-5" />
          <span className="font-heading text-foreground text-base font-bold">
            CardioPredict
          </span>
        </div>

        <div className="p-7 max-sm:p-4">
          <Outlet />
        </div>
      </ScrollArea>

      <Toaster position="top-right" />
    </div>
  );
}
