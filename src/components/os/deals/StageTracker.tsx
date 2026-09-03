"use client";

import { Check } from "lucide-react";
import { PIPELINE_STAGES, STAGE_LABEL } from "@/lib/os/pipeline";

/**
 * The "Deal Journey" — a clickable horizontal stepper standing in for the
 * old plain <Select> stage picker. Clicking any node calls onSelect with
 * that stage, same server action underneath (updateDealStageAction via
 * the parent's moveStage) — this is presentation only.
 */
export function StageTracker({ stage, onSelect }: { stage: string; onSelect: (s: string) => void }) {
  const currentIndex = PIPELINE_STAGES.indexOf(stage as (typeof PIPELINE_STAGES)[number]);
  const isLost = stage === "LOST";

  return (
    <div className="flex items-start overflow-x-auto pb-1 -mx-1 px-1 os-text-meta">
      {PIPELINE_STAGES.map((s, i) => {
        const done = !isLost && i < currentIndex;
        const active = !isLost && i === currentIndex;
        return (
          <div key={s} className="flex items-start shrink-0">
            {i > 0 && (
              <div
                className="w-6 sm:w-9 h-[2px] shrink-0 mt-3.5 transition-colors"
                style={{ background: done ? "var(--accent)" : "var(--border)" }}
              />
            )}
            <button
              type="button"
              onClick={() => onSelect(s)}
              className="os-press flex flex-col items-center gap-1.5 px-1 w-16"
            >
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors"
                style={{
                  background: done ? "var(--accent)" : active ? "var(--accent-soft)" : "var(--surface-hover)",
                  color: done ? "#fff" : active ? "var(--accent)" : "var(--text-faint)",
                  border: active ? "2px solid var(--accent)" : "1px solid transparent",
                }}
              >
                {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </span>
              <span
                className="text-[10px] font-medium text-center leading-tight"
                style={{ color: active ? "var(--accent)" : done ? "var(--text)" : "var(--text-faint)" }}
              >
                {STAGE_LABEL[s]}
              </span>
            </button>
          </div>
        );
      })}
      {isLost && (
        <div className="flex items-start shrink-0">
          <div className="w-6 sm:w-9 h-[2px] shrink-0 mt-3.5" style={{ background: "var(--danger)" }} />
          <div className="flex flex-col items-center gap-1.5 px-1 w-16">
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
              style={{ background: "var(--danger-soft)", color: "var(--danger)", border: "2px solid var(--danger)" }}
            >
              ✕
            </span>
            <span className="text-[10px] font-medium text-center leading-tight" style={{ color: "var(--danger)" }}>Lost</span>
          </div>
        </div>
      )}
    </div>
  );
}
