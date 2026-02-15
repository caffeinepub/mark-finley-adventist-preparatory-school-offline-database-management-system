# Specification

## Summary
**Goal:** Build an offline-first school database management system for Mark Finley Adventist Preparatory School with secure role-based access, core school modules, reporting, and backup/restore.

**Planned changes:**
- Implement username/password authentication with roles (Headmaster, Accountant, Exams Coordinator), including change password, logout, inactivity auto-logout, and backend-enforced authorization.
- Add Headmaster-only user management: create/edit users, assign roles, disable accounts, and reset passwords.
- Create a role-aware main dashboard with school branding placeholders, quick statistics, sidebar navigation with large icon buttons, responsive layout (desktop/tablet), and a footer with school contact details.
- Build Admission Management: student CRUD with auto-generated Student ID, parent details, photo upload, search, printable student record, plus transfer and dismissal workflows (with approval section).
- Build Class Management: class list (teacher assignment, student list, totals), parents list (linked students), search/filter, printable class list, and export to PDF/Excel-compatible format.
- Build Staff Management: staff CRUD with photo upload, staff transfer and dismissal records, and a searchable directory.
- Build Finance Management (Headmaster + Accountant only): revenue (fees/canteen/store), expenses, fee receipts, printable financial reports (monthly/termly/annual/profit & loss) and charts/graphs.
- Build Exams Management (Headmaster + Exams Coordinator only): marks entry with auto totals/grades/positions/remarks, report cards, class/subject analysis, printable reports, and PDF export.
- Build SMS Notifications: compose individual/bulk messages to target groups, templates, admin-triggerable automated alerts, and a history log with status/timestamps; include clearly labeled “Send (Simulated)” when real sending isn’t feasible.
- Implement offline-first frontend behavior: cached loading, offline viewing of previously loaded data, queued offline writes with “pending” markers, and sync when connectivity returns.
- Add backup/restore/export: authorized export to file, restore/import from file, and a UI backup reminder (configurable interval).
- Add security/audit features: audit trail for key actions (CRUD/print/export/restore), Headmaster-only audit log viewer, and ensure sensitive data (e.g., passwords) isn’t stored in plaintext.
- Model and persist data with relationships across Students, Parents, Classes, Staff, Finance, Exams, and SMS logs to support dashboards and reporting.

**User-visible outcome:** Users can securely log in and see a role-appropriate dashboard; Headmaster can manage users and all modules; Accountant can access Finance only; Exams Coordinator can access Exams only. Staff can manage admissions, classes, staff records, finance/exams (as permitted), send/log SMS (including simulated sending), work offline with queued changes that sync later, and export/restore backups with auditable activity history.
