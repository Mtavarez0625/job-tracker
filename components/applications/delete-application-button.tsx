"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type DeleteApplicationButtonProps = {
  applicationId: string;
};

export function DeleteApplicationButton({
  applicationId,
}: DeleteApplicationButtonProps) {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setError("");
    setIsDeleting(true);

    const res = await fetch(`/api/applications/${applicationId}`, {
      method: "DELETE",
    });

    setIsDeleting(false);

    if (!res.ok) {
      setError("Failed to delete.");
      setIsConfirming(false);
      return;
    }

    router.refresh();
  }

  if (isConfirming) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-neutral-400">Sure?</span>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="rounded-lg border border-red-500/40 bg-red-500/20 px-2.5 py-1 text-xs text-red-300 transition hover:bg-red-500/30 disabled:opacity-50"
        >
          {isDeleting ? "..." : "Yes"}
        </button>
        <button
          onClick={() => {
            setIsConfirming(false);
            setError("");
          }}
          disabled={isDeleting}
          className="rounded-lg border border-white/10 px-2.5 py-1 text-xs text-neutral-400 transition hover:bg-white/5"
        >
          Cancel
        </button>
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsConfirming(true)}
      className="rounded-lg border border-red-500/30 px-3 py-1 text-sm text-red-400 transition hover:bg-red-500/10 active:scale-[0.99]"
    >
      Delete
    </button>
  );
}
