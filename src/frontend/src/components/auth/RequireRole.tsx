import { ReactNode } from 'react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { AppRole } from '../../backend';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface RequireRoleProps {
  children: ReactNode;
  allowedRoles: AppRole[];
}

export function RequireRole({ children, allowedRoles }: RequireRoleProps) {
  const { userProfile, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userProfile || !allowedRoles.includes(userProfile.appRole)) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to access this module. Please contact the Headmaster if you believe this is an error.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
