import { useState } from 'react';
import { useCreateStaff, useUpdateStaff } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Staff, StaffStatus } from '../../backend';
import { PhotoUploader } from '../files/PhotoUploader';

interface StaffFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff?: Staff;
}

export function StaffFormDialog({ open, onOpenChange, staff }: StaffFormDialogProps) {
  const createStaff = useCreateStaff();
  const updateStaff = useUpdateStaff();
  const [formData, setFormData] = useState<Partial<Staff>>(
    staff || {
      systemId: `STF${Date.now()}`,
      name: '',
      position: '',
      status: 'active' as StaffStatus,
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (staff) {
        await updateStaff.mutateAsync(formData as Staff);
        toast.success('Staff member updated successfully');
      } else {
        await createStaff.mutateAsync(formData as Staff);
        toast.success('Staff member created successfully');
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save staff member');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{staff ? 'Edit Staff' : 'Add Staff'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Photo</Label>
            <PhotoUploader
              value={formData.photo}
              onChange={(photo) => setFormData({ ...formData, photo })}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createStaff.isPending || updateStaff.isPending}>
              {createStaff.isPending || updateStaff.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
