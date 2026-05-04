"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-xl border border-white/10 px-4 py-2 text-sm text-neutral-400 transition hover:border-white/20 hover:text-neutral-200 active:scale-[0.99]"
    >
      Sign Out
    </button>
  );
}
