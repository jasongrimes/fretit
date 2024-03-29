// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as PositionsImport } from './routes/positions'
import { Route as IndexImport } from './routes/index'
import { Route as PositionsAboutImport } from './routes/positions.about'

// Create/Update Routes

const PositionsRoute = PositionsImport.update({
  path: '/positions',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const PositionsAboutRoute = PositionsAboutImport.update({
  path: '/about',
  getParentRoute: () => PositionsRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/positions': {
      preLoaderRoute: typeof PositionsImport
      parentRoute: typeof rootRoute
    }
    '/positions/about': {
      preLoaderRoute: typeof PositionsAboutImport
      parentRoute: typeof PositionsImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  PositionsRoute.addChildren([PositionsAboutRoute]),
])
