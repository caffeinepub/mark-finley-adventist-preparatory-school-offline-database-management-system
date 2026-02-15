import { useState } from 'react';
import { useGetAllStudents, useDeleteStudent } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { StudentFormDialog } from '../../components/admissions/StudentFormDialog';
import { Link } from '@tanstack/react-router';
import { Plus, Search, Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { RequireRole } from '../../components/auth/RequireRole';
import { AppRole } from '../../backend';

export default function AdmissionsPage() {
  const { data: students = [], isLoading } = useGetAllStudents();
  const deleteStudent = useDeleteStudent();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredStudents = students.filter(student =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.systemId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent.mutateAsync(id);
        toast.success('Student deleted successfully');
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete student');
      }
    }
  };

  return (
    <RequireRole allowedRoles={[AppRole.headmaster]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admissions Management</h1>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Admission
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
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
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No students found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.systemId}>
                      <TableCell className="font-medium">{student.systemId}</TableCell>
                      <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
                      <TableCell>{student.className}</TableCell>
                      <TableCell>{student.parentName}</TableCell>
                      <TableCell>
                        <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link to="/admissions/$studentId" params={{ studentId: student.systemId }}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(student.systemId)}
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

        <StudentFormDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      </div>
    </RequireRole>
  );
}
