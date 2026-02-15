import { useState } from 'react';
import { useExportData, useImportData } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Upload, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { RequireRole } from '../../components/auth/RequireRole';
import { AppRole } from '../../backend';

export default function BackupRestorePage() {
  const exportData = useExportData();
  const importData = useImportData();
  const [importing, setImporting] = useState(false);

  const handleExport = async () => {
    try {
      const data = await exportData.mutateAsync();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mfaps-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Data exported successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to export data');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      await importData.mutateAsync(text);
      toast.success('Data restored successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to restore data');
    } finally {
      setImporting(false);
    }
  };

  return (
    <RequireRole allowedRoles={[AppRole.headmaster]}>
      <div className="space-y-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold">Backup & Restore</h1>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Regular backups are essential to protect your school data. Export your data regularly and store it in a safe location.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Export Data</CardTitle>
              <CardDescription>
                Download a backup of all school data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleExport} 
                disabled={exportData.isPending}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                {exportData.isPending ? 'Exporting...' : 'Export Backup'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Restore Data</CardTitle>
              <CardDescription>
                Import data from a previous backup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
                id="restore-file"
              />
              <Button 
                onClick={() => document.getElementById('restore-file')?.click()}
                disabled={importing}
                variant="outline"
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {importing ? 'Restoring...' : 'Restore from Backup'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </RequireRole>
  );
}
