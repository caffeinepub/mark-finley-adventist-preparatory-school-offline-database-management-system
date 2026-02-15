import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Database, X } from 'lucide-react';
import { Link } from '@tanstack/react-router';

const BACKUP_REMINDER_KEY = 'lastBackupReminder';
const REMINDER_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 7 days

export function BackupReminderBanner() {
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    const lastReminder = localStorage.getItem(BACKUP_REMINDER_KEY);
    const now = Date.now();

    if (!lastReminder || now - parseInt(lastReminder) > REMINDER_INTERVAL) {
      setShowReminder(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(BACKUP_REMINDER_KEY, Date.now().toString());
    setShowReminder(false);
  };

  if (!showReminder) return null;

  return (
    <Alert>
      <Database className="h-4 w-4" />
      <AlertTitle>Backup Reminder</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>It's time to backup your data to ensure no information is lost.</span>
        <div className="flex gap-2">
          <Link to="/admin/backup">
            <Button variant="outline" size="sm">
              Backup Now
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleDismiss}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
