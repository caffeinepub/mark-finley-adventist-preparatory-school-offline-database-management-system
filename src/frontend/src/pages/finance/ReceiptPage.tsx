import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetFinancialRecord } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Printer } from 'lucide-react';

export default function ReceiptPage() {
  const { recordId } = useParams({ from: '/finance/receipt/$recordId' });
  const navigate = useNavigate();
  const { data: record, isLoading } = useGetFinancialRecord(recordId);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Record not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between print:hidden">
        <Button variant="ghost" onClick={() => navigate({ to: '/finance' })}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print Receipt
        </Button>
      </div>

      <Card>
        <CardHeader className="text-center border-b">
          <CardTitle className="text-2xl">Payment Receipt</CardTitle>
          <p className="text-sm text-muted-foreground">Mark Finley Adventist Preparatory School</p>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Receipt No.</p>
              <p className="text-lg font-semibold">{record.systemId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p className="text-lg">
                {new Date(Number(record.timestamp) / 1000000).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
            <p className="text-lg">{record.description}</p>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <p className="text-lg font-medium">Amount Paid</p>
              <p className="text-2xl font-bold">GH₵{record.amount.toFixed(2)}</p>
            </div>
          </div>

          <div className="border-t pt-4 text-center text-sm text-muted-foreground">
            <p>Thank you for your payment</p>
            <p className="mt-2">This is a computer-generated receipt</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
