import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

type Tone = "neutral" | "primary" | "secondary" | "tertiary";

interface ChipProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

const tones: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground border-transparent",
  primary: "bg-accent/30 text-accent-foreground border-transparent",
  secondary: "bg-primary/10 text-primary border-transparent",
  tertiary: "bg-accent/20 text-accent-foreground border-transparent",
};

export function Chip({ children, tone = "neutral", className = "" }: ChipProps) {
  return (
    <Badge
      variant="outline"
      className={`text-[10px] font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </Badge>
  );
}
