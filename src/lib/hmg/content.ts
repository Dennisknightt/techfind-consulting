import { AUTHORISATIONS } from "./credentials";

export type ServiceMotif = "tax" | "accounting" | "audit" | "advisory" | "payroll" | "health";

export interface Service {
  slug: string;
  motif: ServiceMotif;
  title: string;
  short: string;
  /** One-line client problem, used on cards. */
  problem: string;
  /** One-line expected outcome, used on cards. */
  outcome: string;
  whoFor: string;
  lead: string;
  problems: string[];
  handles: { t: string; d: string }[];
  outcomes: string[];
  faqs: { q: string; a: string }[];
  /** Short checklist of records to have ready. */
  prepare: string[];
  related: string[];
  selector: string;
  seoTitle: string;
  seoDescription: string;
}

const AUDIT = AUTHORISATIONS.licensedAuditPractice;
const AGENT = AUTHORISATIONS.licensedTaxAgent;

const statutoryAudit = AUDIT
  ? { t: "Statutory audits", d: "Annual statutory audits carried out in line with applicable auditing standards." }
  : { t: "Statutory audit support", d: "Records, schedules and reconciliations prepared for your appointed statutory auditor, with HMG as your point of contact." };
const assurance = AUDIT
  ? { t: "Assurance engagements", d: "Agreed-upon procedures and review engagements scoped to a specific need." }
  : { t: "Management assurance reviews", d: "Agreed checks on records and controls, reported to management or the board." };
const disputes = AGENT
  ? { t: "Tax disputes", d: "Objections and representation before KRA, within the scope of our tax agent licence." }
  : { t: "Tax dispute support", d: "Records and explanations organised for a disputed assessment, working with your appointed tax agent or advocate where formal representation is required." };

