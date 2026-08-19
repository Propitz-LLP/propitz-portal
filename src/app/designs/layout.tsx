import { Suspense, type ReactNode } from "react";
import DesignSwitcher from "@/components/DesignSwitcher";

export default function DesignsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Suspense fallback={null}>
        <DesignSwitcher />
      </Suspense>
    </>
  );
}
