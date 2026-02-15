import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetStudentExamRecords, useGetStudent } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Printer, Download } from 'lucide-react';

export default function StudentReportCardPage() {
  const { studentId } = useParams({ from: '/exams/report-card/$studentId' });
  const navigate = useNavigate();
  const { data: records = [], isLoading: recordsLoading } = useGetStudentExamRecords(studentId);
  const { data: student, isLoading: studentLoading } = useGetStudent(studentId);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print();
  };

  if (recordsLoading || studentLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const averageMarks = records.length > 0
    ? records.reduce((sum, r) => sum + r.marks, 0) / records.length
    : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between print:hidden">
        <Button variant="ghost" onClick={() => navigate({ to: '/exams' })}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="text-center border-b">
          <CardTitle className="text-2xl">Student Report Card</CardTitle>
          <p className="text-sm text-muted-foreground">Mark Finley Adventist Preparatory School</p>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Student Name</p>
              <p className="text-lg font-semibold">
                {student ? `${student.firstName} ${student.lastName}` : studentId}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Student ID</p>
              <p className="text-lg">{studentId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Class</p>
              <p className="text-lg">{student?.className || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Marks</p>
              <p className="text-lg font-semibold">{averageMarks.toFixed(2)}%</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No exam records found
                    </TableCell>
                  </TableRow>
                ) : (
                  records.map((record) => (
                    <TableRow key={record.systemId}>
                      <TableCell>{record.subject}</TableCell>
                      <TableCell>{record.marks}</TableCell>
                      <TableCell>{record.grade}</TableCell>
                      <TableCell>{Number(record.position)}</TableCell>
                      <TableCell>{record.remarks}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
