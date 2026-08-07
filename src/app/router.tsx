import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { AppShell } from '@/components/layout/app-shell'
import {
  AIReviewPage,
  ClientsPage,
  DashboardPage,
  DocumentsPage,
  MessagesPage,
  ReportsPage,
  ReturnReviewPage,
  ReturnsPage,
  SettingsPage,
  TasksPage,
} from '@/pages'

const rootRoute = createRootRoute({
  component: AppShell,
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
})

const returnsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/returns',
  component: ReturnsPage,
})

const returnReviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/returns/$returnId',
  component: ReturnReviewPage,
})

const documentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/documents',
  component: DocumentsPage,
})

const tasksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tasks',
  component: TasksPage,
})

const messagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/messages',
  component: MessagesPage,
})

const clientsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/clients',
  component: ClientsPage,
})

const aiReviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ai-review',
  component: AIReviewPage,
})

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports',
  component: ReportsPage,
})

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
})

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  returnsRoute,
  returnReviewRoute,
  documentsRoute,
  tasksRoute,
  messagesRoute,
  clientsRoute,
  aiReviewRoute,
  reportsRoute,
  settingsRoute,
])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
