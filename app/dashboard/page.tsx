import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Briefcase, Calendar, Trophy, XCircle } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ApplicationsList } from "@/components/applications/applications-list";
import { SignOutButton } from "@/components/sign-out-button";
import { DashboardToast } from "@/components/dashboard-toast";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/login");
  }

  const applications = await prisma.application.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const total = applications.length;
  const interviews = applications.filter((a) =>
    ["INTERVIEW", "FINAL_INTERVIEW"].includes(a.status)
  ).length;
  const offers = applications.filter((a) => a.status === "OFFER").length;
  const rejected = applications.filter((a) => a.status === "REJECTED").length;

  const displayName =
    session.user?.name || session.user?.email?.split("@")[0] || "there";

  const stats = [
    {
      label: "Total",
      value: total,
      Icon: Briefcase,
      color: "text-blue-400",
      border: "border-blue-500/20",
      gradient: "from-blue-500/[0.08]",
    },
    {
      label: "Interviews",
      value: interviews,
      Icon: Calendar,
      color: "text-amber-400",
      border: "border-amber-500/20",
      gradient: "from-amber-500/[0.08]",
    },
    {
      label: "Offers",
      value: offers,
      Icon: Trophy,
      color: "text-green-400",
      border: "border-green-500/20",
      gradient: "from-green-500/[0.08]",
    },
    {
      label: "Rejected",
      value: rejected,
      Icon: XCircle,
      color: "text-red-400",
      border: "border-red-500/20",
      gradient: "from-red-500/[0.08]",
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <DashboardToast />

      {/* Sticky top nav */}
      <header className="sticky top-0 z-10 border-b border-white/5 bg-neutral-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-sm font-semibold tracking-wide text-neutral-200">
            JobTracker
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/applications/new"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium transition hover:bg-blue-500 hover:scale-[1.01] active:scale-[0.98]"
            >
              + Add Application
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="animate-fade-in-up mx-auto max-w-6xl px-6 py-10">
        {/* Page heading */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-neutral-400">
            Welcome back,{" "}
            <span className="text-neutral-200">{displayName}</span>.
          </p>
        </div>

        {/* Stats cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {stats.map(({ label, value, Icon, color, border, gradient }) => (
            <div
              key={label}
              className={`rounded-2xl border ${border} bg-gradient-to-br ${gradient} to-transparent p-6 transition duration-200 hover:scale-[1.01]`}
            >
              <div className="flex items-start justify-between">
                <p className="text-sm text-neutral-400">{label}</p>
                <Icon size={18} className={`${color} opacity-70`} />
              </div>
              <p className={`mt-3 text-3xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Applications section */}
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Applications</h2>
            {total > 0 && (
              <span className="text-sm text-neutral-500">{total} total</span>
            )}
          </div>
          <ApplicationsList
            applications={applications.map((a) => ({
              id: a.id,
              company: a.company,
              title: a.title,
              location: a.location,
              salaryRange: a.salaryRange,
              jobLink: a.jobLink,
              status: a.status,
            }))}
          />
        </div>
      </div>
    </main>
  );
}
