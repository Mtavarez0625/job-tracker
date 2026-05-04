import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-4 text-white">
      <div className="mx-auto max-w-lg text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-neutral-400">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
          Free to use
        </div>

        <h1 className="text-5xl font-bold tracking-tight">Job Tracker</h1>

        <p className="mt-4 max-w-md text-lg leading-relaxed text-neutral-400">
          Organize your job search. Track every application, interview, and
          offer in one clean dashboard.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/register"
            className="w-full rounded-xl bg-blue-600 px-8 py-3 font-medium transition hover:bg-blue-500 hover:scale-[1.01] active:scale-[0.99] sm:w-auto"
          >
            Get Started Free
          </Link>
          <Link
            href="/login"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-8 py-3 font-medium transition hover:bg-white/10 active:scale-[0.99] sm:w-auto"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
