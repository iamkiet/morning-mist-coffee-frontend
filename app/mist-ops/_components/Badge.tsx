import type { ReactNode } from 'react';
import { Badge as ShadcnBadge } from '@/components/ui/badge';

type Status =
  | 'success'
  | 'info'
  | 'warning'
  | 'neutral'
  | 'error'
  | 'primary'
  | 'purple'
  | 'pink'
  | 'indigo';

interface BadgeProps {
  children: ReactNode;
  status?: Status;
}

const statusCls: Record<Status, string> = {
  success:
    'bg-accent/20 text-accent-foreground border-accent/40 hover:bg-accent/30',
  info: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
  warning: 'bg-muted text-foreground border-border hover:bg-muted/60',
  neutral: 'bg-muted text-muted-foreground border-border hover:bg-muted/60',
  error: 'bg-card text-destructive border-destructive/30 hover:bg-muted',
  primary:
    'bg-primary text-primary-foreground border-primary hover:bg-primary/90',
  purple: 'bg-muted text-muted-foreground border-border hover:bg-muted/60',
  pink: 'bg-accent/10 text-accent-foreground border-accent/20 hover:bg-accent/20',
  indigo: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
};

export function Badge({ children, status = 'neutral' }: BadgeProps) {
  return (
    <ShadcnBadge
      variant="outline"
      className={`uppercase text-[10px] tracking-wider font-semibold px-2.5 py-0.5 border transition-colors ${statusCls[status]}`}
    >
      {children}
    </ShadcnBadge>
  );
}