export const SERVICES: Service[] = [
  {
    slug: "tax-kra-advisory",
    motif: "tax",
    title: "Tax and KRA Advisory",
    short: "Tax & KRA",
    problem: "KRA notices, filing deadlines and tax rules that are hard to keep up with.",
    outcome: "Stay compliant and pay the right tax.",
    whoFor: "Businesses and individuals who want tax handled correctly and on time — or who have received a KRA notice.",
    lead: "Registrations, returns, KRA correspondence and forward-looking tax planning, handled by a team that works with Kenyan tax rules every day.",
    problems: [
      "Returns filed late or incorrectly, attracting penalties and interest",
      "A KRA notice, assessment or audit letter you are unsure how to answer",
      "Tax paid without planning, leaving exposure unaddressed",
      "Uncertainty about which taxes apply as the business grows",
    ],
    handles: [
      { t: "Tax registrations", d: "PIN, VAT, PAYE and other obligations registered correctly on iTax." },
      { t: "Return filing", d: "Income tax, VAT, PAYE, withholding and instalment tax prepared and filed to agreed deadlines." },
      { t: "KRA notices", d: "Notices and assessments reviewed, with clear, documented responses prepared." },
      { t: "Tax planning", d: "Timing and structure reviewed before year-end, within the law." },
      { t: "Compliance support", d: "A compliance calendar with reminders ahead of each statutory date." },
      disputes,
    ],
    outcomes: ["Returns prepared and filed to agreed deadlines once records are received", "Clear, documented responses to KRA correspondence", "Tax considered before year-end, not after", "Support keeping your Tax Compliance Certificate current"],
    faqs: [
      { q: "Can you help if we have already received a KRA notice?", a: "Yes. Share the notice with us as early as possible. We review what KRA is asking for, help gather the supporting records and prepare a response for your review. Notices carry deadlines, so it is best not to wait." },
      { q: "Do you file returns on our behalf?", a: "We can prepare and file returns on iTax for you, or prepare them for your team to review and submit — whichever suits how you work." },
      { q: "Is tax planning the same as avoiding tax?", a: "No. Tax planning means timing and structuring legitimate business decisions so you pay the correct amount of tax, and no more. It stays within the law." },
    ],
    prepare: ["KRA PIN and iTax access details", "Recent returns and payment receipts", "Any KRA notices or letters received", "Sales and purchase records for the period"],
    related: ["kra-compliance-calendar", "etims-invoicing-what-to-check", "tax-planning-before-year-end"],
    selector: "I’m dealing with a KRA issue",
    seoTitle: "Tax and KRA Advisory in Nairobi",
    seoDescription: "Tax registrations, iTax return filing, responses to KRA notices, tax planning and dispute support for Kenyan businesses. Stay compliant with HMG Group Africa in Nairobi.",
  },
  {
    slug: "accounting-bookkeeping",
    motif: "accounting",
    title: "Accounting and Bookkeeping",
    short: "Accounting",
    problem: "Books that are behind or unreconciled, so you never quite know where you stand.",
    outcome: "Understand your numbers every month.",
    whoFor: "Owner-managed businesses and growing companies that need reliable books without building a full finance team.",
    lead: "Monthly bookkeeping, reconciliations and management accounts that turn records into numbers you can make decisions with.",
    problems: [
      "Bookkeeping months behind, making tax and decisions harder",
      "Bank and M-Pesa accounts that do not match the books",
      "Receipts and invoices scattered across email, WhatsApp and paper",
      "Reports that show figures but not what they mean",
    ],
    handles: [
      { t: "Monthly bookkeeping", d: "Sales, purchases and expenses recorded monthly, not left to year-end." },
      { t: "Reconciliations", d: "Bank, M-Pesa, customer and supplier balances matched to the books." },
      { t: "Management accounts", d: "A monthly profit, cash and balance-sheet view in plain language." },
      { t: "Financial reporting", d: "Year-end financial statements prepared for tax, lenders and audit." },
      { t: "Record organisation", d: "A simple system so every invoice and receipt has a place." },
      { t: "Decision-ready numbers", d: "A short commentary on what changed and what to look at next." },
    ],
    outcomes: ["Books kept up to date on an agreed monthly cycle", "Bank, M-Pesa and ledger balances reconciled", "Records organised and easy to find", "A monthly view you can act on"],
    faqs: [
      { q: "Can you catch up on books that are months behind?", a: "Yes. We start with a catch-up plan that brings records up to date in order of priority, then move you to a regular monthly routine." },
      { q: "Which accounting software do you work with?", a: "We work with the accounting systems commonly used by Kenyan businesses, and can help you choose and set one up if you do not have one yet." },
      { q: "How often will we receive reports?", a: "Most clients receive management accounts monthly with a short commentary. The frequency can be agreed to fit your business." },
    ],
    prepare: ["Bank and M-Pesa statements", "Sales invoices and receipts", "Supplier bills and expense receipts", "Access to your accounting system, if you use one"],
    related: ["cash-flow-thirteen-week-view", "financial-controls-for-growing-businesses", "preparing-for-an-audit"],
    selector: "My books are behind",
    seoTitle: "Accounting and Bookkeeping Services in Nairobi",
    seoDescription: "Monthly bookkeeping, bank and M-Pesa reconciliations, management accounts and financial statements for Kenyan SMEs. Decision-ready numbers from HMG Group Africa.",
  },
  {
    slug: "audit-assurance",
    motif: "audit",
    title: "Audit and Assurance",
    short: "Audit",
    problem: "An audit or lender request approaching, with records not ready for scrutiny.",
    outcome: "Face audits prepared and reduce financial risk.",
    whoFor: "Companies preparing for a statutory audit, and organisations that need comfort over their controls and records for boards, lenders or donors.",
    lead: "Audit preparation and control reviews that make your records credible to auditors, lenders, boards and donors.",
    problems: [
      "An audit approaching with schedules and reconciliations incomplete",
      "Lenders, investors or donors asking for assurance you cannot yet provide",
      "Controls that depend on one person and have never been tested",
      "The same audit findings repeated year after year",
    ],
    handles: [
      { t: "Audit preparation", d: "A clear audit timetable and a checklist of everything auditors will ask for." },
      statutoryAudit,
      { t: "Internal control reviews", d: "How money is approved, paid and recorded — reviewed for gaps and risks." },
      assurance,
      { t: "Supporting schedules", d: "Fixed assets, debtors, creditors and accruals prepared and reconciled." },
      { t: "Risk identification", d: "Financial and compliance risks ranked, with practical fixes." },
    ],
    outcomes: ["Better-prepared audits with fewer surprises", "Schedules ready when auditors ask for them", "Control gaps identified with practical fixes", "Records that lenders and boards can review with confidence"],
    faqs: [
      { q: "How early should we start preparing for an audit?", a: "Preparation works best throughout the year through monthly reconciliations. If your year-end is close, start well before audit fieldwork is scheduled so schedules can be completed calmly." },
      { q: "What is an internal control review?", a: "A structured look at how money moves through your business — who approves, who pays, who records — to find gaps that could lead to errors or losses, with practical recommendations." },
      AUDIT
        ? { q: "Do you carry out statutory audits?", a: "Yes. Tell us about your company and year-end and we will confirm the audit timetable and scope." }
        : { q: "Can you help with our statutory audit?", a: "Yes — we prepare your records, schedules and reconciliations and work alongside your appointed statutory auditor. Tell us your year-end and we will confirm the scope." },
    ],
    prepare: ["Last audited financial statements", "Trial balance and general ledger", "Bank reconciliations and statements", "Fixed-asset, debtor and creditor listings"],
    related: ["preparing-for-an-audit", "financial-controls-for-growing-businesses", "kra-compliance-calendar"],
    selector: "I need an audit",
    seoTitle: "Audit and Assurance Support in Nairobi",
    seoDescription: "Audit preparation, statutory audit support, internal control reviews and supporting schedules for Kenyan companies and NGOs. Face your audit prepared with HMG Group Africa.",
  },
  {
    slug: "financial-advisory",
    motif: "advisory",
    title: "Financial Advisory",
    short: "Advisory",
    problem: "Big decisions — hiring, expanding, borrowing — made without a clear view of cash.",
    outcome: "See cash clearly and decide with confidence.",
    whoFor: "Founders, owners and finance leads planning growth, managing tight cash or preparing to raise funding.",
    lead: "Cash-flow planning, budgets, forecasts and scenarios that turn a financial question into a clear decision.",
    problems: [
      "Profitable on paper but short of cash",
      "No budget, or a budget nobody uses",
      "Growth decisions based on instinct rather than numbers",
      "Lenders or investors asking for forecasts you do not have",
    ],
    handles: [
      { t: "Cash-flow planning", d: "A rolling 13-week forecast that shows pressure points early." },
      { t: "Budgeting", d: "An annual budget built with your team and reviewed quarterly." },
      { t: "Financial forecasts", d: "Profit, cash and balance-sheet forecasts for planning and funding." },
      { t: "Scenario modelling", d: "Steady, strong and slow cases so you know what triggers each decision." },
      { t: "Management reporting", d: "A concise monthly pack focused on the few numbers that matter." },
      { t: "Growth decisions", d: "Hiring, pricing, expansion and financing choices tested before you commit." },
    ],
    outcomes: ["Earlier sight of likely cash shortfalls", "A budget the team can work with", "Key decisions tested against scenarios", "Forecasts prepared for lender and investor discussions"],
    faqs: [
      { q: "What is a 13-week cash-flow forecast?", a: "A week-by-week view of the cash you expect to receive and pay over the next quarter. It shows pressure points early, while there are still options." },
      { q: "Can you help us prepare for a loan or investment?", a: "Yes. We prepare forecasts, budgets and supporting schedules, and help you explain the numbers clearly to lenders or investors." },
      { q: "Is financial advisory only for large companies?", a: "No. Smaller businesses often benefit most, because a single cash squeeze has a bigger impact." },
    ],
    prepare: ["Recent management accounts or bank statements", "Current budget, if any", "Known upcoming payments and receipts", "The decision or plan you are weighing up"],
    related: ["cash-flow-thirteen-week-view", "growth-planning-for-smes", "tax-planning-before-year-end"],
    selector: "I need better cash-flow visibility",
    seoTitle: "Financial Advisory, Budgeting and Cash-Flow Planning in Nairobi",
    seoDescription: "Cash-flow forecasting, budgeting, financial forecasts and scenario modelling for Kenyan businesses planning growth or funding. Decide with confidence with HMG Group Africa.",
  },
  {
    slug: "payroll-management",
    motif: "payroll",
    title: "Payroll Management",
    short: "Payroll",
    problem: "Payroll errors and late statutory remittances that take up management time.",
    outcome: "Accurate payroll with statutory deductions handled.",
    whoFor: "Employers of any size who want payroll and statutory deductions handled accurately every month.",
    lead: "Monthly payroll, statutory deductions and reconciliations, prepared from the data you approve so your team is paid correctly and remittances are ready ahead of each deadline.",
    problems: [
      "Payroll calculated manually and prone to error",
      "Late or incorrect statutory remittances attracting penalties",
      "Joiners, leavers and changes handled inconsistently",
      "No clear monthly view of payroll cost",
    ],
    handles: [
      { t: "Payroll processing", d: "Monthly payroll run, payslips and payment schedules." },
      { t: "Statutory deductions", d: "PAYE, NSSF, SHIF and the Affordable Housing Levy calculated and prepared for remittance." },
      { t: "Payroll reconciliation", d: "Statutory returns reconciled to the payroll report each month." },
      { t: "Compliance calendars", d: "Statutory deadlines tracked, with reminders before they fall due." },
      { t: "Staff records", d: "Joiners, leavers and changes documented consistently." },
      { t: "Monthly reporting", d: "Payroll cost by team and month, with variances explained." },
    ],
    outcomes: ["Payroll calculated accurately from the data you approve", "Statutory deductions prepared ahead of each deadline", "Reconciled payroll records", "Payroll cost visible every month"],
    faqs: [
      { q: "Which statutory deductions do you handle?", a: "We calculate and prepare remittances for PAYE and the statutory contributions that apply to your employees, such as NSSF, SHIF and the Affordable Housing Levy, in line with current rules." },
      { q: "Is our payroll data kept confidential?", a: "Yes. Payroll information is restricted to the consultants working on your account and handled in line with Kenya’s Data Protection Act, 2019." },
      { q: "Can you take over payroll mid-year?", a: "Yes. We review year-to-date records first so that cumulative figures and remittances carry over correctly." },
    ],
    prepare: ["Employee list with salaries and allowances", "Recent payslips and payroll reports", "Statutory registration numbers (KRA, NSSF, SHIF)", "Joiners, leavers and changes this month"],
    related: ["payroll-compliance-checklist", "kra-compliance-calendar", "financial-controls-for-growing-businesses"],
    selector: "I need payroll support",
    seoTitle: "Payroll Management Services in Nairobi",
    seoDescription: "Monthly payroll processing, PAYE, NSSF, SHIF and Housing Levy deductions, reconciliations and payroll reporting for Kenyan employers. Handled by HMG Group Africa.",
  },
  {
    slug: "tax-health-checks",
    motif: "health",
    title: "Tax Health Checks and Compliance",
    short: "Tax health check",
    problem: "Not knowing whether past filings and invoices would stand up to a KRA review.",
    outcome: "Know your exposure and fix it in the right order.",
    whoFor: "Businesses that want certainty about their tax position — before an audit, a funding round or a sale, or simply for peace of mind.",
    lead: "A structured review of your past filings and records that finds exposure early and gives you a short, prioritised plan to fix it.",
    problems: [
      "Uncertainty about whether past returns were correct",
      "Missing or non-compliant eTIMS invoices affecting deductions",
      "Gaps in filing history that could surface in a KRA review",
      "Due diligence or funding ahead that needs a clean tax position",
    ],
    handles: [
      { t: "Historical compliance review", d: "Past returns and payments checked against your records." },
      { t: "Exposure identification", d: "Potential tax, penalties and interest estimated and explained." },
      { t: "Filing gaps", d: "Missed or incomplete returns identified across tax heads." },
      { t: "eTIMS checks", d: "Sales and supplier invoices tested for eTIMS compliance." },
      { t: "Prioritised corrective action", d: "A ranked fix list with owners and dates." },
      { t: "Compliance roadmap", d: "A calendar and routine to keep you compliant afterwards." },
    ],
    outcomes: ["A clearer view of your tax position", "Likely exposure estimated and ranked", "A prioritised plan to address gaps", "A routine to help you stay compliant"],
    faqs: [
      { q: "How long does a tax health check take?", a: "It depends on the size of the business and the period reviewed. We agree the scope and timeline with you before starting." },
      { q: "Will a health check trigger a KRA audit?", a: "No. A health check is a private review for your business. It helps you find and fix issues on your own terms." },
      { q: "What do we receive at the end?", a: "A short report ranking what needs attention and the likely exposure, with a practical plan of owners and dates." },
    ],
    prepare: ["Returns filed for the period under review", "iTax ledger or payment history", "Sales and supplier invoices, including eTIMS", "Any previous KRA correspondence"],
    related: ["etims-invoicing-what-to-check", "kra-compliance-calendar", "tax-planning-before-year-end"],
    selector: "I’m unsure of my compliance position",
    seoTitle: "Tax Health Checks and Compliance Reviews in Kenya",
    seoDescription: "A structured review of past tax filings, eTIMS invoices and exposure, with a prioritised corrective plan. Know your tax position with HMG Group Africa, Nairobi.",
  },
];

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);

