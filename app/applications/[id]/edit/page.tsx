"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-white placeholder:text-neutral-600 transition focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

const labelClass = "block text-sm font-medium text-neutral-300";

const JOB_STATUSES = [
  { value: "WISHLIST", label: "Wishlist" },
  { value: "APPLIED", label: "Applied" },
  { value: "RECRUITER_SCREEN", label: "Recruiter Screen" },
  { value: "INTERVIEW", label: "Interview" },
  { value: "FINAL_INTERVIEW", label: "Final Interview" },
  { value: "OFFER", label: "Offer" },
  { value: "REJECTED", label: "Rejected" },
];

export default function EditApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [jobLink, setJobLink] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("APPLIED");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    async function fetchApplication() {
      const res = await fetch(`/api/applications/${id}`);

      if (!res.ok) {
        setFetchError(
          res.status === 404
            ? "Application not found."
            : "Failed to load application. Please try again."
        );
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      setCompany(data.company ?? "");
      setTitle(data.title ?? "");
      setLocation(data.location ?? "");
      setSalaryRange(data.salaryRange ?? "");
      setJobLink(data.jobLink ?? "");
      setNotes(data.notes ?? "");
      setStatus(data.status ?? "APPLIED");
      setIsLoading(false);
    }

    fetchApplication();
  }, [id]);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSaving(true);

    const res = await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company,
        title,
        location,
        salaryRange,
        jobLink,
        notes,
        status,
      }),
    });

    const data = await res.json();
    setIsSaving(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong. Please try again.");
      return;
    }

    router.push("/dashboard?toast=updated");
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-neutral-950 px-4 py-10 text-white">
        <div className="mx-auto max-w-2xl animate-pulse space-y-4">
          <div className="h-4 w-32 rounded-lg bg-white/10" />
          <div className="h-8 w-48 rounded-lg bg-white/10" />
          <div className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-white/10" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (fetchError) {
    return (
      <main className="min-h-screen bg-neutral-950 px-4 py-10 text-white">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center">
            <p className="font-medium text-red-300">{fetchError}</p>
            <Link
              href="/dashboard"
              className="mt-4 inline-block text-sm text-neutral-400 transition hover:text-white"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/dashboard"
          className="text-sm text-neutral-400 transition hover:text-white"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-6">
          <h1 className="text-3xl font-bold tracking-tight">Edit Application</h1>
          <p className="mt-2 text-neutral-400">
            Update the details for this job application.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="company" className={labelClass}>
                Company <span className="text-red-400">*</span>
              </label>
              <input
                id="company"
                className={inputClass}
                placeholder="e.g. Acme Corp"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="title" className={labelClass}>
                Job Title <span className="text-red-400">*</span>
              </label>
              <input
                id="title"
                className={inputClass}
                placeholder="e.g. Software Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="location" className={labelClass}>
                Location
              </label>
              <input
                id="location"
                className={inputClass}
                placeholder="e.g. San Francisco, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="salaryRange" className={labelClass}>
                Salary Range
              </label>
              <input
                id="salaryRange"
                className={inputClass}
                placeholder="e.g. $120k – $150k"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="jobLink" className={labelClass}>
              Job Link
            </label>
            <input
              id="jobLink"
              type="url"
              className={inputClass}
              placeholder="https://..."
              value={jobLink}
              onChange={(e) => setJobLink(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="status" className={labelClass}>
              Status
            </label>
            <select
              id="status"
              className={inputClass}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {JOB_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="notes" className={labelClass}>
              Notes
            </label>
            <textarea
              id="notes"
              className={`${inputClass} min-h-32 resize-y`}
              placeholder="Any notes about this role..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 rounded-xl bg-blue-600 py-3 font-medium transition hover:bg-blue-500 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            <Link
              href="/dashboard"
              className="rounded-xl border border-white/10 px-5 py-3 text-sm text-neutral-400 transition hover:bg-white/5 hover:text-neutral-200"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
