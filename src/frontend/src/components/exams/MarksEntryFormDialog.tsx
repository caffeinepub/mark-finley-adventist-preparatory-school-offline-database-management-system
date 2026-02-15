import { useState } from 'react';
import { useAddExamRecord } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ExamRecord } from '../../backend';

interface MarksEntryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MarksEntryFormDialog({ open, onOpenChange }: MarksEntryFormDialogProps) {
  const addRecord = useAddExamRecord();
  const [formData, setFormData] = useState({
    studentId: '',
    subject: '',
    marks: '',
    remarks: '',
  });

  const calculateGrade = (marks: number): string => {
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B';
    if (marks >= 60) return 'C';
    if (marks >= 50) return 'D';
    return 'F';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const marks = parseFloat(formData.marks);
      const record: ExamRecord = {
        systemId: `EXM${Date.now()}`,
        studentId: formData.studentId,
        subject: formData.subject,
        marks,
        grade: calculateGrade(marks),
        position: BigInt(1), // Would be calculated based on class performance
        remarks: formData.remarks,
        timestamp: BigInt(Date.now() * 1000000),
      };

      await addRecord.mutateAsync(record);
      toast.success('Exam record added successfully');
      onOpenChange(false);
      setFormData({ studentId: '', subject: '', marks: '', remarks: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to add exam record');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Exam Marks</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="studentId">Student ID</Label>
            <Input
              id="studentId"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="marks">Marks</Label>
            <Input
              id="marks"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.marks}
              onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={addRecord.isPending}>
              {addRecord.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
