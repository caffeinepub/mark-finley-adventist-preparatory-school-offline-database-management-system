import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useCurrentUser } from './hooks/useCurrentUser';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AppLayout from './components/layout/AppLayout';
import AdmissionsPage from './pages/admissions/AdmissionsPage';
import StudentDetailPage from './pages/admissions/StudentDetailPage';
import ClassesPage from './pages/classes/ClassesPage';
import ClassDetailPage from './pages/classes/ClassDetailPage';
import ParentsPage from './pages/classes/ParentsPage';
import StaffDirectoryPage from './pages/staff/StaffDirectoryPage';
import StaffDetailPage from './pages/staff/StaffDetailPage';
import FinancePage from './pages/finance/FinancePage';
import ReceiptPage from './pages/finance/ReceiptPage';
import ReportsPage from './pages/finance/ReportsPage';
import ExamsPage from './pages/exams/ExamsPage';
import StudentReportCardPage from './pages/exams/StudentReportCardPage';
import AnalyticsPage from './pages/exams/AnalyticsPage';
import SMSPage from './pages/sms/SMSPage';
import SMSHistoryPage from './pages/sms/SMSHistoryPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import BackupRestorePage from './pages/admin/BackupRestorePage';
import AuditTrailPage from './pages/admin/AuditTrailPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import { useAutoLogout } from './security/useAutoLogout';

function RootComponent() {
  const { identity } = useInternetIdentity();
  const { userProfile, isLoading } = useCurrentUser();
  
  useAutoLogout();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return <LoginPage />;
  }

  if (!userProfile) {
    return <LoginPage />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

const changePasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/change-password',
  component: ChangePasswordPage,
});

const admissionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admissions',
  component: AdmissionsPage,
});

const studentDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admissions/$studentId',
  component: StudentDetailPage,
});

const classesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/classes',
  component: ClassesPage,
});

const classDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/classes/$classId',
  component: ClassDetailPage,
});

const parentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/parents',
  component: ParentsPage,
});

const staffRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/staff',
  component: StaffDirectoryPage,
});

const staffDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/staff/$staffId',
  component: StaffDetailPage,
});

const financeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/finance',
  component: FinancePage,
});

const receiptRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/finance/receipt/$recordId',
  component: ReceiptPage,
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/finance/reports',
  component: ReportsPage,
});

const examsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/exams',
  component: ExamsPage,
});

const reportCardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/exams/report-card/$studentId',
  component: StudentReportCardPage,
});

const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/exams/analytics',
  component: AnalyticsPage,
});

const smsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sms',
  component: SMSPage,
});

const smsHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sms/history',
  component: SMSHistoryPage,
});

const userManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/users',
  component: UserManagementPage,
});

const backupRestoreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/backup',
  component: BackupRestorePage,
});

const auditTrailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/audit',
  component: AuditTrailPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  changePasswordRoute,
  admissionsRoute,
  studentDetailRoute,
  classesRoute,
  classDetailRoute,
  parentsRoute,
  staffRoute,
  staffDetailRoute,
  financeRoute,
  receiptRoute,
  reportsRoute,
  examsRoute,
  reportCardRoute,
  analyticsRoute,
  smsRoute,
  smsHistoryRoute,
  userManagementRoute,
  backupRestoreRoute,
  auditTrailRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
