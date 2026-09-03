"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Eye, EyeOff, ArrowRight, ArrowLeft, Zap, KeyRound } from "lucide-react";
import { loginAction, type LoginState } from "@/server/actions/auth";
import { primeSonicLogo } from "@/lib/os/sonicLogo";

const initialState: LoginState = {};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Step = "email" | "password";

/**
 * Sign-in as a single focused card, one decision at a time:
 * email → Continue → password. The email step is purely client-side
 * (no request); both fields live in one <form> so the server action
 * still receives the full payload on submit. Field ids/names are the
 * ones the auth action and any automation already target.
 */
export function LoginForm({ next = "/app" }: { next?: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const [step, setStep] = useState<Step>("email");
  const [direction, setDirection] = useState<"in" | "back">("in");
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [shake, setShake] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const emailValid = EMAIL_RE.test(email.trim());

  useEffect(() => {
    if (step === "password") passwordRef.current?.focus();
    else emailRef.current?.focus();
  }, [step]);

  // A server-side error (wrong password) lands us back on the password step.
  useEffect(() => {
    if (state.error) {
      setStep("password");
      setShake(true);
      const t = setTimeout(() => setShake(false), 600);
      return () => clearTimeout(t);
    }
  }, [state]);

  function goToPassword() {
    setEmailTouched(true);
    if (!emailValid) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    setDirection("in");
    setStep("password");
  }

  function goToEmail() {
    setDirection("back");
    setStep("email");
  }

  return (
    <div className="auth-card relative w-full max-w-[440px]">
      <div className="relative rounded-[28px] bg-[var(--surface)] shadow-[0_24px_80px_-24px_rgba(17,15,30,0.28),0_2px_8px_rgba(17,15,30,0.06)] border border-[var(--border)]">
        <div className="auth-halo rounded-[28px]" aria-hidden="true" />

        <div className="relative px-8 pt-9 pb-8 sm:px-10">
          {/* Brand */}
          <div className="flex items-center gap-2.5 mb-8">
            <div
              className="w-9 h-9 rounded-[11px] flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))", boxShadow: "var(--shadow-glow)" }}
            >
              <Zap className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="text-sm font-bold tracking-wide text-[var(--text)]" style={{ fontFamily: "var(--font-display)" }}>
              TECHFIND
            </span>
          </div>

          <form
            action={formAction}
            onSubmit={(e) => {
              if (step === "email") {
                e.preventDefault();
                goToPassword();
                return;
              }
              primeSonicLogo();
            }}
            noValidate
          >
            <input type="hidden" name="next" value={next} />

            {/* ── Step: email ── */}
            <div className={step === "email" ? (direction === "back" ? "auth-step-back" : "") : "hidden"}>
              <h1 className="text-[1.75rem] leading-tight font-bold tracking-tight text-[var(--text)]" style={{ fontFamily: "var(--font-display)" }}>
                Welcome back
              </h1>
              <p className="mt-1.5 mb-7 text-[15px] text-[var(--text-muted)]">Enter your work email to continue.</p>

              <div className={`auth-field ${shake && step === "email" ? "auth-shake" : ""}`} data-invalid={emailTouched && !emailValid ? "true" : "false"}>
                <input
                  ref={emailRef}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  inputMode="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      goToPassword();
                    }
                  }}
                  required
                />
                <label htmlFor="email">Work email</label>
              </div>
              {emailTouched && !emailValid && (
                <p className="mt-2 text-xs font-medium text-[var(--danger)]">Enter a valid email address to continue.</p>
              )}

              <button
                type="button"
                onClick={goToPassword}
                className="group mt-5 w-full h-[54px] rounded-[var(--radius-lg)] text-white text-[15px] font-semibold inline-flex items-center justify-center gap-2 transition-all active:scale-[0.985] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-glow)]"
                style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}
              >
                Continue
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>

              <div className="my-6 flex items-center gap-4">
                <span className="h-px flex-1 bg-[var(--border)]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-faint)]">or</span>
                <span className="h-px flex-1 bg-[var(--border)]" />
              </div>

              <div
                className="flex items-start gap-3 rounded-[var(--radius-lg)] px-4 py-3.5 border border-[var(--border)] bg-[var(--surface-hover)]"
              >
                <KeyRound className="w-4 h-4 mt-0.5 shrink-0 text-[var(--text-muted)]" />
                <p className="text-[13px] leading-snug text-[var(--text-muted)]">
                  Access is by invitation. If you don&apos;t have an account yet, ask your administrator to add you.
                </p>
              </div>
            </div>

            {/* ── Step: password ── */}
            <div className={step === "password" ? "auth-step-in" : "hidden"}>
              <button
                type="button"
                onClick={goToEmail}
                className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>

              <h1 className="text-[1.75rem] leading-tight font-bold tracking-tight text-[var(--text)]" style={{ fontFamily: "var(--font-display)" }}>
                Enter your password
              </h1>

              {/* Email chip */}
              <button
                type="button"
                onClick={goToEmail}
                className="mt-3 mb-6 inline-flex max-w-full items-center gap-2 rounded-full pl-1 pr-3 py-1 border border-[var(--border)] bg-[var(--surface-hover)] hover:border-[var(--border-strong)] transition-colors"
                title="Change email"
              >
                <span
                  className="w-6 h-6 rounded-full text-white text-[11px] font-bold flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}
                >
                  {email.trim().charAt(0).toUpperCase() || "?"}
                </span>
                <span className="truncate text-[13px] font-medium text-[var(--text)]">{email.trim()}</span>
                <span className="text-[12px] text-[var(--accent)] font-semibold shrink-0">Edit</span>
              </button>

              <div className={`auth-field ${shake && step === "password" ? "auth-shake" : ""}`} data-invalid={state.error ? "true" : "false"}>
                <input
                  ref={passwordRef}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Password"
                  required
                  onKeyUp={(e) => setCapsLock(e.getModifierState?.("CapsLock") ?? false)}
                />
                <label htmlFor="password">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-[var(--text-faint)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="mt-2 min-h-[1.25rem] flex items-center justify-between gap-3">
                <p className={`text-xs font-medium ${state.error ? "text-[var(--danger)]" : capsLock ? "text-[var(--warning)]" : "text-transparent"}`} role={state.error ? "alert" : undefined}>
                  {state.error ?? (capsLock ? "Caps Lock is on" : ".")}
                </p>
                <a href="#" className="text-xs font-semibold shrink-0 hover:underline" style={{ color: "var(--accent)" }}>
                  Forgot password?
                </a>
              </div>

              <label className="mt-4 flex items-center gap-2.5 text-[13px] text-[var(--text-muted)] cursor-pointer select-none">
                <input type="checkbox" name="remember" defaultChecked className="w-4 h-4 rounded accent-[var(--accent)]" />
                Keep me signed in on this device
              </label>

              <button
                type="submit"
                disabled={pending}
                className="group mt-5 w-full h-[54px] rounded-[var(--radius-lg)] text-white text-[15px] font-semibold inline-flex items-center justify-center gap-2 transition-all active:scale-[0.985] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-glow)] disabled:opacity-60 disabled:pointer-events-none"
                style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}
              >
                {pending ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-[var(--text-faint)]">
        Your business. In control. · Nairobi, Kenya
      </p>
    </div>
  );
}
