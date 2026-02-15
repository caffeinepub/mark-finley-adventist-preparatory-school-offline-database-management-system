import { useState } from 'react';
import { useGetAllStudents } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Printer, Download } from 'lucide-react';
import { exportToCSV } from '../../utils/export';
import { toast } from 'sonner';

export default function ParentsPage() {
  const { data: students = [], isLoading } = useGetAllStudents();
  const [searchTerm, setSearchTerm] = useState('');

  const parents = students.reduce((acc, student) => {
    if (!acc[student.parentPhone]) {
      acc[student.parentPhone] = {
        name: student.parentName,
        phone: student.parentPhone,
        students: [],
      };
    }
    acc[student.parentPhone].students.push(`${student.firstName} ${student.lastName}`);
    return acc;
  }, {} as Record<string, { name: string; phone: string; students: string[] }>);

  const parentsList = Object.values(parents);

  const filteredParents = parentsList.filter(parent =>
    parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.phone.includes(searchTerm)
  );

  const handleExport = () => {
    const data = filteredParents.map(parent => ({
      'Parent Name': parent.name,
      'Phone Number': parent.phone,
      'Linked Students': parent.students.join(', '),
      'Number of Children': parent.students.length,
    }));
    exportToCSV(data, 'parents-list.csv');
    toast.success('Parents list exported successfully');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Parents List</h1>
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
            placeholder="Search parents..."
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
                <TableHead>Parent Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Linked Students</TableHead>
                <TableHead>Number of Children</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No parents found
                  </TableCell>
                </TableRow>
              ) : (
                filteredParents.map((parent) => (
                  <TableRow key={parent.phone}>
                    <TableCell className="font-medium">{parent.name}</TableCell>
                    <TableCell>{parent.phone}</TableCell>
                    <TableCell>{parent.students.join(', ')}</TableCell>
                    <TableCell>{parent.students.length}</TableCell>
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
