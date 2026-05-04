"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useToast } from "@/components/toast-provider";

const TOAST_MESSAGES: Record<string, string> = {
  created: "Application created",
  updated: "Application updated",
};

function DashboardToastInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { addToast } = useToast();
  const hasShown = useRef(false);

  useEffect(() => {
    if (hasShown.current) return;
    const toastKey = searchParams.get("toast");
    if (toastKey && TOAST_MESSAGES[toastKey]) {
      hasShown.current = true;
      addToast(TOAST_MESSAGES[toastKey]);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("toast");
      router.replace(
        params.toString() ? `${pathname}?${params.toString()}` : pathname,
        { scroll: false }
      );
    }
  }, [searchParams, addToast, router, pathname]);

  return null;
}

export function DashboardToast() {
  return (
    <Suspense>
      <DashboardToastInner />
    </Suspense>
  );
}
