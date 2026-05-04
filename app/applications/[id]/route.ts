import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { applicationSchema } from "@/lib/validations/application";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const application = await prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    if (application.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = applicationSchema.partial().safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid input";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { company, title, location, salaryRange, jobLink, notes, status } =
      parsed.data;

    const updated = await prisma.application.update({
      where: { id },
      data: {
        ...(company !== undefined && { company }),
        ...(title !== undefined && { title }),
        ...(location !== undefined && { location: location || null }),
        ...(salaryRange !== undefined && { salaryRange: salaryRange || null }),
        ...(jobLink !== undefined && { jobLink: jobLink || null }),
        ...(notes !== undefined && { notes: notes || null }),
        ...(status !== undefined && { status }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH_APPLICATION_ERROR", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}
