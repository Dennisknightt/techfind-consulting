/**
 * Project stage constants — kept in a plain (non "use server") module so
 * Client Components can import them directly, matching the pattern in
 * ./pipeline.ts (a "use server" file may only export async functions
 * across the server/client boundary; a plain array export silently breaks
 * at runtime on the client).
 */

export const PROJECT_STAGES = [
  "DEPOSIT", "REQUIREMENTS", "DESIGN", "DEVELOPMENT", "CLIENT_REVIEW",
  "CHANGES", "DEPLOYMENT", "TRAINING", "LIVE", "MAINTENANCE",
] as const;

export type ProjectStage = (typeof PROJECT_STAGES)[number];

export const PROJECT_STAGE_LABEL: Record<string, string> = {
  DEPOSIT: "Deposit Paid",
  REQUIREMENTS: "Requirements",
  DESIGN: "Design",
  DEVELOPMENT: "Development",
  CLIENT_REVIEW: "Client Review",
  CHANGES: "Changes",
  DEPLOYMENT: "Deployment",
  TRAINING: "Training",
  LIVE: "Live",
  MAINTENANCE: "Maintenance",
};

export function projectStageIndex(stage: string): number {
  const i = PROJECT_STAGES.indexOf(stage as ProjectStage);
  return i === -1 ? 0 : i;
}
