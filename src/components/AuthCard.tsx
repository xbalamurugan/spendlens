import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { lovable } from "@/integrations/lovable/index";
import { cn } from "@/lib/utils";

type Tab = "login" | "signup";

function Field({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  right,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  right?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </label>
        {right}
      </div>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "mt-2 h-11 w-full rounded-lg border bg-card px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/70 transition-colors",
          error
            ? "border-destructive"
            : "border-border hover:border-muted-foreground/40 focus:border-primary",
        )}
      />
      {error && (
        <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-destructive">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}

export function AuthCard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const signInWithGoogle = async () => {
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error("Google sign-in didn't go through", {
          description: "The window may have been closed. Please try again.",
        });
        setGoogleLoading(false);
        return;
      }
      if (result.redirected) return; // browser is heading to Google; it returns to this page
      navigate({ to: "/dashboard" });
    } catch {
      toast.error("Google sign-in didn't go through", {
        description: "The window may have been closed. Please try again.",
      });
      setGoogleLoading(false);
    }
  };

  const submit = () => {
    const next: Record<string, string> = {};
    if (tab === "signup" && name.trim().length < 2) next["name"] = "Please enter your full name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next["email"] = "Invalid email format";
    if (password.length < 6) next["password"] = "Password must be at least 6 characters";
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate({ to: "/dashboard" });
    }, 1000);
  };

  return (
    <div className="flex min-h-[440px] w-full flex-col rounded-2xl border border-border bg-card p-8">
      <div className="grid grid-cols-2">
        {(["login", "signup"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setErrors({});
            }}
            className={cn(
              "flex h-12 items-center justify-center border-b-2 text-xs font-bold uppercase tracking-widest transition-colors",
              tab === t
                ? "border-primary text-primary"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {t === "login" ? "Log In" : "Sign Up"}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4">
        {tab === "signup" && (
          <Field
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChange={setName}
            {...(errors["name"] ? { error: errors["name"] } : {})}
          />
        )}
        <Field
          label="Email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={setEmail}
          {...(errors["email"] ? { error: errors["email"] } : {})}
        />
        <Field
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={setPassword}
          {...(errors["password"] ? { error: errors["password"] } : {})}
          {...(tab === "login"
            ? {
                right: (
                  <button className="text-xs font-semibold text-primary hover:underline">
                    Forgot?
                  </button>
                ),
              }
            : {})}
        />
      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={submit}
          disabled={loading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-xs font-bold uppercase tracking-widest text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-70"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? (tab === "login" ? "Logging in" : "Creating") : tab === "login" ? "Log in" : "Create account"}
        </button>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate({ to: "/dashboard" })}
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            Continue as guest
          </button>
        </div>
      </div>
    </div>
  );
}
