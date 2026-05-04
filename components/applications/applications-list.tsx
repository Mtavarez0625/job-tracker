"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MapPin, DollarSign, ExternalLink, Search } from "lucide-react";
import { useToast } from "@/components/toast-provider";

type ApplicationItem = {
  id: string;
  company: string;
  title: string;
  location: string | null;
  salaryRange: string | null;
  jobLink: string | null;
  status: string;
};

const STATUS_LABELS: Record<string, string> = {
  WISHLIST: "Wishlist",
  APPLIED: "Applied",
  RECRUITER_SCREEN: "Recruiter Screen",
  INTERVIEW: "Interview",
  FINAL_INTERVIEW: "Final Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
};

const STATUS_COLORS: Record<string, string> = {
  WISHLIST: "bg-neutral-700 text-neutral-200",
  APPLIED: "bg-blue-900/60 text-blue-300",
  RECRUITER_SCREEN: "bg-purple-900/60 text-purple-300",
  INTERVIEW: "bg-amber-900/60 text-amber-300",
  FINAL_INTERVIEW: "bg-orange-900/60 text-orange-300",
  OFFER: "bg-green-900/60 text-green-300",
  REJECTED: "bg-red-900/60 text-red-400",
};

const FILTER_TABS = [
  { value: "ALL", label: "All" },
  { value: "WISHLIST", label: "Wishlist" },
  { value: "APPLIED", label: "Applied" },
  { value: "RECRUITER_SCREEN", label: "Recruiter Screen" },
  { value: "INTERVIEW", label: "Interview" },
  { value: "FINAL_INTERVIEW", label: "Final Interview" },
  { value: "OFFER", label: "Offer" },
  { value: "REJECTED", label: "Rejected" },
];

type Props = {
  applications: ApplicationItem[];
};

export function ApplicationsList({ applications: initialApplications }: Props) {
  const { addToast } = useToast();
  const [items, setItems] = useState(initialApplications);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(value), 300);
  }

  async function handleDelete(id: string) {
    setConfirmingId(null);
    const removedItem = items.find((a) => a.id === id);

    // Optimistic: remove immediately
    setItems((prev) => prev.filter((a) => a.id !== id));

    const res = await fetch(`/api/applications/${id}`, { method: "DELETE" });

    if (!res.ok) {
      // Restore original order on failure
      if (removedItem) {
        setItems((prev) =>
          [...prev, removedItem].sort(
            (a, b) =>
              initialApplications.findIndex((x) => x.id === a.id) -
              initialApplications.findIndex((x) => x.id === b.id)
          )
        );
      }
      addToast("Failed to delete application.", "error");
      return;
    }

    addToast("Application deleted.");
  }

  const filtered = items.filter((a) => {
    if (activeFilter !== "ALL" && a.status !== activeFilter) return false;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      return (
        a.company.toLowerCase().includes(q) ||
        a.title.toLowerCase().includes(q)
      );
    }
    return true;
  });

  if (items.length === 0) {
    return (
      <div className="animate-fade-in-up mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-20 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <svg
            className="h-6 w-6 text-neutral-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-3-3v6m-7 4h14a2 2 0 002-2V7a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2v13a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-lg font-semibold text-neutral-200">
          No applications yet
        </p>
        <p className="mt-1.5 max-w-xs text-sm text-neutral-500">
          Start tracking your job search and stay organized.
        </p>
        <Link
          href="/applications/new"
          className="mt-6 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium transition hover:bg-blue-500 hover:scale-[1.01] active:scale-[0.98]"
        >
          + Add Application
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Search */}
      <div className="relative mt-5">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search applications..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-neutral-500 transition focus:border-white/20 focus:bg-white/[0.07] focus:outline-none"
        />
      </div>

      {/* Filter tabs */}
      <div className="mt-4 flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => {
          const count =
            tab.value === "ALL"
              ? items.length
              : items.filter((a) => a.status === tab.value).length;
          if (count === 0 && tab.value !== "ALL") return null;
          const isActive = activeFilter === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition duration-150 ${
                isActive
                  ? "bg-white text-neutral-900"
                  : "border border-white/10 bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-neutral-200"
              }`}
            >
              {tab.label}
              <span
                className={`ml-1.5 text-xs ${isActive ? "text-neutral-500" : "text-neutral-600"}`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Application cards */}
      {filtered.length === 0 ? (
        <div className="animate-fade-in-up mt-6 rounded-2xl border border-dashed border-white/10 py-10 text-center">
          <p className="text-sm text-neutral-500">
            {debouncedSearch
              ? `No results for "${debouncedSearch}"`
              : `No ${STATUS_LABELS[activeFilter]?.toLowerCase() ?? "matching"} applications.`}
          </p>
          {debouncedSearch && (
            <button
              onClick={() => {
                setSearchQuery("");
                setDebouncedSearch("");
              }}
              className="mt-2 text-xs text-blue-400 transition hover:text-blue-300"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <ul className="animate-fade-in-up mt-4 space-y-3">
          {filtered.map((app) => (
            <li
              key={app.id}
              className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-200 hover:scale-[1.01] hover:border-white/20 hover:bg-white/[0.07]"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-white">{app.company}</p>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        STATUS_COLORS[app.status] ??
                        "bg-neutral-700 text-neutral-200"
                      }`}
                    >
                      {STATUS_LABELS[app.status] ?? app.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-neutral-300">{app.title}</p>
                  {(app.location || app.salaryRange) && (
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                      {app.location && (
                        <span className="flex items-center gap-1 text-xs text-neutral-500">
                          <MapPin size={11} />
                          {app.location}
                        </span>
                      )}
                      {app.salaryRange && (
                        <span className="flex items-center gap-1 text-xs text-neutral-500">
                          <DollarSign size={11} />
                          {app.salaryRange}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
                  {app.jobLink && (
                    <a
                      href={app.jobLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1 text-xs text-neutral-400 transition hover:border-white/20 hover:text-neutral-200"
                    >
                      <ExternalLink size={11} />
                      View Job
                    </a>
                  )}
                  <Link
                    href={`/applications/${app.id}/edit`}
                    className="rounded-lg border border-white/20 px-3 py-1 text-sm text-neutral-300 transition hover:bg-white/10 active:scale-[0.98]"
                  >
                    Edit
                  </Link>
                  {confirmingId === app.id ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-neutral-400">Delete?</span>
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="rounded-lg border border-red-500/40 bg-red-500/20 px-2.5 py-1 text-xs text-red-300 transition hover:bg-red-500/30 active:scale-[0.98]"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setConfirmingId(null)}
                        className="rounded-lg border border-white/10 px-2.5 py-1 text-xs text-neutral-400 transition hover:bg-white/5 active:scale-[0.98]"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmingId(app.id)}
                      className="rounded-lg border border-red-500/30 px-3 py-1 text-sm text-red-400 transition hover:bg-red-500/10 active:scale-[0.98]"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
