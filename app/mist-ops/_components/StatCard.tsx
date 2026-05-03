import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  icon?: LucideIcon;
  progress?: number;
  tone?: "primary" | "secondary" | "tertiary";
}

const tonePalette = {
  primary: {
    fg: "text-primary",
    bg: "bg-accent/30",
    glow: "bg-accent/10",
  },
  secondary: {
    fg: "text-primary",
    bg: "bg-primary/10",
    glow: "bg-primary/5",
  },
  tertiary: {
    fg: "text-accent-foreground",
    bg: "bg-accent/20",
    glow: "bg-accent/10",
  },
};

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  progress,
  tone = "primary",
}: StatCardProps) {
  const t = tonePalette[tone];
  return (
    <Card className="relative overflow-hidden group">
      <CardContent className="p-4 sm:p-6">
        <div
          className={`absolute -right-4 -top-4 w-24 h-24 ${t.glow} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}
        />
        <div className="flex justify-between items-start mb-3 relative">
          {Icon && (
            <div className={`${t.fg} p-2 ${t.bg} rounded-lg`}>
              <Icon className="size-5" />
            </div>
          )}
          {delta && (
            <span className="text-[10px] bg-secondary text-secondary-foreground px-2 py-1 rounded-full font-medium">
              {delta}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        <p className="text-2xl sm:text-3xl text-primary mt-1 font-light">
          {value}
        </p>
        {typeof progress === "number" && (
          <div className="mt-4 h-1 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
