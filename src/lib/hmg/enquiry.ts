import { z } from "zod";
import { SERVICES } from "./content";

export const ENQUIRY_SERVICES = [...SERVICES.map((s) => s.title), "Not sure yet"] as unknown as [string, ...string[]];

const base = {
  name: z.string().trim().min(2, "Please enter your full name.").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9][0-9\s-]{7,16}$/, "Enter a valid phone number."),
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email, or leave blank.")]).optional().default(""),
  company: z.string().trim().max(120).optional().default(""),
  service: z.enum(ENQUIRY_SERVICES, { message: "Choose a service, or “Not sure yet”." }),
  consent: z.literal(true, { message: "Please confirm we may contact you." }),
  website: z.string().optional().default(""), // honeypot
  elapsed: z.number().optional().default(0), // ms between render and submit
  source: z.enum(["contact", "callback"]).optional().default("contact"),
};

/** Server schema: description optional so the short callback form can use it too. */
export const enquirySchema = z.object({
  ...base,
  message: z.string().trim().max(1500).optional().default(""),
});

/** Full contact form: a short description is required. */
export const contactFormSchema = z.object({
  ...base,
  message: z.string().trim().min(10, "Add a few more words (10+ characters).").max(1500),
});

export type EnquiryInput = z.input<typeof enquirySchema>;
