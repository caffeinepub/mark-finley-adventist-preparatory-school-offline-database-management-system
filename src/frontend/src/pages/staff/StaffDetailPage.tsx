import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetStaff } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Printer } from 'lucide-react';

export default function StaffDetailPage() {
  const { staffId } = useParams({ from: '/staff/$staffId' });
  const navigate = useNavigate();
  const { data: staff, isLoading } = useGetStaff(staffId);

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

  if (!staff) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Staff member not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between print:hidden">
        <Button variant="ghost" onClick={() => navigate({ to: '/staff' })}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{staff.name}</CardTitle>
              <p className="text-muted-foreground mt-1">Staff ID: {staff.systemId}</p>
            </div>
            {staff.photo && (
              <img
                src={staff.photo.getDirectURL()}
                alt="Staff"
                className="w-24 h-24 rounded-lg object-cover"
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Position</p>
              <p className="text-lg">{staff.position}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge variant={staff.status === 'active' ? 'default' : 'secondary'}>
                {staff.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
