"use server";

import { db } from "@/server/db";
import { requireUserOrThrow } from "@/server/auth/guard";

export interface SearchResult {
  type: string;
  id: string;
  title: string;
  subtitle?: string;
  href: string;
}

/**
 * Global "Ask Techfind" search. V1 is a straightforward multi-entity
 * substring search — good enough to make ⌘K feel instant. A ranked/fuzzy
 * index is a natural upgrade once there's real usage data to tune against.
 */
const ci = (contains: string) => ({ contains, mode: "insensitive" as const });

export async function globalSearchAction(rawQuery: string): Promise<SearchResult[]> {
  await requireUserOrThrow();
  const q = rawQuery.trim();
  if (q.length < 2) return [];

  const [companies, contacts, leads, deals, documents, tasks, payments, projects, meetings] = await Promise.all([
    db.company.findMany({
      where: { OR: [{ name: ci(q) }, { phone: ci(q) }, { email: ci(q) }, { industry: ci(q) }] },
      take: 5,
    }),
    db.contact.findMany({
      where: { OR: [{ name: ci(q) }, { phone: ci(q) }] },
      include: { company: true },
      take: 5,
    }),
    db.lead.findMany({
      where: { OR: [{ name: ci(q) }, { companyNameRaw: ci(q) }, { phone: ci(q) }, { email: ci(q) }] },
      take: 5,
    }),
    db.deal.findMany({
      where: { OR: [{ title: ci(q) }, { company: { name: ci(q) } }] },
      include: { company: true },
      take: 5,
    }),
    db.salesDocument.findMany({
      where: { OR: [{ number: ci(q) }, { company: { name: ci(q) } }] },
      include: { company: true },
      take: 5,
    }),
    db.task.findMany({
      where: { title: ci(q), status: "OPEN" },
      take: 5,
    }),
    db.payment.findMany({
      where: { OR: [{ reference: ci(q) }, { gatewayReference: ci(q) }, { company: { name: ci(q) } }] },
      include: { company: true },
      take: 5,
    }),
    db.project.findMany({
      where: { OR: [{ name: ci(q) }, { company: { name: ci(q) } }] },
      include: { company: true },
      take: 5,
    }),
    db.meeting.findMany({
      where: { OR: [{ agenda: ci(q) }, { company: { name: ci(q) } }], status: "SCHEDULED" },
      include: { company: true },
      take: 5,
    }),
  ]);

  const results: SearchResult[] = [
    ...companies.map(c => ({ type: "Client", id: c.id, title: c.name, subtitle: c.industry ?? undefined, href: `/app/clients/${c.id}` })),
    ...contacts.map(c => ({ type: "Contact", id: c.id, title: c.name, subtitle: c.company?.name, href: `/app/clients/${c.companyId}` })),
    ...leads.map(l => ({ type: "Lead", id: l.id, title: l.name, subtitle: l.companyNameRaw ?? undefined, href: `/app/leads/${l.id}` })),
    ...deals.map(d => ({ type: "Deal", id: d.id, title: d.title, subtitle: d.company?.name, href: `/app/deals/${d.id}` })),
    ...documents.map(doc => ({ type: doc.type, id: doc.id, title: doc.number, subtitle: doc.company?.name, href: `/app/quotes/${doc.id}` })),
    // Tasks, Payments and Meetings have no detail route of their own — link to the list.
    ...tasks.map(t => ({ type: "Task", id: t.id, title: t.title, subtitle: t.dueAt ? undefined : "No due date", href: `/app/tasks` })),
    ...payments.map(p => ({ type: "Payment", id: p.id, title: p.reference, subtitle: p.company?.name, href: `/app/payments` })),
    ...projects.map(p => ({ type: "Project", id: p.id, title: p.name, subtitle: p.company?.name, href: `/app/projects/${p.id}` })),
    ...meetings.map(m => ({ type: "Meeting", id: m.id, title: m.agenda || m.company.name, subtitle: m.company.name, href: `/app/meetings` })),
  ];

  return results.slice(0, 20);
}
