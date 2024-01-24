import {
  Outlet,
  RootRoute,
  Route,
  Router,
  createMemoryHistory,
} from "@tanstack/react-router";

// https://github.com/TanStack/router/discussions/604
export function createTestRouter(component: () => JSX.Element) {
  const rootRoute = new RootRoute({
    component: Outlet,
  });

  const componentRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "/",
    component,
  });

  const router = new Router({
    routeTree: rootRoute.addChildren([componentRoute]),
    history: createMemoryHistory(),
  });

  return router;
}

// const _router = createTestRouter(() => <></>);

// export function renderComponent(router: typeof _router) {
//   return render(
//       <RouterProvider router={router} />
//   );
// }
