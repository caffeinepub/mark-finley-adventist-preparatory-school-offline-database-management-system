import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Student, Staff, FinancialRecord, ExamRecord, SMSLog, AuditLog, UserProfile } from '../backend';
import { Principal } from '@dfinity/principal';

// Students
export function useGetAllStudents() {
  const { actor, isFetching } = useActor();

  return useQuery<Student[]>({
    queryKey: ['students'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStudents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetStudent(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Student | null>({
    queryKey: ['student', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getStudent(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateStudent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (student: Student) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createStudent(student);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}

export function useUpdateStudent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (student: Student) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateStudent(student);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}

export function useDeleteStudent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteStudent(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}

export function useTransferStudent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.transferStudent(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}

export function useDismissStudent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.dismissStudent(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}

// Staff
export function useGetAllStaff() {
  const { actor, isFetching } = useActor();

  return useQuery<Staff[]>({
    queryKey: ['staff'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStaff();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetStaff(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Staff | null>({
    queryKey: ['staff', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getStaff(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateStaff() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (staff: Staff) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createStaff(staff);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
}

export function useUpdateStaff() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (staff: Staff) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateStaff(staff);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
}

export function useDeleteStaff() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteStaff(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
}

// Finance
export function useGetAllFinancialRecords() {
  const { actor, isFetching } = useActor();

  return useQuery<FinancialRecord[]>({
    queryKey: ['financialRecords'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFinancialRecords();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFinancialRecord(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<FinancialRecord | null>({
    queryKey: ['financialRecord', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getFinancialRecord(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useAddFinancialRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: FinancialRecord) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addFinancialRecord(record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialRecords'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
}

export function useUpdateFinancialRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: FinancialRecord) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateFinancialRecord(record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialRecords'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
}

export function useDeleteFinancialRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteFinancialRecord(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialRecords'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
}

// Exams
export function useGetAllExamRecords() {
  const { actor, isFetching } = useActor();

  return useQuery<ExamRecord[]>({
    queryKey: ['examRecords'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllExamRecords();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetStudentExamRecords(studentId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ExamRecord[]>({
    queryKey: ['examRecords', studentId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStudentExamRecords(studentId);
    },
    enabled: !!actor && !isFetching && !!studentId,
  });
}

export function useAddExamRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: ExamRecord) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addExamRecord(record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examRecords'] });
    },
  });
}

export function useUpdateExamRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: ExamRecord) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateExamRecord(record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examRecords'] });
    },
  });
}

export function useDeleteExamRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteExamRecord(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examRecords'] });
    },
  });
}

// SMS
export function useGetSMSLogs() {
  const { actor, isFetching } = useActor();

  return useQuery<SMSLog[]>({
    queryKey: ['smsLogs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSMSLogs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLogSMS() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (log: SMSLog) => {
      if (!actor) throw new Error('Actor not available');
      return actor.logSMS(log);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['smsLogs'] });
    },
  });
}

// Audit
export function useGetAuditLogs() {
  const { actor, isFetching } = useActor();

  return useQuery<AuditLog[]>({
    queryKey: ['auditLogs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAuditLogs();
    },
    enabled: !!actor && !isFetching,
  });
}

// Users
export function useGetAllUsers() {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile[]>({
    queryKey: ['users'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, profile }: { userId: Principal; profile: UserProfile }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createUser(userId, profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, profile }: { userId: Principal; profile: UserProfile }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateUser(userId, profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useDisableUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.disableUser(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// Backup/Restore
export function useExportData() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.exportAllData();
    },
  });
}

export function useImportData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.importData(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}
