"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { PRIMARY_NAV, type NavItem } from "./nav";
import { MoreSheet } from "./MoreSheet";
import { QuickCreateSheet } from "./QuickCreate";

// PRIMARY_NAV is [Home, Leads, Pipeline, Money, Activity, More] — the FAB
// is inserted between the first three and the last three so it lands
// dead-centre regardless of how the six items are labeled.
const LEFT = PRIMARY_NAV.slice(0, 3);
const RIGHT = PRIMARY_NAV.slice(3, 6);

export function MobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-[250] border-t safe-bottom"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div className="relative flex items-stretch justify-between px-1">
          {LEFT.map(item => (
            <MobileNavItem key={item.href} item={item} active={pathname === item.href} onMore={() => setMoreOpen(true)} />
          ))}

          {/* Centre FAB */}
          <div className="flex items-center justify-center px-1">
            <button
              onClick={() => setCreateOpen(true)}
              aria-label="Quick create"
              className="os-press -mt-6 rounded-full flex items-center justify-center text-white"
              style={{
                width: 52, height: 52,
                background: "var(--accent)",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          {RIGHT.map(item => (
            <MobileNavItem key={item.href} item={item} active={pathname === item.href} onMore={() => setMoreOpen(true)} />
          ))}
        </div>
      </nav>

      <MoreSheet open={moreOpen} onOpenChange={setMoreOpen} />
      <QuickCreateSheet open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
}

function MobileNavItem({ item, active, onMore }: { item: NavItem; active: boolean; onMore: () => void }) {
  const Icon = item.icon;
  if (item.href === "#more") {
    return (
      <button
        onClick={onMore}
        className="os-press flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-w-0"
        style={{ color: "var(--text-faint)" }}
      >
        <Icon className="w-5 h-5" />
        <span className="text-[10px] font-medium">{item.label}</span>
      </button>
    );
  }
  return (
    <Link
      href={item.href}
      className="os-press flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-w-0"
      style={{ color: active ? "var(--accent)" : "var(--text-faint)" }}
    >
      <Icon className="w-5 h-5" />
      <span className="text-[10px] font-medium">{item.label}</span>
    </Link>
  );
}
