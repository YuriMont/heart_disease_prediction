import { Outlet } from "@tanstack/react-router";
import { Sidebar } from "./sidebar";
import { useListModelsModelsGet } from "../../generated/api/models/models";
import { useAtom } from "jotai";
import { modelAtom } from "../../store/model";
import { useEffect } from "react";

export function MainLayout() {

  const { data: models = [] } = useListModelsModelsGet();

  const [selectedModel, setSelectedModel] = useAtom(modelAtom)

  useEffect(() => {
    if (selectedModel === null && models.length > 0) {
      setSelectedModel(models[0]);
    }
  }, [selectedModel, models, setSelectedModel]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-7">
        <Outlet />
      </main>
    </div>
  );
}
