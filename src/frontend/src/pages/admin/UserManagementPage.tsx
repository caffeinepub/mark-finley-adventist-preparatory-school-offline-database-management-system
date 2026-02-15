import { useState } from 'react';
import { useGetAllUsers, useDisableUser } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UserFormDialog } from '../../components/admin/UserFormDialog';
import { Plus, UserX } from 'lucide-react';
import { toast } from 'sonner';
import { RequireRole } from '../../components/auth/RequireRole';
import { Principal } from '@dfinity/principal';
import { AppRole } from '../../backend';

export default function UserManagementPage() {
  const { data: users = [], isLoading } = useGetAllUsers();
  const disableUser = useDisableUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDisable = async (userId: string) => {
    if (confirm('Are you sure you want to disable this user?')) {
      try {
        await disableUser.mutateAsync(Principal.fromText(userId));
        toast.success('User disabled successfully');
      } catch (error: any) {
        toast.error(error.message || 'Failed to disable user');
      }
    }
  };

  return (
    <RequireRole allowedRoles={[AppRole.headmaster]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">User Management</h1>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
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
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.systemId}>
                      <TableCell className="font-medium">{user.fullName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {user.appRole === AppRole.headmaster ? 'Headmaster' : 
                           user.appRole === AppRole.accountant ? 'Accountant' : 
                           'Exams Coordinator'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.active ? 'default' : 'secondary'}>
                          {user.active ? 'Active' : 'Disabled'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {user.active && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDisable(user.systemId)}
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <UserFormDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      </div>
    </RequireRole>
  );
}
