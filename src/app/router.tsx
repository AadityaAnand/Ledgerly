import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { AppShell } from '@/components/layout/app-shell'
import {
  AffordanceDemoPage,
  AIReviewPage,
  ClientsPage,
  DashboardPage,
  DocumentsPage,
  GetStartedPage,
  MessagesPage,
  WorkspacePage,
  ReportsPage,
  ReturnReviewPage,
  ReturnsPage,
  ReviewQueuePage,
  SettingsPage,
  StaffPage,
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

const messageThreadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/messages/$conversationId',
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

const getStartedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/get-started',
  component: GetStartedPage,
})

const workspaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/workspace/$type/$id',
  component: WorkspacePage,
})

const reviewQueueRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/review-queue',
  component: ReviewQueuePage,
})

const staffRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/staff',
  component: StaffPage,
})

const affordanceDemoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/design-system',
  component: AffordanceDemoPage,
})

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  returnsRoute,
  returnReviewRoute,
  documentsRoute,
  tasksRoute,
  messagesRoute,
  messageThreadRoute,
  clientsRoute,
  aiReviewRoute,
  reportsRoute,
  settingsRoute,
  getStartedRoute,
  workspaceRoute,
  reviewQueueRoute,
  staffRoute,
  affordanceDemoRoute,
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
