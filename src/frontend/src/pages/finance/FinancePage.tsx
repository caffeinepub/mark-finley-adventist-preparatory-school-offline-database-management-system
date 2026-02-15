import { useState } from 'react';
import { useGetAllFinancialRecords, useDeleteFinancialRecord } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FinancialRecordFormDialog } from '../../components/finance/FinancialRecordFormDialog';
import { Link } from '@tanstack/react-router';
import { Plus, Eye, Trash2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { RequireRole } from '../../components/auth/RequireRole';
import { AppRole } from '../../backend';

export default function FinancePage() {
  const { data: records = [], isLoading } = useGetAllFinancialRecords();
  const deleteRecord = useDeleteFinancialRecord();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [recordType, setRecordType] = useState<'revenue' | 'expense'>('revenue');

  const revenues = records.filter(r => r.recordType === 'revenue');
  const expenses = records.filter(r => r.recordType === 'expense');

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      try {
        await deleteRecord.mutateAsync(id);
        toast.success('Record deleted successfully');
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete record');
      }
    }
  };

  const handleAddRecord = (type: 'revenue' | 'expense') => {
    setRecordType(type);
    setIsDialogOpen(true);
  };

  return (
    <RequireRole allowedRoles={[AppRole.headmaster, AppRole.accountant]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Finance Management</h1>
          <Link to="/finance/reports">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              View Reports
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => handleAddRecord('revenue')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Revenue
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
                      <TableHead>ID</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revenues.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          No revenue records found
                        </TableCell>
                      </TableRow>
                    ) : (
                      revenues.map((record) => (
                        <TableRow key={record.systemId}>
                          <TableCell className="font-medium">{record.systemId}</TableCell>
                          <TableCell>{record.description}</TableCell>
                          <TableCell>GH₵{record.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            {new Date(Number(record.timestamp) / 1000000).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link to="/finance/receipt/$recordId" params={{ recordId: record.systemId }}>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(record.systemId)}
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
          </TabsContent>

          <TabsContent value="expenses" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => handleAddRecord('expense')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
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
                      <TableHead>ID</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          No expense records found
                        </TableCell>
                      </TableRow>
                    ) : (
                      expenses.map((record) => (
                        <TableRow key={record.systemId}>
                          <TableCell className="font-medium">{record.systemId}</TableCell>
                          <TableCell>{record.description}</TableCell>
                          <TableCell>GH₵{record.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            {new Date(Number(record.timestamp) / 1000000).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(record.systemId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <FinancialRecordFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          recordType={recordType}
        />
      </div>
    </RequireRole>
  );
}
