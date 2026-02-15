import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface UserProfile {
    active: boolean;
    appRole: AppRole;
    role: UserRole;
    lastUpdated: bigint;
    fullName: string;
    systemId: string;
    photo?: ExternalBlob;
}
export interface Student {
    status: AdmissionStatus;
    parentPhone: string;
    systemId: string;
    photo?: ExternalBlob;
    className: string;
    lastName: string;
    parentName: string;
    firstName: string;
}
export interface AuditLog {
    action: string;
    user: Principal;
    timestamp: bigint;
    details: string;
}
export interface FinancialRecord {
    description: string;
    recordType: FinancialType;
    systemId: string;
    timestamp: bigint;
    amount: number;
}
export interface SMSLog {
    deliveryStatus: string;
    systemId: string;
    message: string;
    timestamp: bigint;
    receiver: string;
}
export interface Staff {
    status: StaffStatus;
    name: string;
    systemId: string;
    photo?: ExternalBlob;
    position: string;
}
export interface ExamRecord {
    marks: number;
    studentId: string;
    subject: string;
    systemId: string;
    grade: string;
    timestamp: bigint;
    position: bigint;
    remarks: string;
}
export enum AdmissionStatus {
    active = "active",
    transferred = "transferred",
    dismissed = "dismissed",
    promoted = "promoted"
}
export enum AppRole {
    accountant = "accountant",
    examsCoordinator = "examsCoordinator",
    headmaster = "headmaster"
}
export enum FinancialType {
    revenue = "revenue",
    expense = "expense"
}
export enum StaffStatus {
    active = "active",
    transferred = "transferred",
    dismissed = "dismissed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addExamRecord(record: ExamRecord): Promise<void>;
    addFinancialRecord(record: FinancialRecord): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createStaff(staff: Staff): Promise<void>;
    createStudent(student: Student): Promise<void>;
    createUser(userId: Principal, profile: UserProfile): Promise<void>;
    deleteExamRecord(id: string): Promise<void>;
    deleteFinancialRecord(id: string): Promise<void>;
    deleteStaff(id: string): Promise<void>;
    deleteStudent(id: string): Promise<void>;
    disableUser(userId: Principal): Promise<void>;
    dismissStudent(id: string): Promise<void>;
    exportAllData(): Promise<string>;
    getAllExamRecords(): Promise<Array<ExamRecord>>;
    getAllFinancialRecords(): Promise<Array<FinancialRecord>>;
    getAllStaff(): Promise<Array<Staff>>;
    getAllStudents(): Promise<Array<Student>>;
    getAllUsers(): Promise<Array<UserProfile>>;
    getAuditLogs(): Promise<Array<AuditLog>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getExamRecord(id: string): Promise<ExamRecord | null>;
    getFinancialRecord(id: string): Promise<FinancialRecord | null>;
    getSMSLogs(): Promise<Array<SMSLog>>;
    getStaff(id: string): Promise<Staff | null>;
    getStudent(id: string): Promise<Student | null>;
    getStudentExamRecords(studentId: string): Promise<Array<ExamRecord>>;
    getUserProfile(userId: Principal): Promise<UserProfile | null>;
    importData(data: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    logSMS(log: SMSLog): Promise<void>;
    resetUserPassword(userId: Principal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    transferStudent(id: string): Promise<void>;
    updateExamRecord(record: ExamRecord): Promise<void>;
    updateFinancialRecord(record: FinancialRecord): Promise<void>;
    updateStaff(staff: Staff): Promise<void>;
    updateStudent(student: Student): Promise<void>;
    updateUser(userId: Principal, updatedProfile: UserProfile): Promise<void>;
}
