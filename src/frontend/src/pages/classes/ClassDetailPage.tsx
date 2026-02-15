import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetAllStudents } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Printer } from 'lucide-react';

export default function ClassDetailPage() {
  const { classId } = useParams({ from: '/classes/$classId' });
  const navigate = useNavigate();
  const { data: students = [], isLoading } = useGetAllStudents();

  const className = decodeURIComponent(classId);
  const classStudents = students.filter(s => s.className === className);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between print:hidden">
        <Button variant="ghost" onClick={() => navigate({ to: '/classes' })}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{className}</CardTitle>
          <p className="text-muted-foreground">Total Students: {classStudents.length}</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Parent Name</TableHead>
                <TableHead>Parent Phone</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No students in this class
                  </TableCell>
                </TableRow>
              ) : (
                classStudents.map((student) => (
                  <TableRow key={student.systemId}>
                    <TableCell>{student.systemId}</TableCell>
                    <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
                    <TableCell>{student.parentName}</TableCell>
                    <TableCell>{student.parentPhone}</TableCell>
                    <TableCell>{student.status}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
