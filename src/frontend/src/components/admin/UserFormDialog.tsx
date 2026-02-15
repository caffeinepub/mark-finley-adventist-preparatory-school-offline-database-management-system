import { useState } from 'react';
import { useCreateUser } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { UserProfile, AppRole, UserRole } from '../../backend';
import { Principal } from '@dfinity/principal';

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserFormDialog({ open, onOpenChange }: UserFormDialogProps) {
  const createUser = useCreateUser();
  const [formData, setFormData] = useState({
    principalId: '',
    fullName: '',
    appRole: AppRole.accountant,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const userId = Principal.fromText(formData.principalId);
      const profile: UserProfile = {
        systemId: formData.principalId,
        fullName: formData.fullName,
        role: UserRole.user,
        appRole: formData.appRole,
        active: true,
        lastUpdated: BigInt(Date.now() * 1000000),
      };

      await createUser.mutateAsync({ userId, profile });
      toast.success('User created successfully');
      onOpenChange(false);
      setFormData({ principalId: '', fullName: '', appRole: AppRole.accountant });
    } catch (error: any) {
      toast.error(error.message || 'Failed to create user');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="principalId">Principal ID</Label>
            <Input
              id="principalId"
              value={formData.principalId}
              onChange={(e) => setFormData({ ...formData, principalId: e.target.value })}
              placeholder="Enter Internet Identity Principal"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select 
              value={formData.appRole} 
              onValueChange={(value) => setFormData({ ...formData, appRole: value as AppRole })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={AppRole.headmaster}>Headmaster</SelectItem>
                <SelectItem value={AppRole.accountant}>Accountant</SelectItem>
                <SelectItem value={AppRole.examsCoordinator}>Exams Coordinator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createUser.isPending}>
              {createUser.isPending ? 'Creating...' : 'Create User'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
