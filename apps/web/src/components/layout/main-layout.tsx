import { Outlet } from '@tanstack/react-router';
import { Sidebar } from './sidebar';
import { useListModelsModelsGet } from '../../generated/api/models/models';
import { useAtom } from 'jotai';
import { modelAtom } from '../../store/model';
import { useEffect } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Toaster } from '../ui/sonner';

export function MainLayout() {
  const { data: models = [] } = useListModelsModelsGet();

  const [selectedModel, setSelectedModel] = useAtom(modelAtom);

  useEffect(() => {
    if (selectedModel === null && models.length > 0) {
      setSelectedModel(models[0]);
    }
  }, [selectedModel, models, setSelectedModel]);

  return (
    <div className="flex h-screen w-full bg-background">
      <Sidebar />

      <ScrollArea className="flex-1">
        <div className="p-7">
          <Outlet />
        </div>
      </ScrollArea>

      <Toaster position="top-right" />
    </div>
  );
}
