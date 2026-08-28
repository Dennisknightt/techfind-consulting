import "server-only";
import dayjs from "dayjs";
import { getAttentionItems, getOpportunityItems } from "./rules";
import { getIntelligenceSnapshot } from "./snapshot";

function kes(n: number): string {
  return `KES ${new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(Math.round(n))}`;
}

/**
 * Assembles a markdown briefing of Techfind's current commercial state —
 * pipeline, revenue, projects, attention items, opportunities — meant to
 * be pasted straight into a Claude conversation for analysis or planning.
 * No external API call: this is the export itself, built entirely from
 * Techfind's own data.
 */
export async function buildClaudeBriefing(): Promise<string> {
  const [snapshot, attention, opportunities] = await Promise.all([
    getIntelligenceSnapshot(),
    getAttentionItems(),
    getOpportunityItems(),
  ]);

  const lines: string[] = [];
  lines.push(`# Techfind Consulting — Business Snapshot`);
  lines.push(`_Generated ${dayjs().format("D MMMM YYYY, h:mm A")}_`);
  lines.push("");

  lines.push(`## Pipeline`);
  lines.push(`Open pipeline value: **${kes(snapshot.pipelineValue)}** across ${snapshot.pipeline.reduce((s, b) => s + b.count, 0)} open opportunities.`);
  if (snapshot.stalledDealCount > 0) lines.push(`⚠️ ${snapshot.stalledDealCount} deal(s) have sat in their current stage for more than 7 days.`);
  lines.push("");
  lines.push(`| Stage | Count | Value |`);
  lines.push(`|---|---|---|`);
  for (const b of snapshot.pipeline) if (b.count > 0) lines.push(`| ${b.label} | ${b.count} | ${kes(b.value)} |`);
  lines.push("");

  lines.push(`## Revenue`);
  lines.push(`- Received this week: **${kes(snapshot.revenue.receivedThisWeek)}**`);
  lines.push(`- Received this month: **${kes(snapshot.revenue.receivedThisMonth)}**`);
  lines.push(`- Received all-time: **${kes(snapshot.revenue.receivedAllTime)}**`);
  lines.push(`- Expected (outstanding balances on sent proformas): **${kes(snapshot.revenue.expected)}**`);
  if (snapshot.revenue.recurringMonthly > 0) lines.push(`- Recurring revenue: **${kes(snapshot.revenue.recurringMonthly)}/mo**`);
  lines.push("");

  if (snapshot.projects.some(b => b.count > 0)) {
    lines.push(`## Projects in Delivery`);
    for (const b of snapshot.projects) if (b.count > 0) lines.push(`- ${b.label}: ${b.count}`);
    if (snapshot.projectsOverdue > 0) lines.push(`⚠️ ${snapshot.projectsOverdue} project(s) are past their target live date.`);
    lines.push("");
  }

  if (snapshot.topClients.length > 0) {
    lines.push(`## Top Clients by Lifetime Value`);
    for (const c of snapshot.topClients) lines.push(`- ${c.name}: ${kes(c.lifetimeValue)} across ${c.dealCount} won deal(s)`);
    lines.push("");
  }

  if (snapshot.teamPerformance.length > 0) {
    lines.push(`## Team Performance (won deals)`);
    for (const t of snapshot.teamPerformance) lines.push(`- ${t.name}: ${t.wonCount} won, ${kes(t.wonValue)}`);
    lines.push("");
  }

  lines.push(`## Needs Attention`);
  if (attention.length === 0) {
    lines.push(`Nothing urgent right now.`);
  } else {
    for (const item of attention) {
      lines.push(`- **${item.title}** — ${item.description}${item.valueAtRisk ? ` (${kes(item.valueAtRisk)} at risk)` : ""}`);
    }
  }
  lines.push("");

  if (opportunities.length > 0) {
    lines.push(`## Opportunities`);
    for (const item of opportunities) {
      lines.push(`- **${item.title}** — ${item.description} (potential ${kes(item.potentialValue)})`);
    }
    lines.push("");
  }

  lines.push(`---`);
  lines.push(`_Ask Claude: "What should Techfind prioritize this week based on this snapshot?"_`);

  return lines.join("\n");
}
