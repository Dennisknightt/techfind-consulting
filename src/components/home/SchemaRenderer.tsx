"use client";

import { organizationSchema, faqSchema, breadcrumbSchema, aggregateRatingSchema } from "@/lib/schema";

export function SchemaRenderer() {
  const faqData = [
    {
      q: "What is AI Engine Optimization (AEO)?",
      a: "AI Engine Optimization is the practice of optimizing your business to appear in AI-generated answers on ChatGPT, Gemini, Claude, and Perplexity. Unlike traditional SEO which targets Google search rankings, AEO ensures your business gets recommended directly by AI systems when users ask relevant questions."
    },
    {
      q: "How does AI Engine Optimization differ from SEO?",
      a: "SEO targets Google's traditional search index and rankings. AEO targets AI language models and knowledge graphs. While SEO focuses on keywords and backlinks, AEO focuses on being cited as authoritative, current, and relevant in AI training data and retrieval systems."
    },
    {
      q: "How long does it take to see results from AEO?",
      a: "Most clients see initial AI citation increases within 30-90 days. Full visibility across all major AI platforms typically takes 4-6 months. Results vary based on industry competition, current authority, and content optimization scope."
    },
    {
      q: "Which AI platforms does AEO optimization target?",
      a: "Our AEO services optimize for ChatGPT, Google Gemini, Claude, Perplexity, Bing Copilot, and other major generative AI systems. We also ensure optimization for Google AI Overviews, which integrate AI answers directly into search results."
    },
    {
      q: "How do you measure AI visibility and results?",
      a: "We track: (1) AI citation frequency across platforms, (2) Direct mentions in AI-generated answers, (3) Position/prominence in responses, (4) Organic traffic increase from AI referrals, (5) Lead quality from AI-sourced visitors, (6) Conversion rate improvements."
    },
    {
      q: "What's included in an AI Visibility Audit?",
      a: "Our comprehensive audit includes: Current AI visibility assessment across 5+ major platforms, Competitor analysis, Content gap identification, Authority and citation analysis, Technical SEO audit, Structured data review, Recommendations prioritized by impact, Custom implementation roadmap."
    },
    {
      q: "How does AI Business Automation help my company?",
      a: "AI Business Automation uses AI agents to automate customer interactions, sales qualification, support, and operations. Common implementations include: WhatsApp AI agents (68% conversion improvement), Chatbot automation (24/7 lead qualification), Knowledge base AI (instant customer answers), Integration with CRM systems for seamless operations."
    },
    {
      q: "What's the cost of AI Engine Optimization services?",
      a: "We offer flexible pricing: AI Visibility Starter at $900/month (includes audit, optimization roadmap, quarterly reviews), AEO Growth Partner at $1,200/month (includes everything in Starter plus 3-month implementation, monthly citation tracking, content deployment). Custom enterprise pricing available for large organizations."
    },
    {
      q: "Do you work with businesses in all industries?",
      a: "Yes. We have proven success across industries: Solar energy, Legal services, E-commerce, Real estate, Healthcare, B2B SaaS. Our approach is industry-agnostic but results are industry-specific. We tailor AEO strategy to your competitive landscape and target AI platform user behavior."
    },
    {
      q: "Can you guarantee AI citations or ranking improvements?",
      a: "We cannot guarantee specific rankings (no legitimate agency can). However, we guarantee transparent reporting of all metrics we can control: implementation completion, content optimization score, structured data coverage, citation tracking, and progress toward AI visibility targets. Results depend on competition and market dynamics."
    },
    {
      q: "How do you stay updated with AI system changes?",
      a: "Our team continuously monitors: AI model updates and new capabilities, Changes to knowledge graph structures, Emerging AI platforms, Industry best practices, Client performance data and trends. We adjust strategies quarterly based on these changes to maintain optimal visibility."
    },
    {
      q: "What makes TechFind different from other AEO agencies?",
      a: "TechFind combines deep technical expertise with proven methodology: We focus exclusively on AEO (not traditional SEO distraction), Transparent reporting and measurable results, Industry-specific expertise across 40+ verticals, Direct AI platform integration knowledge, Quick implementation (results in 30-90 days), White-glove client support with dedicated strategists."
    }
  ];

  const breadcrumbs = [
    { name: "Home", url: "https://techfind.vercel.app" },
    { name: "Services", url: "https://techfind.vercel.app/ai-engine-optimization" },
    { name: "AI Engine Optimization", url: "https://techfind.vercel.app/ai-engine-optimization" }
  ];

  return (
    <>
      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqData)) }}
      />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(breadcrumbs)) }}
      />

      {/* Aggregate Rating Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingSchema(4.9, 487)) }}
      />
    </>
  );
}
