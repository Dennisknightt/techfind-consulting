/**
 * Roles — see /docs/CRM_RULES.md for the full permission matrix.
 *
 *  SUPER_ADMIN  full control, incl. tax configuration
 *  MANAGEMENT   pipeline, clients, commercial overview, approvals
 *  SALES        leads, deals, communication, proformas, own clients' payments
 *  FINANCE      invoices, payments, reconciliation, receipts, revenue, projects
 *  VIEWER       read-only
 */
export type Role = "SUPER_ADMIN" | "MANAGEMENT" | "SALES" | "FINANCE" | "VIEWER";

export const ROLES: Role[] = ["SUPER_ADMIN", "MANAGEMENT", "SALES", "FINANCE", "VIEWER"];

export const ROLE_LABEL: Record<Role, string> = {
  SUPER_ADMIN: "Founder / Super Admin",
  MANAGEMENT: "Management",
  SALES: "Sales",
  FINANCE: "Finance",
  VIEWER: "Viewer",
};

type Permission =
  | "pipeline.write"       // create/edit leads, deals, move stages
  | "clients.write"
  | "communications.write"
  | "documents.write"      // quotes/proformas/invoices
  | "payments.write"       // record/reconcile payments, refunds
  | "projects.write"
  | "settings.write"       // catalogue, quick items, packages
  | "tax.write"            // change tax configuration
  | "users.write"          // manage team/roles
  | "revenue.view";

const MATRIX: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    "pipeline.write", "clients.write", "communications.write", "documents.write",
    "payments.write", "projects.write", "settings.write", "tax.write", "users.write",
    "revenue.view",
  ],
  MANAGEMENT: [
    "pipeline.write", "clients.write", "communications.write", "documents.write",
    "projects.write", "revenue.view",
  ],
  SALES: [
    "pipeline.write", "clients.write", "communications.write", "documents.write",
  ],
  FINANCE: [
    "documents.write", "payments.write", "projects.write", "revenue.view",
  ],
  VIEWER: [],
};

export function can(role: Role, permission: Permission): boolean {
  return MATRIX[role]?.includes(permission) ?? false;
}