/** Situations for the interactive service selector → recommended services, with the reason shown. */
export const SITUATIONS = [
  { id: "kra", label: "I received a KRA notice", services: ["tax-kra-advisory"], why: "KRA notices carry deadlines. We review what is being asked and help you prepare a documented response." },
  { id: "books", label: "My books are behind", services: ["accounting-bookkeeping"], why: "A catch-up plan brings your records current, then a monthly routine keeps them that way." },
  { id: "audit", label: "An audit is approaching", services: ["audit-assurance"], why: "Schedules, reconciliations and evidence prepared before auditors arrive." },
  { id: "cash", label: "Cash flow is unclear", services: ["financial-advisory"], why: "A rolling cash forecast shows pressure points weeks before they arrive." },
  { id: "payroll", label: "Payroll is taking too much time", services: ["payroll-management"], why: "Monthly payroll and statutory deductions prepared from the data you approve." },
  { id: "check", label: "I want to check my compliance", services: ["tax-health-checks"], why: "A structured review of past filings and records, with a prioritised plan." },
  { id: "ongoing", label: "I need ongoing financial support", services: ["accounting-bookkeeping", "financial-advisory"], why: "Regular books and management reporting, with advice on the decisions ahead." },
  { id: "unsure", label: "I am not sure where to start", services: [], why: "" },
] as const;

