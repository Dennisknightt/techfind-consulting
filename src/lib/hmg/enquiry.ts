import { z } from "zod";

export const ENQUIRY_SERVICES = [
  "Tax and KRA Advisory",
  "Accounting and Bookkeeping",
  "Audit and Assurance",
  "Financial Advisory",
  "Payroll Management",
  "Tax Health Checks and Compliance",
  "Not sure yet",
] as const;

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9][0-9\s-]{7,16}$/, "Enter a valid phone number, e.g. +254 7XX XXX XXX."),
  company: z.string().trim().max(120).optional().default(""),
  service: z.enum(ENQUIRY_SERVICES, { message: "Choose the closest service." }),
  message: z.string().trim().min(10, "Tell us a little more (at least 10 characters).").max(2000),
  consent: z.literal(true, { message: "Please confirm we may contact you." }),
  website: z.string().optional().default(""), // honeypot
});

export type EnquiryInput = z.input<typeof enquirySchema>;
