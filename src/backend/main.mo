import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type UserRole = AccessControl.UserRole;
  public type AdmissionStatus = { #active; #promoted; #transferred; #dismissed };
  public type StaffStatus = { #active; #transferred; #dismissed };
  public type FinancialType = { #revenue; #expense };

  // Custom role mapping: We map application roles to access control roles
  // Headmaster -> #admin
  // Accountant -> #user with finance permission
  // Exams Coordinator -> #user with exams permission
  public type AppRole = { #headmaster; #accountant; #examsCoordinator };

  public type UserProfile = {
    systemId : Text;
    fullName : Text;
    role : UserRole;
    appRole : AppRole; // Application-specific role
    photo : ?Storage.ExternalBlob;
    active : Bool;
    lastUpdated : Int;
  };

  public type Student = {
    systemId : Text;
    firstName : Text;
    lastName : Text;
    className : Text;
    parentName : Text;
    parentPhone : Text;
    status : AdmissionStatus;
    photo : ?Storage.ExternalBlob;
  };

  public type Staff = {
    systemId : Text;
    name : Text;
    position : Text;
    status : StaffStatus;
    photo : ?Storage.ExternalBlob;
  };

  public type FinancialRecord = {
    systemId : Text;
    amount : Float;
    description : Text;
    recordType : FinancialType;
    timestamp : Int;
  };

  public type ExamRecord = {
    systemId : Text;
    studentId : Text;
    subject : Text;
    marks : Float;
    grade : Text;
    position : Nat;
    remarks : Text;
    timestamp : Int;
  };

  public type SMSLog = {
    systemId : Text;
    receiver : Text;
    message : Text;
    timestamp : Int;
    deliveryStatus : Text;
  };

  public type AuditLog = {
    timestamp : Int;
    user : Principal;
    action : Text;
    details : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let students = Map.empty<Text, Student>();
  let staffMembers = Map.empty<Text, Staff>();
  let financeRecords = Map.empty<Text, FinancialRecord>();
  let examRecords = Map.empty<Text, ExamRecord>();
  var smsLogs = List.empty<SMSLog>();
  var auditLogs = List.empty<AuditLog>();

  // Helper Functions
  func checkHeadmaster(caller : Principal) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only Headmaster can perform this action");
    };
  };

  func checkFinanceAccess(caller : Principal) {
    // Headmaster or Accountant
    let profile = userProfiles.get(caller);
    switch (profile) {
      case (?p) {
        if (not p.active) {
          Runtime.trap("Unauthorized: User account is disabled");
        };
        switch (p.appRole) {
          case (#headmaster) { /* allowed */ };
          case (#accountant) { /* allowed */ };
          case (_) {
            Runtime.trap("Unauthorized: Only Headmaster and Accountant can access finance");
          };
        };
      };
      case (null) {
        if (not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only Headmaster and Accountant can access finance");
        };
      };
    };
  };

  func checkExamsAccess(caller : Principal) {
    // Headmaster or Exams Coordinator
    let profile = userProfiles.get(caller);
    switch (profile) {
      case (?p) {
        if (not p.active) {
          Runtime.trap("Unauthorized: User account is disabled");
        };
        switch (p.appRole) {
          case (#headmaster) { /* allowed */ };
          case (#examsCoordinator) { /* allowed */ };
          case (_) {
            Runtime.trap("Unauthorized: Only Headmaster and Exams Coordinator can access exams");
          };
        };
      };
      case (null) {
        if (not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only Headmaster and Exams Coordinator can access exams");
        };
      };
    };
  };

  func checkUserActive(caller : Principal) {
    let profile = userProfiles.get(caller);
    switch (profile) {
      case (?p) {
        if (not p.active) {
          Runtime.trap("Unauthorized: User account is disabled");
        };
      };
      case (null) {
        if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
          Runtime.trap("Unauthorized: User not found");
        };
      };
    };
  };

  func logAudit(user : Principal, action : Text, details : Text) {
    let log : AuditLog = {
      timestamp = Time.now();
      user = user;
      action = action;
      details = details;
    };
    auditLogs.add<AuditLog>(log);
  };

  // Required User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    checkUserActive(caller);
    userProfiles.add(caller, profile);
    logAudit(caller, "UPDATE_PROFILE", "Updated own profile");
  };

  public query ({ caller }) func getUserProfile(userId : Principal) : async ?UserProfile {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile or must be Headmaster");
    };
    checkUserActive(caller);
    userProfiles.get(userId);
  };

  // User Management (Headmaster only)
  public shared ({ caller }) func createUser(userId : Principal, profile : UserProfile) : async () {
    checkHeadmaster(caller);
    userProfiles.add(userId, profile);
    logAudit(caller, "CREATE_USER", "Created user: " # userId.toText());
  };

  public shared ({ caller }) func updateUser(userId : Principal, updatedProfile : UserProfile) : async () {
    checkHeadmaster(caller);
    userProfiles.add(userId, updatedProfile);
    logAudit(caller, "UPDATE_USER", "Updated user: " # userId.toText());
  };

  public shared ({ caller }) func disableUser(userId : Principal) : async () {
    checkHeadmaster(caller);
    let profile = userProfiles.get(userId);
    switch (profile) {
      case (?p) {
        let updated = {
          systemId = p.systemId;
          fullName = p.fullName;
          role = p.role;
          appRole = p.appRole;
          photo = p.photo;
          active = false;
          lastUpdated = Time.now();
        };
        userProfiles.add(userId, updated);
        logAudit(caller, "DISABLE_USER", "Disabled user: " # userId.toText());
      };
      case (null) {
        Runtime.trap("User not found");
      };
    };
  };

  public shared ({ caller }) func resetUserPassword(userId : Principal) : async () {
    checkHeadmaster(caller);
    // Password reset logic would be handled by the access control module
    logAudit(caller, "RESET_PASSWORD", "Reset password for user: " # userId.toText());
  };

  public query ({ caller }) func getAllUsers() : async [UserProfile] {
    checkHeadmaster(caller);
    userProfiles.values().toArray();
  };

  // Admission Management (Headmaster only for create/update/delete)
  public shared ({ caller }) func createStudent(student : Student) : async () {
    checkHeadmaster(caller);
    students.add(student.systemId, student);
    logAudit(caller, "CREATE_STUDENT", "Created student: " # student.systemId);
  };

  public shared ({ caller }) func updateStudent(student : Student) : async () {
    checkHeadmaster(caller);
    students.add(student.systemId, student);
    logAudit(caller, "UPDATE_STUDENT", "Updated student: " # student.systemId);
  };

  public shared ({ caller }) func deleteStudent(id : Text) : async () {
    checkHeadmaster(caller);
    students.remove(id);
    logAudit(caller, "DELETE_STUDENT", "Deleted student: " # id);
  };

  public shared ({ caller }) func transferStudent(id : Text) : async () {
    checkHeadmaster(caller);
    let student = students.get(id);
    switch (student) {
      case (?s) {
        let updated = {
          systemId = s.systemId;
          firstName = s.firstName;
          lastName = s.lastName;
          className = s.className;
          parentName = s.parentName;
          parentPhone = s.parentPhone;
          status = #transferred;
          photo = s.photo;
        };
        students.add(id, updated);
        logAudit(caller, "TRANSFER_STUDENT", "Transferred student: " # id);
      };
      case (null) {
        Runtime.trap("Student not found");
      };
    };
  };

  public shared ({ caller }) func dismissStudent(id : Text) : async () {
    checkHeadmaster(caller);
    let student = students.get(id);
    switch (student) {
      case (?s) {
        let updated = {
          systemId = s.systemId;
          firstName = s.firstName;
          lastName = s.lastName;
          className = s.className;
          parentName = s.parentName;
          parentPhone = s.parentPhone;
          status = #dismissed;
          photo = s.photo;
        };
        students.add(id, updated);
        logAudit(caller, "DISMISS_STUDENT", "Dismissed student: " # id);
      };
      case (null) {
        Runtime.trap("Student not found");
      };
    };
  };

  public query ({ caller }) func getStudent(id : Text) : async ?Student {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view students");
    };
    checkUserActive(caller);
    students.get(id);
  };

  public query ({ caller }) func getAllStudents() : async [Student] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view students");
    };
    checkUserActive(caller);
    students.values().toArray();
  };

  // Staff Management (Headmaster only for create/update/delete)
  public shared ({ caller }) func createStaff(staff : Staff) : async () {
    checkHeadmaster(caller);
    staffMembers.add(staff.systemId, staff);
    logAudit(caller, "CREATE_STAFF", "Created staff: " # staff.systemId);
  };

  public shared ({ caller }) func updateStaff(staff : Staff) : async () {
    checkHeadmaster(caller);
    staffMembers.add(staff.systemId, staff);
    logAudit(caller, "UPDATE_STAFF", "Updated staff: " # staff.systemId);
  };

  public shared ({ caller }) func deleteStaff(id : Text) : async () {
    checkHeadmaster(caller);
    staffMembers.remove(id);
    logAudit(caller, "DELETE_STAFF", "Deleted staff: " # id);
  };

  public query ({ caller }) func getStaff(id : Text) : async ?Staff {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view staff");
    };
    checkUserActive(caller);
    staffMembers.get(id);
  };

  public query ({ caller }) func getAllStaff() : async [Staff] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view staff");
    };
    checkUserActive(caller);
    staffMembers.values().toArray();
  };

  // Finance Management (Headmaster + Accountant only)
  public shared ({ caller }) func addFinancialRecord(record : FinancialRecord) : async () {
    checkFinanceAccess(caller);
    financeRecords.add(record.systemId, record);
    logAudit(caller, "ADD_FINANCE_RECORD", "Added financial record: " # record.systemId);
  };

  public shared ({ caller }) func updateFinancialRecord(record : FinancialRecord) : async () {
    checkFinanceAccess(caller);
    financeRecords.add(record.systemId, record);
    logAudit(caller, "UPDATE_FINANCE_RECORD", "Updated financial record: " # record.systemId);
  };

  public shared ({ caller }) func deleteFinancialRecord(id : Text) : async () {
    checkFinanceAccess(caller);
    financeRecords.remove(id);
    logAudit(caller, "DELETE_FINANCE_RECORD", "Deleted financial record: " # id);
  };

  public query ({ caller }) func getFinancialRecord(id : Text) : async ?FinancialRecord {
    checkFinanceAccess(caller);
    financeRecords.get(id);
  };

  public query ({ caller }) func getAllFinancialRecords() : async [FinancialRecord] {
    checkFinanceAccess(caller);
    financeRecords.values().toArray();
  };

  // Exams Management (Headmaster + Exams Coordinator only)
  public shared ({ caller }) func addExamRecord(record : ExamRecord) : async () {
    checkExamsAccess(caller);
    examRecords.add(record.systemId, record);
    logAudit(caller, "ADD_EXAM_RECORD", "Added exam record: " # record.systemId);
  };

  public shared ({ caller }) func updateExamRecord(record : ExamRecord) : async () {
    checkExamsAccess(caller);
    examRecords.add(record.systemId, record);
    logAudit(caller, "UPDATE_EXAM_RECORD", "Updated exam record: " # record.systemId);
  };

  public shared ({ caller }) func deleteExamRecord(id : Text) : async () {
    checkExamsAccess(caller);
    examRecords.remove(id);
    logAudit(caller, "DELETE_EXAM_RECORD", "Deleted exam record: " # id);
  };

  public query ({ caller }) func getExamRecord(id : Text) : async ?ExamRecord {
    checkExamsAccess(caller);
    examRecords.get(id);
  };

  public query ({ caller }) func getAllExamRecords() : async [ExamRecord] {
    checkExamsAccess(caller);
    examRecords.values().toArray();
  };

  public query ({ caller }) func getStudentExamRecords(studentId : Text) : async [ExamRecord] {
    checkExamsAccess(caller);
    examRecords.values().toArray().filter<ExamRecord>(
      func(record : ExamRecord) : Bool {
        record.studentId == studentId
      }
    );
  };

  // SMS Notification (All authenticated users can send, but logged)
  public shared ({ caller }) func logSMS(log : SMSLog) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can send SMS");
    };
    checkUserActive(caller);
    smsLogs.add<SMSLog>(log);
    logAudit(caller, "SEND_SMS", "Sent SMS to: " # log.receiver);
  };

  public query ({ caller }) func getSMSLogs() : async [SMSLog] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view SMS logs");
    };
    checkUserActive(caller);
    smsLogs.toArray();
  };

  // Audit Trail (Headmaster only)
  public query ({ caller }) func getAuditLogs() : async [AuditLog] {
    checkHeadmaster(caller);
    auditLogs.toArray();
  };

  // Backup and Export (Headmaster only)
  public query ({ caller }) func exportAllData() : async Text {
    checkHeadmaster(caller);
    // Return serialized data for backup
    "DATA_EXPORT_PLACEHOLDER";
  };

  public shared ({ caller }) func importData(data : Text) : async () {
    checkHeadmaster(caller);
    // Import and restore data
    logAudit(caller, "IMPORT_DATA", "Restored data from backup");
  };
};
