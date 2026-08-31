"use client";

import { useActionState } from "react";
import { Eye, EyeOff, Zap } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { loginAction, type LoginState } from "@/server/actions/auth";
import { Button } from "@/components/os/ui/Button";
import { Input, Label } from "@/components/os/ui/Input";
import { primeSonicLogo } from "@/lib/os/sonicLogo";

const initialState: LoginState = {};

export function LoginForm({ next = "/app" }: { next?: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-sm">
      <div className="flex flex-col items-center mb-9 text-center">
        <div
          className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-4"
          style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))", boxShadow: "var(--shadow-glow)" }}
        >
          <Zap className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>
          TECHFIND
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1.5">Your business. In control.</p>
      </div>

      {/*
        Unlock audio synchronously inside this real click/submit gesture,
        before the redirect to /app — see sonicLogo.ts for why WelcomeExperience
        can't reliably start audio on its own after landing there.
      */}
      <form action={formAction} onSubmit={() => primeSonicLogo()} className="space-y-4">
        <input type="hidden" name="next" value={next} />
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="username" required placeholder="you@techfind.co.ke" />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)] hover:text-[var(--text-muted)]"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {state.error && (
          <p className="text-xs font-medium text-[var(--danger)] rounded-[var(--radius-md)] px-3 py-2" style={{ background: "var(--danger-soft)" }}>
            {state.error}
          </p>
        )}

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-xs text-[var(--text-muted)] cursor-pointer">
            <input type="checkbox" name="remember" defaultChecked className="rounded accent-[var(--accent)]" />
            Remember Me
          </label>
          <Link href="#" className="text-xs font-medium" style={{ color: "var(--accent)" }}>
            Forgot Password
          </Link>
        </div>

        <Button type="submit" size="lg" loading={pending} className="w-full mt-2">
          Sign In
        </Button>
      </form>
    </div>
  );
}
