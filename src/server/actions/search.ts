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
export async function globalSearchAction(rawQuery: string): Promise<SearchResult[]> {
  await requireUserOrThrow();
  const q = rawQuery.trim();
  if (q.length < 2) return [];

  const [companies, contacts, leads, deals, documents, tasks] = await Promise.all([
    db.company.findMany({
      where: { OR: [{ name: { contains: q } }, { phone: { contains: q } }, { email: { contains: q } }] },
      take: 5,
    }),
    db.contact.findMany({
      where: { OR: [{ name: { contains: q } }, { phone: { contains: q } }] },
      include: { company: true },
      take: 5,
    }),
    db.lead.findMany({
      where: { OR: [{ name: { contains: q } }, { companyNameRaw: { contains: q } }, { phone: { contains: q } }] },
      take: 5,
    }),
    db.deal.findMany({
      where: { title: { contains: q } },
      include: { company: true },
      take: 5,
    }),
    db.salesDocument.findMany({
      where: { number: { contains: q } },
      include: { company: true },
      take: 5,
    }),
    db.task.findMany({
      where: { title: { contains: q }, status: "OPEN" },
      take: 5,
    }),
  ]);

  const results: SearchResult[] = [
    ...companies.map(c => ({ type: "Client", id: c.id, title: c.name, subtitle: c.industry ?? undefined, href: `/app/clients/${c.id}` })),
    ...contacts.map(c => ({ type: "Contact", id: c.id, title: c.name, subtitle: c.company?.name, href: `/app/clients/${c.companyId}` })),
    // Leads have no detail route of their own (they become Deals) — link
    // to the list rather than a per-lead URL that would 404.
    ...leads.map(l => ({ type: "Lead", id: l.id, title: l.name, subtitle: l.companyNameRaw ?? undefined, href: `/app/leads` })),
    ...deals.map(d => ({ type: "Deal", id: d.id, title: d.title, subtitle: d.company?.name, href: `/app/deals/${d.id}` })),
    ...documents.map(doc => ({ type: doc.type, id: doc.id, title: doc.number, subtitle: doc.company?.name, href: `/app/quotes/${doc.id}` })),
    // Tasks have no detail route either — link to the list.
    ...tasks.map(t => ({ type: "Task", id: t.id, title: t.title, subtitle: t.dueAt ? undefined : "No due date", href: `/app/tasks` })),
  ];

  return results.slice(0, 20);
}
