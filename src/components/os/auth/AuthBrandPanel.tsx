import { Zap, TrendingUp, Users, Receipt, ShieldCheck } from "lucide-react";

/**
 * Left-hand brand panel for the sign-in screen. Pure server-rendered
 * markup + CSS animation (see the "Auth screens" block in globals.css) —
 * deliberately no Framer so /login stays light.
 *
 * Always dark, regardless of the OS's (inert) theme: it's a brand
 * surface, not a UI surface, and the dark canvas is what makes the
 * fuchsia/indigo accent read as premium rather than loud.
 */
export function AuthBrandPanel() {
  return (
    <aside
      aria-hidden="true"
      className="relative hidden lg:flex flex-col justify-between overflow-hidden p-12 xl:p-16 text-white select-none"
      style={{ background: "#0D0B15" }}
    >
      {/* Aurora */}
      <div className="auth-aurora" style={{ width: 620, height: 620, top: "-18%", left: "-14%", background: "rgba(192, 38, 211, 0.45)" }} />
      <div className="auth-aurora auth-aurora-2" style={{ width: 560, height: 560, bottom: "-22%", right: "-16%", background: "rgba(79, 70, 229, 0.5)" }} />
      <div className="auth-aurora" style={{ width: 380, height: 380, top: "40%", left: "42%", background: "rgba(232, 121, 249, 0.18)", animationDuration: "30s" }} />
      <div className="absolute inset-0 auth-grid" />

      {/* Top: wordmark */}
      <div className="relative flex items-center gap-3 auth-rise auth-rise-1">
        <div
          className="w-10 h-10 rounded-[12px] flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #E879F9, #818CF8)", boxShadow: "0 8px 32px rgba(232,121,249,0.35)" }}
        >
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold tracking-wide" style={{ fontFamily: "var(--font-display)" }}>TECHFIND</p>
          <p className="text-[11px] text-white/55">Revenue OS</p>
        </div>
      </div>

      {/* Middle: headline + mini pipeline */}
      <div className="relative max-w-lg">
        <p className="auth-rise auth-rise-2 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60 mb-6">
          <span className="auth-live-dot w-1.5 h-1.5 rounded-full" style={{ background: "#E879F9" }} />
          Live in Nairobi · built for Kenyan business
        </p>
        <h2
          className="auth-rise auth-rise-2 text-[2.75rem] xl:text-[3.25rem] font-bold leading-[1.05] tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Your business.
          <br />
          <span
            style={{
              background: "linear-gradient(90deg, #E879F9 0%, #C084FC 50%, #818CF8 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            In control.
          </span>
        </h2>
        <p className="auth-rise auth-rise-3 mt-5 text-base text-white/65 leading-relaxed">
          Every lead, deal, quote, invoice and payment in one place — so the numbers you run
          the company on are the same numbers your team sees.
        </p>

        {/* Faux pipeline card */}
        <div
          className="auth-rise auth-rise-4 mt-10 rounded-2xl p-5 backdrop-blur-md"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", boxShadow: "0 24px 64px rgba(0,0,0,0.45)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-white/70">This month</p>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(34,197,94,0.15)", color: "#4ADE80" }}>
              +18% vs last
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Users,      label: "Leads",   value: "142" },
              { icon: TrendingUp, label: "Deals",   value: "37"  },
              { icon: Receipt,    label: "Paid",    value: "KES 4.2M" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <Icon className="w-3.5 h-3.5 text-white/50 mb-2" />
                <p className="text-lg font-bold leading-none" style={{ fontFamily: "var(--font-space)" }}>{value}</p>
                <p className="text-[10px] text-white/50 mt-1">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div className="h-full rounded-full" style={{ width: "68%", background: "linear-gradient(90deg, #E879F9, #818CF8)" }} />
          </div>
          <p className="mt-2 text-[10px] text-white/45">68% of quarterly target</p>
        </div>
      </div>

      {/* Bottom: trust line */}
      <div className="relative flex items-center gap-2 text-xs text-white/45 auth-rise auth-rise-4">
        <ShieldCheck className="w-3.5 h-3.5" />
        Role-based access · every action audited · M-Pesa &amp; card payments via IntaSend
      </div>
    </aside>
  );
}
