import { useGetSMSLogs } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function SMSHistoryPage() {
  const navigate = useNavigate();
  const { data: logs = [], isLoading } = useGetSMSLogs();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate({ to: '/sms' })}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <h1 className="text-3xl font-bold">SMS History</h1>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Receiver</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No SMS logs found
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.systemId}>
                    <TableCell>
                      {new Date(Number(log.timestamp) / 1000000).toLocaleString()}
                    </TableCell>
                    <TableCell>{log.receiver}</TableCell>
                    <TableCell className="max-w-md truncate">{log.message}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.deliveryStatus}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
