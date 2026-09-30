export type ServiceMotif = "tax" | "accounting" | "audit" | "advisory" | "payroll" | "health";

export interface Service {
  id: string;
  motif: ServiceMotif;
  title: string;
  summary: string;
  outcome: string;
  includes: string[];
}

export const SERVICES: Service[] = [
  {
    id: "tax",
    motif: "tax",
    title: "Tax and KRA Advisory",
    summary: "Returns, registrations and planning handled with a steady hand on the KRA portal.",
    outcome: "Remain compliant",
    includes: ["Corporate, VAT, PAYE and withholding returns", "iTax and eTIMS set-up and support", "KRA queries, audits and objections", "Tax planning before year-end, not after"],
  },
  {
    id: "accounting",
    motif: "accounting",
    title: "Accounting and Bookkeeping",
    summary: "Books that are current, reconciled and readable by someone who is not an accountant.",
    outcome: "Understand your numbers",
    includes: ["Monthly bookkeeping and reconciliations", "Management accounts in plain language", "Accounting-system set-up and clean-up", "Year-end financial statements"],
  },
  {
    id: "audit",
    motif: "audit",
    title: "Audit and Assurance",
    summary: "Independent, well-prepared assurance that lenders, boards and regulators can rely on.",
    outcome: "Reduce financial risk",
    includes: ["Statutory and voluntary audits", "Audit-readiness reviews", "Internal control assessments", "Agreed-upon procedures"],
  },
  {
    id: "advisory",
    motif: "advisory",
    title: "Financial Advisory",
    summary: "Forecasts, budgets and scenarios that turn a cash question into a clear decision.",
    outcome: "Improve cash-flow visibility",
    includes: ["13-week cash-flow forecasting", "Budgets and scenario modelling", "Funding and investor-readiness support", "Pricing and margin reviews"],
  },
  {
    id: "payroll",
    motif: "payroll",
    title: "Payroll Management",
    summary: "Accurate pay, on time, with every statutory deduction filed and reconciled.",
    outcome: "Make better decisions",
    includes: ["Monthly payroll processing and payslips", "PAYE, NSSF, SHIF and housing levy returns", "Onboarding and exit calculations", "Payroll cost reporting"],
  },
  {
    id: "health",
    motif: "health",
    title: "Tax Health Checks and Compliance",
    summary: "A structured review that finds exposure early and gives you a short, ranked fix list.",
    outcome: "Prepare for growth",
    includes: ["Tax position and exposure review", "Compliance calendar and reminders", "Records and eTIMS readiness check", "Remediation plan with owners and dates"],
  },
];

export const TRUST = [
  { id: "founded", figure: 2020, from: 2000, suffix: "", label: "Founded in Nairobi", note: "Built locally, for how Kenyan businesses actually operate." },
  { id: "view", figure: 360, from: 0, suffix: "°", label: "Financial perspective", note: "Tax, books, audit and advisory seen as one picture." },
  { id: "areas", figure: 6, from: 0, suffix: "", label: "Core service areas", note: "One relationship instead of six separate suppliers." },
  { id: "kra", figure: null, from: 0, suffix: "", label: "Kenyan regulatory and KRA expertise", note: "Day-to-day fluency with the rules your business is held to." },
] as const;

export type InsightTag = "happening" | "attention" | "next";

export const PROCESS = [
  { n: "01", title: "Understand your business", body: "We start with how you earn, spend and decide — your model, your team, your season." },
  { n: "02", title: "Bring clarity to the numbers", body: "Books are tidied, reconciled and organised so the picture is finally trustworthy." },
  { n: "03", title: "Identify what needs attention", body: "Deadlines, cash pressure and compliance gaps are ranked by what matters most." },
  { n: "04", title: "Move forward with confidence", body: "You leave each conversation with a decision, an owner and a date." },
] as const;

export const JOURNEY = [
  { title: "Website or WhatsApp enquiry", body: "Tell us what you are dealing with — in a short form or a quick message." },
  { title: "Qualification", body: "We confirm the service you need, your size and any urgent deadlines." },
  { title: "Consultant follow-up", body: "A named HMG consultant reviews your situation and calls you back." },
  { title: "Consultation", body: "A focused conversation that ends with clear next steps." },
] as const;

export type InsightKind = "kra" | "etims" | "planning" | "cashflow" | "payroll" | "controls" | "audit" | "growth";
export type InsightCategory = "Tax & Compliance" | "Cash & Controls" | "People & Payroll" | "Audit & Assurance" | "Growth";

export interface Article {
  slug: string;
  kind: InsightKind;
  category: InsightCategory;
  readTime: number;
  title: string;
  summary: string;
  sections: { heading: string; paragraphs: string[] }[];
  takeaways: string[];
}

