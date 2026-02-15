import { useOfflineStatus } from '../../offline/useOfflineStatus';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff } from 'lucide-react';

export function OfflineStatusBanner() {
  const { isOffline } = useOfflineStatus();

  if (!isOffline) return null;

  return (
    <Alert variant="destructive" className="rounded-none border-x-0">
      <WifiOff className="h-4 w-4" />
      <AlertDescription>
        You are currently offline. Changes will be queued and synced when connection is restored.
      </AlertDescription>
    </Alert>
  );
}
