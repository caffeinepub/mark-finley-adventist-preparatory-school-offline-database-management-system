import { useGetAllExamRecords } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const { data: records = [], isLoading } = useGetAllExamRecords();

  const subjectPerformance = records.reduce((acc, record) => {
    if (!acc[record.subject]) {
      acc[record.subject] = { subject: record.subject, totalMarks: 0, count: 0 };
    }
    acc[record.subject].totalMarks += record.marks;
    acc[record.subject].count += 1;
    return acc;
  }, {} as Record<string, { subject: string; totalMarks: number; count: number }>);

  const chartData = Object.values(subjectPerformance).map(item => ({
    subject: item.subject,
    average: item.totalMarks / item.count,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate({ to: '/exams' })}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <h1 className="text-3xl font-bold">Exam Analytics</h1>

      <Card>
        <CardHeader>
          <CardTitle>Subject Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : chartData.length === 0 ? (
            <p className="text-center text-muted-foreground p-8">No exam data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="average" fill="oklch(var(--chart-1))" name="Average Marks" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
