import { useState } from 'react';
import { useCreateStudent, useUpdateStudent } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Student, AdmissionStatus } from '../../backend';
import { PhotoUploader } from '../files/PhotoUploader';
import { ExternalBlob } from '../../backend';

interface StudentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: Student;
}

export function StudentFormDialog({ open, onOpenChange, student }: StudentFormDialogProps) {
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const [formData, setFormData] = useState<Partial<Student>>(
    student || {
      systemId: `STU${Date.now()}`,
      firstName: '',
      lastName: '',
      className: '',
      parentName: '',
      parentPhone: '',
      status: 'active' as AdmissionStatus,
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (student) {
        await updateStudent.mutateAsync(formData as Student);
        toast.success('Student updated successfully');
      } else {
        await createStudent.mutateAsync(formData as Student);
        toast.success('Student created successfully');
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save student');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{student ? 'Edit Student' : 'New Admission'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="className">Class</Label>
            <Input
              id="className"
              value={formData.className}
              onChange={(e) => setFormData({ ...formData, className: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentName">Parent Name</Label>
            <Input
              id="parentName"
              value={formData.parentName}
              onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentPhone">Parent Phone</Label>
            <Input
              id="parentPhone"
              value={formData.parentPhone}
              onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
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
            <Button type="submit" disabled={createStudent.isPending || updateStudent.isPending}>
              {createStudent.isPending || updateStudent.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
