// Import the generated route tree
import { Router, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = new Router({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
