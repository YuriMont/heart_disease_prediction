import { Outlet } from "@tanstack/react-router";
import { Sidebar } from "./sidebar";

export function MainLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-7">
        <Outlet />
      </main>
    </div>
  );
}