export const PROBLEM_QUESTIONS = [
  { q: "Are we compliant?", d: "Every tax head, every deadline, one clear status." },
  { q: "Where is the cash going?", d: "What came in, what went out, and what is coming next." },
  { q: "What needs attention?", d: "The few items that matter this month, ranked." },
  { q: "What decision should we make next?", d: "A recommendation, an owner and a date." },
] as const;

export const FEATURED_SERVICES = ["tax-kra-advisory", "accounting-bookkeeping"];

export const OUTCOMES = [
  { id: "comply", title: "Stay compliant", body: "KRA and statutory dates tracked and prepared ahead of time, so filing is not a last-minute scramble." },
  { id: "understand", title: "Understand your finances", body: "Current, reconciled books and a monthly view in plain language, not just a stack of reports." },
  { id: "decide", title: "Make confident decisions", body: "Clear recommendations on cash, tax and growth, with the next step and who owns it." },
] as const;

export const WHY = [
  { t: "Kenyan regulatory knowledge", d: "Daily work with KRA, iTax, eTIMS and Kenyan statutory requirements." },
  { t: "One integrated view", d: "Tax, accounting, audit and advisory seen together, so nothing falls between specialists." },
  { t: "A personal consultant", d: "A named consultant who gets to know your business." },
  { t: "Practical recommendations", d: "Advice framed as decisions you can act on this month." },
  { t: "Clear next steps", d: "Consultations end with agreed actions, owners and dates." },
] as const;

