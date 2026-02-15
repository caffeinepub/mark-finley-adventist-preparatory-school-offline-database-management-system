import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const { clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={loginStatus === 'logging-in'}
      variant="outline"
      size="sm"
    >
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </Button>
  );
}
