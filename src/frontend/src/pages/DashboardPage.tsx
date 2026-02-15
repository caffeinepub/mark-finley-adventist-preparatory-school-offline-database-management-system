import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { Users, GraduationCap, DollarSign, AlertCircle, BookOpen } from 'lucide-react';
import { BackupReminderBanner } from '../components/admin/BackupReminderBanner';

export default function DashboardPage() {
  const { userProfile } = useCurrentUser();
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {userProfile?.fullName || 'User'}
          </p>
        </div>
        <div className="w-20 h-20">
          <img 
            src="/assets/generated/mfaps-logo-placeholder.dim_512x512.png" 
            alt="School Logo" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <BackupReminderBanner />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats?.totalStudents || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats?.totalStaff || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats?.totalClasses || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fees Collected</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : `GH₵${stats?.feesCollected.toFixed(2) || '0.00'}`}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Fees</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : `GH₵${stats?.outstandingFees.toFixed(2) || '0.00'}`}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Use the sidebar navigation to access different modules based on your role.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
