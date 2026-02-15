import { useGetAuditLogs } from '../../hooks/useQueries';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RequireRole } from '../../components/auth/RequireRole';
import { AppRole } from '../../backend';

export default function AuditTrailPage() {
  const { data: logs = [], isLoading } = useGetAuditLogs();

  return (
    <RequireRole allowedRoles={[AppRole.headmaster]}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Audit Trail</h1>

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
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No audit logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(Number(log.timestamp) / 1000000).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {log.user.toString().substring(0, 20)}...
                      </TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell className="max-w-md truncate">{log.details}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </RequireRole>
  );
}
