import { useGetAllFinancialRecords } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Printer } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function ReportsPage() {
  const navigate = useNavigate();
  const { data: records = [], isLoading } = useGetAllFinancialRecords();

  const revenues = records.filter(r => r.recordType === 'revenue');
  const expenses = records.filter(r => r.recordType === 'expense');

  const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);
  const totalExpenses = expenses.reduce((sum, r) => sum + r.amount, 0);
  const profitLoss = totalRevenue - totalExpenses;

  const chartData = [
    { name: 'Revenue', amount: totalRevenue },
    { name: 'Expenses', amount: totalExpenses },
  ];

  const COLORS = ['oklch(var(--chart-1))', 'oklch(var(--chart-2))'];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <Button variant="ghost" onClick={() => navigate({ to: '/finance' })}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
      </div>

      <h1 className="text-3xl font-bold">Financial Reports</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              GH₵{totalRevenue.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              GH₵{totalExpenses.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Profit/Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              GH₵{profitLoss.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue vs Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="oklch(var(--chart-1))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: GH₵${entry.amount.toFixed(2)}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
