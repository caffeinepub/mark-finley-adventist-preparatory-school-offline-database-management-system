import { useState } from 'react';
import { useGetAllStudents } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@tanstack/react-router';
import { Search, Eye, Printer, Download } from 'lucide-react';
import { exportToCSV } from '../../utils/export';
import { toast } from 'sonner';

export default function ClassesPage() {
  const { data: students = [], isLoading } = useGetAllStudents();
  const [searchTerm, setSearchTerm] = useState('');

  const classes = students.reduce((acc, student) => {
    if (!acc[student.className]) {
      acc[student.className] = [];
    }
    acc[student.className].push(student);
    return acc;
  }, {} as Record<string, typeof students>);

  const filteredClasses = Object.entries(classes).filter(([className]) =>
    className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    const data = filteredClasses.map(([className, students]) => ({
      Class: className,
      'Total Students': students.length,
      'Active Students': students.filter(s => s.status === 'active').length,
    }));
    exportToCSV(data, 'classes-list.csv');
    toast.success('Classes exported successfully');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Class Management</h1>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 print:hidden">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
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
                <TableHead>Class Name</TableHead>
                <TableHead>Total Students</TableHead>
                <TableHead>Active Students</TableHead>
                <TableHead className="text-right print:hidden">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClasses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No classes found
                  </TableCell>
                </TableRow>
              ) : (
                filteredClasses.map(([className, classStudents]) => (
                  <TableRow key={className}>
                    <TableCell className="font-medium">{className}</TableCell>
                    <TableCell>{classStudents.length}</TableCell>
                    <TableCell>
                      {classStudents.filter(s => s.status === 'active').length}
                    </TableCell>
                    <TableCell className="text-right print:hidden">
                      <Link to="/classes/$classId" params={{ classId: encodeURIComponent(className) }}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
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
