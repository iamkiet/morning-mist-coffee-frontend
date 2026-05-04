import type { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  size?: 'headline' | 'display';
  titleColor?: 'default' | 'primary';
  descriptionItalic?: boolean;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  size = 'headline',
  titleColor = 'default',
  descriptionItalic = false,
}: PageHeaderProps) {
  const titleCls =
    size === 'display'
      ? 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl'
      : 'text-xl sm:text-2xl md:text-3xl';
  const colorCls =
    titleColor === 'primary' ? 'text-primary' : 'text-foreground';
  return (
    <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
      <div className="space-y-2 min-w-0 flex-1">
        {eyebrow && (
          <p className="text-xs text-primary uppercase tracking-widest font-medium">
            {eyebrow}
          </p>
        )}
        <h1 className={`${titleCls} ${colorCls} break-words font-light`}>
          {title}
        </h1>
        {description && (
          <p
            className={`text-sm sm:text-base text-muted-foreground ${descriptionItalic ? 'italic' : ''}`}
          >
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
          {actions}
        </div>
      )}
    </header>
  );
}
