import { z } from "zod";

const JOB_STATUSES = [
  "WISHLIST",
  "APPLIED",
  "RECRUITER_SCREEN",
  "INTERVIEW",
  "FINAL_INTERVIEW",
  "OFFER",
  "REJECTED",
] as const;

export const applicationSchema = z.object({
  company: z.string().min(1, "Company is required"),
  title: z.string().min(1, "Job title is required"),
  location: z.string().optional(),
  salaryRange: z.string().optional(),
  jobLink: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(JOB_STATUSES).default("APPLIED"),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
