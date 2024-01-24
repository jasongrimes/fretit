import Layout from "@/components/Layout";
import { RootRoute } from "@tanstack/react-router";
import React, { Suspense } from "react";
const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null // Render nothing in production
  : React.lazy(() =>
      // Lazy load in development
      import("@tanstack/router-devtools").then((res) => ({
        default: res.TanStackRouterDevtools,
        // For Embedded Mode
        // default: res.TanStackRouterDevtoolsPanel
      })),
    );
export const Route = new RootRoute({
  component: () => (
    <>
      <Layout />
      <Suspense fallback={null}>
        <TanStackRouterDevtools />
      </Suspense>
    </>
  ),
});
