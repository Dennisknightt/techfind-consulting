"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { RevDashboard }    from "./tabs/RevDashboard";
import { ProspectDiscovery } from "./tabs/ProspectDiscovery";
import { ProspectAudit }   from "./tabs/ProspectAudit";
import { LeadScoring }     from "./tabs/LeadScoring";
import { OutreachAgent }   from "./tabs/OutreachAgent";
import { CalendarBooking } from "./tabs/CalendarBooking";
import { ProposalGenerator } from "./tabs/ProposalGenerator";
import { CRMPipeline }     from "./tabs/CRMPipeline";
import { Communications }  from "./tabs/Communications";
import { AdminSettings }   from "./tabs/AdminSettings";

function RevenueEngineInner() {
  const params = useSearchParams();
  const tab = params.get("tab") ?? "dashboard";

  const map: Record<string, React.ReactNode> = {
    dashboard:  <RevDashboard />,
    discovery:  <ProspectDiscovery />,
    audit:      <ProspectAudit />,
    scoring:    <LeadScoring />,
    outreach:   <OutreachAgent />,
    calendar:   <CalendarBooking />,
    proposals:  <ProposalGenerator />,
    crm:        <CRMPipeline />,
    communications: <Communications />,
    settings:   <AdminSettings />,
  };

  return <>{map[tab] ?? <RevDashboard />}</>;
}

export function RevenueEngine() {
  return (
    <Suspense fallback={<div className="p-8 text-[var(--muted)]">Loading…</div>}>
      <RevenueEngineInner />
    </Suspense>
  );
}
