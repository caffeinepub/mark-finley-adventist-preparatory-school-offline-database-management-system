import { useState } from 'react';
import { useGetAllStaff, useDeleteStaff } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { StaffFormDialog } from '../../components/staff/StaffFormDialog';
import { Link } from '@tanstack/react-router';
import { Plus, Search, Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { RequireRole } from '../../components/auth/RequireRole';
import { AppRole } from '../../backend';

export default function StaffDirectoryPage() {
  const { data: staff = [], isLoading } = useGetAllStaff();
  const deleteStaff = useDeleteStaff();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      try {
        await deleteStaff.mutateAsync(id);
        toast.success('Staff member deleted successfully');
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete staff member');
      }
    }
  };

  return (
    <RequireRole allowedRoles={[AppRole.headmaster]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Staff Directory</h1>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search staff..."
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
                  <TableHead>Staff ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No staff members found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStaff.map((member) => (
                    <TableRow key={member.systemId}>
                      <TableCell className="font-medium">{member.systemId}</TableCell>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.position}</TableCell>
                      <TableCell>
                        <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link to="/staff/$staffId" params={{ staffId: member.systemId }}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(member.systemId)}
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

        <StaffFormDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      </div>
    </RequireRole>
  );
}
