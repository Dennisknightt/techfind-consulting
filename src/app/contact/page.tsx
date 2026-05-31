import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/ContactPage";

export const metadata: Metadata = {
  title: "Contact | TechFind Consulting",
  description: "Book an AI Visibility Audit or get in touch with the TechFind Consulting team.",
};

export default function ContactPageRoute() {
  return <ContactPage />;
}
