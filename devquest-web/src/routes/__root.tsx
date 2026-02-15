import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Layout } from "@/widgets/layout";

export const Route = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});
