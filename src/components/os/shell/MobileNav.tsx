"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { MOBILE_PRIMARY_NAV } from "./nav";
import { MoreSheet } from "./MoreSheet";
import { QuickCreateSheet, QUICK_CREATE_ITEMS } from "./QuickCreate";
import { can, type Role } from "@/server/auth/roles";

export function MobileNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const canCreateAnything = QUICK_CREATE_ITEMS.some(item => can(role, item.permission));

  return (
    <>
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-[250] border-t safe-bottom"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div className="relative flex items-stretch justify-between px-2">
          {MOBILE_PRIMARY_NAV.slice(0, 2).map(item => (
            <MobileNavLink key={item.href} item={item} active={pathname === item.href} />
          ))}

          {/* Centre FAB */}
          <div className="flex-1 flex items-center justify-center">
            {canCreateAnything && (
              <button
                onClick={() => setCreateOpen(true)}
                aria-label="Quick create"
                className="w-13 h-13 -mt-6 rounded-full flex items-center justify-center text-white active:scale-95 transition-transform"
                style={{
                  width: 52, height: 52,
                  background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
                  boxShadow: "var(--shadow-glow)",
                }}
              >
                <Plus className="w-6 h-6" />
              </button>
            )}
          </div>

          {MOBILE_PRIMARY_NAV.slice(2, 4).map(item => (
            <MobileNavLink key={item.href} item={item} active={pathname === item.href} />
          ))}
          <button
            onClick={() => setMoreOpen(true)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-w-0"
            style={{ color: "var(--text-faint)" }}
          >
            <MOBILE_PRIMARY_NAV_MORE_ICON />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>

      <MoreSheet open={moreOpen} onOpenChange={setMoreOpen} />
      <QuickCreateSheet role={role} open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
}

function MOBILE_PRIMARY_NAV_MORE_ICON() {
  const Icon = MOBILE_PRIMARY_NAV[4].icon;
  return <Icon className="w-5 h-5" />;
}

function MobileNavLink({ item, active }: { item: (typeof MOBILE_PRIMARY_NAV)[number]; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-w-0"
      style={{ color: active ? "var(--accent)" : "var(--text-faint)" }}
    >
      <Icon className="w-5 h-5" />
      <span className="text-[10px] font-medium">{item.label}</span>
    </Link>
  );
}