export const PROCESS = [
  { n: "01", title: "Send an enquiry", body: "Tell us briefly what you need — by form, phone or WhatsApp." },
  { n: "02", title: "HMG reviews your needs", body: "We look at your situation and any urgent deadlines before we call." },
  { n: "03", title: "Speak with a consultant", body: "A focused conversation with an HMG consultant about your business." },
  { n: "04", title: "Receive clear next steps", body: "What to do, who does it and by when, agreed with you." },
] as const;

export type InsightKind = "kra" | "etims" | "planning" | "cashflow" | "payroll" | "controls" | "audit" | "growth";
export type InsightCategory = "Tax & Compliance" | "Cash & Controls" | "People & Payroll" | "Audit & Assurance" | "Growth";

export interface Article {
  slug: string;
  kind: InsightKind;
  category: InsightCategory;
  published: string;
  readTime: number;
  title: string;
  summary: string;
  sections: { heading: string; paragraphs: string[] }[];
  takeaways: string[];
}

export const ARTICLE_AUTHOR = "HMG Editorial Team";

export const INSIGHT_CATEGORIES: ("All" | InsightCategory)[] = ["All", "Tax & Compliance", "Cash & Controls", "People & Payroll", "Audit & Assurance", "Growth"];

export const FEATURED_ARTICLES = ["kra-compliance-calendar", "cash-flow-thirteen-week-view", "preparing-for-an-audit"];

export const ARTICLES: Article[] = [
  {
    slug: "kra-compliance-calendar",
    kind: "kra",
    category: "Tax & Compliance",
    published: "2026-09-30",
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
    published: "2026-09-30",
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
    published: "2026-09-30",
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
    published: "2026-09-30",
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
    published: "2026-09-30",
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
    published: "2026-09-30",
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
    published: "2026-09-30",
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
    published: "2026-09-30",
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

export function relatedArticles(slug: string, n = 3) {
  const a = getArticle(slug);
  if (!a) return [];
  const same = ARTICLES.filter((x) => x.slug !== slug && x.category === a.category);
  const rest = ARTICLES.filter((x) => x.slug !== slug && x.category !== a.category);
  return [...same, ...rest].slice(0, n);
}

/** Services whose "related" list includes this article. */
export const servicesForArticle = (slug: string) => SERVICES.filter((s) => s.related.includes(slug));

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
