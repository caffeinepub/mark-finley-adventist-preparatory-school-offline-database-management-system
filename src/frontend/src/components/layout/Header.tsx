import { LogoutButton } from '../auth/LogoutButton';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { Badge } from '@/components/ui/badge';

export function Header() {
  const { userProfile } = useCurrentUser();

  const getRoleBadge = () => {
    if (!userProfile) return null;
    
    const roleMap = {
      headmaster: { label: 'Headmaster', variant: 'default' as const },
      accountant: { label: 'Accountant', variant: 'secondary' as const },
      examsCoordinator: { label: 'Exams Coordinator', variant: 'outline' as const },
    };

    const role = roleMap[userProfile.appRole];
    return <Badge variant={role.variant}>{role.label}</Badge>;
  };

  return (
    <header className="border-b bg-card">
      <div className="flex h-16 items-center px-6 justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Mark Finley APS</h2>
          {getRoleBadge()}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {userProfile?.fullName}
          </span>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
