"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  }

  if (!mounted) return null;

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div style={{ width: "100%", maxWidth: "420px" }} className="bg-card border border-border p-8 sm:p-10 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-light text-foreground mb-2">Sign In</h1>
          <p className="text-sm text-muted-foreground">Admin access required</p>
        </div>

        {error && (
          <div className="p-3 bg-card border border-border rounded text-accent text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-widest text-muted-foreground">
              Email
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-border bg-background text-foreground placeholder-muted-foreground text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-widest text-muted-foreground">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-border bg-background text-foreground placeholder-muted-foreground text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-foreground text-background uppercase tracking-widest text-xs font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Back to store
          </Link>
        </div>
      </div>
    </main>
  );
}
