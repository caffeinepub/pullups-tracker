import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { SfxProvider } from './hooks/useSfx';
import { PullupStoreProvider } from './hooks/usePullupStore';
import { FocusModeProvider } from './hooks/useFocusMode';
import AppShell from './components/AppShell';
import DashboardScreen from './screens/DashboardScreen';
import LogScreen from './screens/LogScreen';
import HistoryScreen from './screens/HistoryScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import AdvancedStatsScreen from './screens/AdvancedStatsScreen';
import SettingsScreen from './screens/SettingsScreen';

const rootRoute = createRootRoute({
  component: AppShell,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardScreen,
});

const logRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/log',
  component: LogScreen,
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/history',
  component: HistoryScreen,
});

const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/analytics',
  component: AnalyticsScreen,
});

const advancedStatsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/advanced-stats',
  component: AdvancedStatsScreen,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsScreen,
});

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  logRoute,
  historyRoute,
  analyticsRoute,
  advancedStatsRoute,
  settingsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <PullupStoreProvider>
        <SfxProvider>
          <FocusModeProvider>
            <RouterProvider router={router} />
            <Toaster />
          </FocusModeProvider>
        </SfxProvider>
      </PullupStoreProvider>
    </ThemeProvider>
  );
}
