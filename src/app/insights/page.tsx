import type { Metadata } from "next";
import { InsightsPage } from "@/components/pages/InsightsPage";

export const metadata: Metadata = {
  title: "Insights | TechFind Consulting",
  description: "AI Engine Optimization guides, research, and insights from TechFind Consulting.",
};

export default function InsightsPageRoute() {
  return <InsightsPage />;
}
