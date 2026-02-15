import { useQuery } from '@tanstack/react-query';
import { useGetAllStudents } from './useQueries';
import { useGetAllStaff } from './useQueries';
import { useGetAllFinancialRecords } from './useQueries';
import { FinancialType } from '../backend';

export function useDashboardStats() {
  const { data: students = [] } = useGetAllStudents();
  const { data: staff = [] } = useGetAllStaff();
  const { data: financialRecords = [] } = useGetAllFinancialRecords();

  return useQuery({
    queryKey: ['dashboardStats', students.length, staff.length, financialRecords.length],
    queryFn: () => {
      const totalStudents = students.filter(s => s.status === 'active').length;
      const totalStaff = staff.filter(s => s.status === 'active').length;
      
      const classes = new Set(students.map(s => s.className));
      const totalClasses = classes.size;

      const feesCollected = financialRecords
        .filter(r => r.recordType === 'revenue')
        .reduce((sum, r) => sum + r.amount, 0);

      const outstandingFees = 0; // Placeholder - would need fee structure data

      return {
        totalStudents,
        totalStaff,
        totalClasses,
        feesCollected,
        outstandingFees,
      };
    },
    enabled: true,
  });
}
