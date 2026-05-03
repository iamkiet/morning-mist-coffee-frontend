import type { ReactNode } from "react";
import { Badge as ShadcnBadge } from "@/components/ui/badge";

type Status =
  | "success"
  | "info"
  | "warning"
  | "neutral"
  | "error"
  | "primary"
  | "purple"
  | "pink"
  | "indigo";

interface BadgeProps {
  children: ReactNode;
  status?: Status;
}

const statusCls: Record<Status, string> = {
  success: "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200",
  info: "bg-sky-100 text-sky-800 border-sky-300 hover:bg-sky-200",
  warning: "bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200",
  neutral: "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200",
  error: "bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200",
  primary: "bg-primary text-primary-foreground border-primary hover:bg-primary/90",
  purple: "bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200",
  pink: "bg-pink-100 text-pink-800 border-pink-300 hover:bg-pink-200",
  indigo: "bg-indigo-100 text-indigo-800 border-indigo-300 hover:bg-indigo-200",
};

export function Badge({ children, status = "neutral" }: BadgeProps) {
  return (
    <ShadcnBadge
      variant="outline"
      className={`uppercase text-[10px] tracking-wider font-semibold px-2.5 py-0.5 border transition-colors ${statusCls[status]}`}
    >
      {children}
    </ShadcnBadge>
  );
}
