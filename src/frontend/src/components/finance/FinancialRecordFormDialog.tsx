import { useState } from 'react';
import { useAddFinancialRecord } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { FinancialRecord, FinancialType } from '../../backend';

interface FinancialRecordFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recordType: 'revenue' | 'expense';
}

export function FinancialRecordFormDialog({ open, onOpenChange, recordType }: FinancialRecordFormDialogProps) {
  const addRecord = useAddFinancialRecord();
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const record: FinancialRecord = {
        systemId: `FIN${Date.now()}`,
        amount: parseFloat(formData.amount),
        description: formData.description,
        recordType: recordType as FinancialType,
        timestamp: BigInt(Date.now() * 1000000),
      };

      await addRecord.mutateAsync(record);
      toast.success('Record added successfully');
      onOpenChange(false);
      setFormData({ amount: '', description: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to add record');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add {recordType === 'revenue' ? 'Revenue' : 'Expense'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (GH₵)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
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
