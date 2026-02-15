import { useState } from 'react';
import { useGetAllExamRecords, useDeleteExamRecord } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MarksEntryFormDialog } from '../../components/exams/MarksEntryFormDialog';
import { Link } from '@tanstack/react-router';
import { Plus, Eye, Trash2, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { RequireRole } from '../../components/auth/RequireRole';
import { AppRole } from '../../backend';

export default function ExamsPage() {
  const { data: records = [], isLoading } = useGetAllExamRecords();
  const deleteRecord = useDeleteExamRecord();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this exam record?')) {
      try {
        await deleteRecord.mutateAsync(id);
        toast.success('Exam record deleted successfully');
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete exam record');
      }
    }
  };

  return (
    <RequireRole allowedRoles={[AppRole.headmaster, AppRole.examsCoordinator]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Exams Management</h1>
          <div className="flex gap-2">
            <Link to="/exams/analytics">
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </Link>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Marks
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No exam records found
                    </TableCell>
                  </TableRow>
                ) : (
                  records.map((record) => (
                    <TableRow key={record.systemId}>
                      <TableCell className="font-medium">{record.studentId}</TableCell>
                      <TableCell>{record.subject}</TableCell>
                      <TableCell>{record.marks}</TableCell>
                      <TableCell>{record.grade}</TableCell>
                      <TableCell>{Number(record.position)}</TableCell>
                      <TableCell>{record.remarks}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link to="/exams/report-card/$studentId" params={{ studentId: record.studentId }}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(record.systemId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <MarksEntryFormDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      </div>
    </RequireRole>
  );
}
