import type { ReactNode } from "react";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <div className="fixed inset-0 overflow-auto">{children}</div>;
}
