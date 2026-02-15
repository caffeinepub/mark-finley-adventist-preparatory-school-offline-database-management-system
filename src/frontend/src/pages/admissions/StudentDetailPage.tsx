import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetStudent, useTransferStudent, useDismissStudent } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Printer, UserX, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function StudentDetailPage() {
  const { studentId } = useParams({ from: '/admissions/$studentId' });
  const navigate = useNavigate();
  const { data: student, isLoading } = useGetStudent(studentId);
  const transferStudent = useTransferStudent();
  const dismissStudent = useDismissStudent();

  const handlePrint = () => {
    window.print();
  };

  const handleTransfer = async () => {
    if (confirm('Are you sure you want to transfer this student?')) {
      try {
        await transferStudent.mutateAsync(studentId);
        toast.success('Student transferred successfully');
      } catch (error: any) {
        toast.error(error.message || 'Failed to transfer student');
      }
    }
  };

  const handleDismiss = async () => {
    if (confirm('Are you sure you want to dismiss this student?')) {
      try {
        await dismissStudent.mutateAsync(studentId);
        toast.success('Student dismissed successfully');
      } catch (error: any) {
        toast.error(error.message || 'Failed to dismiss student');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Student not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between print:hidden">
        <Button variant="ghost" onClick={() => navigate({ to: '/admissions' })}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={handleTransfer}>
            <ArrowRight className="h-4 w-4 mr-2" />
            Transfer
          </Button>
          <Button variant="destructive" onClick={handleDismiss}>
            <UserX className="h-4 w-4 mr-2" />
            Dismiss
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">
                {student.firstName} {student.lastName}
              </CardTitle>
              <p className="text-muted-foreground mt-1">Student ID: {student.systemId}</p>
            </div>
            {student.photo && (
              <img
                src={student.photo.getDirectURL()}
                alt="Student"
                className="w-24 h-24 rounded-lg object-cover"
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Class</p>
              <p className="text-lg">{student.className}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                {student.status}
              </Badge>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Parent Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Parent Name</p>
                <p className="text-lg">{student.parentName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                <p className="text-lg">{student.parentPhone}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
