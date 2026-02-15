import { Link, useLocation } from '@tanstack/react-router';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { cn } from '@/lib/utils';
import {
  Home,
  UserPlus,
  BookOpen,
  Users,
  DollarSign,
  FileText,
  MessageSquare,
  Settings,
  Shield,
  Database,
  Key,
} from 'lucide-react';

export function SidebarNav() {
  const { userProfile } = useCurrentUser();
  const location = useLocation();

  const isHeadmaster = userProfile?.appRole === 'headmaster';
  const isAccountant = userProfile?.appRole === 'accountant';
  const isExamsCoordinator = userProfile?.appRole === 'examsCoordinator';

  const navItems = [
    { to: '/', label: 'Dashboard', icon: Home, show: true },
    { to: '/admissions', label: 'Admissions', icon: UserPlus, show: isHeadmaster },
    { to: '/classes', label: 'Classes', icon: BookOpen, show: isHeadmaster },
    { to: '/parents', label: 'Parents', icon: Users, show: isHeadmaster },
    { to: '/staff', label: 'Staff', icon: Users, show: isHeadmaster },
    { to: '/finance', label: 'Finance', icon: DollarSign, show: isHeadmaster || isAccountant },
    { to: '/exams', label: 'Exams', icon: FileText, show: isHeadmaster || isExamsCoordinator },
    { to: '/sms', label: 'SMS', icon: MessageSquare, show: true },
    { to: '/change-password', label: 'Change Password', icon: Key, show: true },
    { to: '/admin/users', label: 'User Management', icon: Shield, show: isHeadmaster },
    { to: '/admin/backup', label: 'Backup & Restore', icon: Database, show: isHeadmaster },
    { to: '/admin/audit', label: 'Audit Trail', icon: Settings, show: isHeadmaster },
  ];

  return (
    <aside className="w-64 border-r bg-sidebar">
      <nav className="space-y-1 p-4">
        {navItems.filter(item => item.show).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
