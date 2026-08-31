"use client";

import { useState, useTransition } from "react";
import { Volume2, Play } from "lucide-react";
import { Switch } from "@/components/os/ui/Switch";
import { Button } from "@/components/os/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/os/ui/Card";
import { playSonicLogo } from "@/lib/os/sonicLogo";
import { updateExperienceSettingsAction } from "@/server/actions/settings";
import { toast } from "sonner";
import { ThemeToggleSegmented } from "@/components/os/shell/ThemeToggle";

function AppearanceCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-semibold text-[var(--text)] mb-2.5">Theme</p>
        <ThemeToggleSegmented />
        <p className="text-xs text-[var(--text-faint)] mt-3">
          &ldquo;System&rdquo; follows your device&rsquo;s light/dark setting automatically.
        </p>
      </CardContent>
    </Card>
  );
}

export function ExperienceSettings({
  initialEnabled,
  initialVolume,
}: {
  initialEnabled: boolean;
  initialVolume: number;
}) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [volume, setVolume] = useState(initialVolume);
  const [previewing, setPreviewing] = useState(false);
  const [pending, startTransition] = useTransition();

  function persist(next: { enabled?: boolean; volume?: number }) {
    const enabled2 = next.enabled ?? enabled;
    const volume2 = next.volume ?? volume;
    startTransition(async () => {
      try {
        await updateExperienceSettingsAction({ welcomeSoundEnabled: enabled2, welcomeSoundVolume: volume2 });
      } catch {
        toast.error("Couldn't save your preference. Try again.");
      }
    });
  }

  async function preview() {
    setPreviewing(true);
    await playSonicLogo(volume);
    setPreviewing(false);
  }

  return (
    <div className="space-y-5">
      <AppearanceCard />
      <Card>
      <CardHeader>
        <CardTitle>Experience</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">Welcome Sound</p>
            <p className="text-xs text-[var(--text-faint)] mt-0.5">
              A short chime plays once per session when you first sign in.
            </p>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={(v) => { setEnabled(v); persist({ enabled: v }); }}
            disabled={pending}
          />
        </div>

        <div className={enabled ? "" : "opacity-40 pointer-events-none"}>
          <p className="text-sm font-semibold text-[var(--text)] mb-2.5">Volume</p>
          <div className="flex items-center gap-3">
            <Volume2 className="w-4 h-4 shrink-0" style={{ color: "var(--text-faint)" }} />
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              onMouseUp={() => persist({ volume })}
              onTouchEnd={() => persist({ volume })}
              className="flex-1 accent-[var(--accent)]"
            />
            <span className="text-xs text-[var(--text-faint)] w-9 text-right shrink-0">{Math.round(volume * 100)}%</span>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={preview}
            loading={previewing}
            disabled={!enabled}
            className="mt-4 gap-1.5"
          >
            <Play className="w-3.5 h-3.5" /> Preview
          </Button>
        </div>
      </CardContent>
      </Card>
    </div>
  );
}
