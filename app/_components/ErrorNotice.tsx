interface ErrorNoticeProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * The single way to render a failed request. Every page previously rolled its
 * own — a bordered box here, a bare red paragraph there.
 */
export function ErrorNotice({ children, className = '' }: ErrorNoticeProps) {
  return (
    <div
      role="alert"
      className={`mb-4 rounded-lg border border-destructive/30 bg-card px-4 py-3 text-sm text-destructive ${className}`}
    >
      {children}
    </div>
  );
}
