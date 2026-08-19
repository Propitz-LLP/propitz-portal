"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * Wraps the site's global chrome (header, footer, floating buttons). On the
 * /designs/* showcase routes each design provides its own full-page chrome,
 * so we render just the page there. The chrome nodes are passed in as props
 * so they stay server-rendered.
 */
export default function SiteChrome({
  header,
  footer,
  floating,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  floating: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const bare = pathname?.startsWith("/designs");

  if (bare) return <>{children}</>;

  return (
    <>
      {header}
      <main className="flex-1">{children}</main>
      {footer}
      {floating}
    </>
  );
}
