import type { Metadata } from "next";
import { AboutPage } from "@/components/pages/AboutPage";

export const metadata: Metadata = {
  title: "About | TechFind Consulting",
  description: "TechFind Consulting is Africa's first AI Engine Optimization agency. Learn about our mission, team, and values.",
};

export default function AboutPageRoute() {
  return <AboutPage />;
}
