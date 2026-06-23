import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: Layout,
});

function Layout() {
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