export const INSIGHT_CATEGORIES: ("All" | InsightCategory)[] = [
  "All",
  "Tax & Compliance",
  "Cash & Controls",
  "People & Payroll",
  "Audit & Assurance",
  "Growth",
];

export const ARTICLES: Article[] = [
  {
    slug: "kra-compliance-calendar",
    kind: "kra",
    category: "Tax & Compliance",
    readTime: 5,
    title: "A KRA compliance calendar your finance team will actually use",
    summary: "Most penalties come from missed routine dates, not complex disputes. Build one calendar, give every date an owner.",
    sections: [
      {
        heading: "Why routine dates cause the most damage",
        paragraphs: [
          "Late filing and late payment penalties rarely come from a difficult tax position. They come from an ordinary deadline that nobody owned. A PAYE return due on the 9th and a VAT return due on the 20th do not look urgent until the week they fall due.",
          "The fix is unglamorous: one shared calendar that lists every recurring obligation, who prepares it, who approves it and when the cash needs to be available.",
        ],
      },
      {
        heading: "What belongs on the calendar",
        paragraphs: [
          "Start with monthly obligations such as PAYE and VAT where they apply, then add instalment tax, annual returns, your Tax Compliance Certificate renewal and any licence or registration renewals that depend on good standing.",
          "Work backwards from each statutory date. Set an internal preparation date three to five working days earlier, so a missing invoice or a portal problem does not become a penalty.",
        ],
      },
      {
        heading: "Make the calendar a decision tool",
        paragraphs: [
          "A good calendar also shows the amount expected each month. When finance can see a large payment coming, cash is planned for it rather than discovered on the day.",
        ],
      },
    ],
    takeaways: ["Give every obligation one named owner", "Set internal dates ahead of statutory ones", "Show the expected cash amount beside each date"],
  },
  {
    slug: "etims-invoicing-what-to-check",
    kind: "etims",
    category: "Tax & Compliance",
    readTime: 4,
    title: "eTIMS: what to check before your next invoice run",
    summary: "Electronic invoicing now touches sales, purchases and expense deductions. A short check prevents expensive surprises.",
    sections: [
      {
        heading: "It is not only about the invoices you issue",
        paragraphs: [
          "KRA's electronic Tax Invoice Management System affects how you invoice customers, but also how you support the expenses you claim. In most cases, a business expense needs a valid supporting invoice to be treated as deductible.",
          "That makes supplier behaviour part of your tax position. A supplier who cannot issue a compliant invoice can quietly increase your tax bill.",
        ],
      },
      {
        heading: "A five-minute readiness check",
        paragraphs: [
          "Confirm your own invoices carry the required details and are transmitted correctly. Review your largest suppliers and ask whether they issue compliant invoices. Then sample last month's expenses and see how many are fully supported.",
          "Gaps are easiest to fix while they are few. Agree a simple rule with your team: no supplier payment is approved without a compliant invoice attached.",
        ],
      },
    ],
    takeaways: ["Check both sales and purchase invoices", "Ask key suppliers about compliance now", "Attach the invoice before approving payment"],
  },
  {
    slug: "tax-planning-before-year-end",
    kind: "planning",
    category: "Tax & Compliance",
    readTime: 6,
    title: "Tax planning works best before the year ends",
    summary: "Planning is about timing and structure, not loopholes. Three conversations to have with your advisor each year.",
    sections: [
      {
        heading: "The tax bill is mostly decided before you file",
        paragraphs: [
          "By the time a return is prepared, most of the facts are fixed. The useful questions are earlier: when to invest, how to structure a purchase, whether a payment is properly documented.",
        ],
      },
      {
        heading: "Three conversations worth having",
        paragraphs: [
          "First, a mid-year projection: where is taxable profit heading, and is instalment tax on track? Second, a capital-spending review: which purchases qualify for allowances and when should they be made? Third, a documentation review: can every major deduction be supported?",
          "None of these needs complexity. They need a little time set aside while there are still months left to act.",
        ],
      },
    ],
    takeaways: ["Project profit and instalment tax mid-year", "Review capital purchases before they happen", "Keep documentation ready, not reconstructed"],
  },
  {
    slug: "cash-flow-thirteen-week-view",
    kind: "cashflow",
    category: "Cash & Controls",
    readTime: 5,
    title: "The 13-week cash view: a founder's early-warning system",
    summary: "Profit does not pay suppliers; cash does. A simple rolling forecast shows the squeeze weeks before it arrives.",
    sections: [
      {
        heading: "Profitable, and still short of cash",
        paragraphs: [
          "Growing businesses often run short of cash precisely because they are growing. Stock is bought, salaries are paid and customers take 45 days to settle.",
          "A 13-week view lays out expected receipts and payments week by week. It is deliberately simple: the point is to see the shape of the next quarter.",
        ],
      },
      {
        heading: "How to keep it useful",
        paragraphs: [
          "Update it weekly, compare it to what actually happened and note why it differed. Include the lumpy items — tax payments, payroll, rent, loan repayments — first, then the routine ones.",
          "When the forecast shows a dip, you have options: chase invoices, re-time a purchase, negotiate terms or arrange short-term funding while it is still cheap to do so.",
        ],
      },
    ],
    takeaways: ["Forecast receipts and payments weekly", "Put tax, payroll and loan dates in first", "Act on dips while options are still cheap"],
  },
  {
    slug: "payroll-compliance-checklist",
    kind: "payroll",
    category: "People & Payroll",
    readTime: 4,
    title: "Payroll compliance: a monthly checklist for growing teams",
    summary: "Payroll is where small errors repeat every month. A clear sequence keeps pay accurate and filings on time.",
    sections: [
      {
        heading: "One run, several obligations",
        paragraphs: [
          "Each payroll touches PAYE and statutory contributions, each with its own deadline and portal. Miss one and you create a penalty and an awkward conversation with an employee.",
        ],
      },
      {
        heading: "The monthly sequence",
        paragraphs: [
          "Confirm changes first: new joiners, leavers, salary changes, allowances. Run the payroll and review variances against last month. Approve, pay, then file and reconcile every statutory return against the payroll report.",
          "Keep a record of who approved what. It saves hours if an employee or an authority ever asks.",
        ],
      },
    ],
    takeaways: ["Lock changes before each run", "Review month-on-month variances", "Reconcile every return to the payroll report"],
  },
  {
    slug: "financial-controls-for-growing-businesses",
    kind: "controls",
    category: "Cash & Controls",
    readTime: 5,
    title: "Financial controls that fit a growing business",
    summary: "Good controls are light, specific and owned. Four that protect a growing company without slowing it down.",
    sections: [
      {
        heading: "Controls are a growth enabler",
        paragraphs: [
          "Founders sometimes hear 'controls' and think bureaucracy. In practice, a handful of sensible checks protect cash, reduce errors and make the business easier to fund and audit.",
        ],
      },
      {
        heading: "Four worth starting with",
        paragraphs: [
          "Separate who raises a payment from who approves it. Set approval limits that match the size of the business. Reconcile bank accounts monthly, and review the reconciliation. Keep a simple authorised-signatory list and update it when people leave.",
          "Each takes minutes a week. Together they remove most avoidable losses.",
        ],
      },
    ],
    takeaways: ["Separate raising and approving payments", "Set approval limits", "Reconcile and review bank accounts monthly"],
  },
  {
    slug: "preparing-for-an-audit",
    kind: "audit",
    category: "Audit & Assurance",
    readTime: 6,
    title: "Preparing for an audit without the last-minute scramble",
    summary: "A calm audit is built across the year. The schedules and evidence to prepare before auditors arrive.",
    sections: [
      {
        heading: "Audits reward preparation",
        paragraphs: [
          "Most limited companies are required to have their accounts audited each year, and lenders and investors often ask for audited accounts even where the law does not. The difference between a smooth audit and a stressful one is usually preparation.",
        ],
      },
      {
        heading: "What to have ready",
        paragraphs: [
          "Reconciled bank statements, a fixed-asset register, debtor and creditor listings, payroll and tax filings, stock counts where relevant, and signed agreements for loans and significant contracts.",
          "Agree a timetable with your auditors early and name one person who answers queries. A single point of contact typically shortens the audit noticeably.",
        ],
      },
    ],
    takeaways: ["Reconcile accounts monthly, not annually", "Keep supporting schedules current", "Nominate one contact for auditor queries"],
  },
  {
    slug: "growth-planning-for-smes",
    kind: "growth",
    category: "Growth",
    readTime: 5,
    title: "Growth planning: know your margins before you scale",
    summary: "Scaling a thin-margin product simply scales the problem. How to test the economics before you commit.",
    sections: [
      {
        heading: "Start with the unit, not the ambition",
        paragraphs: [
          "Before opening a second branch or hiring a sales team, understand what one more customer, order or outlet actually earns after direct costs. Growth multiplies whatever is already there, good or bad.",
        ],
      },
      {
        heading: "A planning rhythm that works",
        paragraphs: [
          "Build a simple annual budget, then review it quarterly against actuals. Model two or three scenarios — steady, strong and slow — so the team knows in advance what triggers a hire or a pause.",
          "If outside funding is on the horizon, the same discipline produces the clean numbers investors and lenders expect.",
        ],
      },
    ],
    takeaways: ["Measure margin per customer or order first", "Review the budget every quarter", "Model steady, strong and slow scenarios"],
  },
];

export const getArticle = (slug: string) => ARTICLES.find((a) => a.slug === slug);
