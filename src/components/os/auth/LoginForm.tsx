"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, Zap, Mail, Lock, ArrowRight } from "lucide-react";
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
      {/* Compact brand mark — the full brand panel is hidden below lg */}
      <div className="flex items-center gap-3 mb-10 lg:hidden auth-rise auth-rise-1">
        <div
          className="w-10 h-10 rounded-[12px] flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))", boxShadow: "var(--shadow-glow)" }}
        >
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold tracking-wide text-[var(--text)]" style={{ fontFamily: "var(--font-display)" }}>TECHFIND</p>
          <p className="text-[11px] text-[var(--text-muted)]">Revenue OS</p>
        </div>
      </div>

      <div className="mb-8 auth-rise auth-rise-1">
        <h1
          className="text-[2rem] font-bold tracking-tight text-[var(--text)] leading-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Welcome back
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-2">
          Sign in to pick up where you left off.
        </p>
      </div>

      {/*
        Unlock audio synchronously inside this real click/submit gesture,
        before the redirect to /app — see sonicLogo.ts for why WelcomeExperience
        can't reliably start audio on its own after landing there.
      */}
      <form action={formAction} onSubmit={() => primeSonicLogo()} className="space-y-5">
        <input type="hidden" name="next" value={next} />

        <div className="auth-rise auth-rise-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-faint)]" />
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              placeholder="you@techfind.co.ke"
              className="h-11 pl-10"
            />
          </div>
        </div>

        <div className="auth-rise auth-rise-3">
          <div className="flex items-center justify-between mb-1.5">
            <Label htmlFor="password" className="mb-0">Password</Label>
            <Link href="#" className="text-xs font-medium hover:underline" style={{ color: "var(--accent)" }}>
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-faint)]" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="••••••••••"
              className="h-11 pl-10 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-[var(--text-faint)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {state.error && (
          <p
            role="alert"
            className="text-xs font-medium text-[var(--danger)] rounded-[var(--radius-md)] px-3 py-2.5"
            style={{ background: "var(--danger-soft)", border: "1px solid color-mix(in srgb, var(--danger) 25%, transparent)" }}
          >
            {state.error}
          </p>
        )}

        <div className="auth-rise auth-rise-3 flex items-center pt-0.5">
          <label className="flex items-center gap-2 text-xs text-[var(--text-muted)] cursor-pointer select-none">
            <input type="checkbox" name="remember" defaultChecked className="w-3.5 h-3.5 rounded accent-[var(--accent)]" />
            Keep me signed in on this device
          </label>
        </div>

        <Button type="submit" size="lg" loading={pending} className="auth-rise auth-rise-4 w-full h-12 text-[15px] font-semibold group">
          Sign in
          {!pending && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />}
        </Button>
      </form>

      <p className="mt-8 text-center text-xs text-[var(--text-faint)] auth-rise auth-rise-4">
        Access is by invitation. Ask your administrator if you need an account.
      </p>
    </div>
  );
}
