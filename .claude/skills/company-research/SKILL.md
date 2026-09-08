---
name: company-research
description: Deeply research a company from its website and public sources, then write a verified, source-cited company knowledge base (profile, services, products, FAQ, sales process, contact, brand, sources, unknowns, customer intents, WhatsApp assistant behaviour, qualification flow) into company-knowledge/<slug>/. Use this whenever the user asks to study, research, profile, understand, or "learn about" a company or business, shares a company URL and wants it analysed, or is about to build a website, WhatsApp automation, chatbot, CRM setup, sales demo, or any customer-facing software for a specific client and needs to know what that business actually offers. Trigger even if the user just says "study this company" or pastes a URL with a company name — research must happen before any client build.
argument-hint: "[company name] <website URL>"
---

# Company Research

Build a trustworthy knowledge base about one company so that later Claude tasks (websites,
WhatsApp bots, CRM setups, sales demos) can speak for that company without inventing anything.

The output is the folder `company-knowledge/<company-slug>/` at the repository root. The
purpose of this skill is research and understanding only. Do not build a website, bot, or
anything else afterwards unless the user asks for it in a separate request.

## The one rule that matters most

**Never invent company facts.** Downstream software will repeat whatever you write to real
customers. A fabricated price, warranty, branch, delivery time, certification, partnership,
discount, phone number, or spec becomes a promise the company never made. So:

- Every company-specific claim in the output must trace to a page you actually read.
- If you could not verify something, write exactly: `UNKNOWN / REQUIRES COMPANY CONFIRMATION`.
- A short, honest knowledge base beats a complete-looking one that is partly made up.
- General industry knowledge (how solar batteries work, what a root canal is) may be used to
  *explain* things, but must never be phrased as if it were this company's policy or offer.

## Step 1: Parse the input

Input arrives as `$ARGUMENTS` (for `/company-research ...`) or in the user's sentence.
Accept any of: a URL alone, a name plus URL, or a name alone.

- **URL given**: the URL is the primary source. Derive the company name from the site itself
  (title tag, logo alt text, About page, footer). Do not trust the domain to be the name.
- **Name given without URL**: web-search for the official site. Confirm it is the right company
  (matching name, location, industry) before treating it as authoritative. If you cannot find
  an official site, say so and proceed with clearly labelled secondary sources only, with a
  `Low` confidence rating.
- **Slug**: lowercase, hyphenated company name (`Divine Budget Entertainment` →
  `divine-budget-entertainment`). If only a domain is known, use its registrable label
  (`transford.co.ke` → `transford`). Reuse an existing folder if one already matches.

## Step 2: Research the official website

The company's own website is the authority on what the company offers, charges, and promises.
Read it thoroughly before anything else. Follow `references/research-checklist.md` for the
page list, extraction fields, and fetching tactics. In brief:

1. Fetch the homepage. Collect every internal link from navigation, footer, and body.
2. Fetch `/sitemap.xml` and `/robots.txt` to discover pages the navigation hides.
3. Visit every relevant page: About, Services, Products, Solutions, Pricing, FAQ, Contact,
   Locations/Branches, Blog or Resources, Terms/Warranty/Returns/Delivery, Testimonials,
   Case studies, Team, Careers (often reveals size and locations).
4. Extract the fields in the checklist: name, description, industry, positioning, services,
   products, brands carried, customer types, service areas, contact details, pricing,
   guarantees, FAQs, sales process, calls to action, tone of voice, terminology,
   differentiators, and social links.
5. Note, page by page, what you looked for and did not find. Absence is a finding.

Fetch pages in parallel where you can. Quote or closely paraphrase the site's wording for
claims; keep the URL of the page each fact came from because SOURCES.md needs it.

If the site is JavaScript-rendered and fetches return almost nothing, try the sitemap, the
raw HTML via `curl`, and a search engine query restricted to the domain. If content still
cannot be read, record that in UNKNOWN.md instead of guessing what the pages probably say.

## Step 3: Secondary research

Once the official site is exhausted, use web search to fill context the site does not give:
business listings (Google Business Profile snippets, Yelp-style directories), LinkedIn company
page, Facebook, Instagram, TikTok, YouTube, reputable directories, industry bodies, news, and
review sites. Useful for: operating hours, review sentiment, employee count range, founding
year, additional locations, recent activity, and how customers describe the business.

Rules for secondary sources:

- The official site wins on anything about the company's own products, prices, policies,
  and services. Third-party information that conflicts with it is noted as a discrepancy, not
  silently substituted.
- Third-party-only facts (a phone number found only on a directory, an hours listing from a
  map result) are recorded with their source and flagged as *third-party, confirm with company*.
- Reviews are evidence of customer experience and common questions, not of company policy.
- Record the URL of every secondary source used.

## Step 4: Write the knowledge base

Create `company-knowledge/<company-slug>/` and write the files below using the templates in
`references/output-templates.md`. Only create a file if it is relevant to the company (a pure
service business may have no PRODUCTS.md; a company with no FAQ page still gets FAQ.md built
from questions customers would obviously ask, answered only with verified facts).

| File | Contents |
|---|---|
| `README.md` | Index of the folder plus the knowledge boundary for downstream tasks (Step 6) |
| `PROFILE.md` | Overview, industry, positioning, customer types, business model, service areas |
| `SERVICES.md` | Verified services, each with what is included, for whom, and source |
| `PRODUCTS.md` | Verified products or product categories, brands carried, pricing if published |
| `FAQ.md` | Questions a prospective customer is likely to ask, with verified answers or UNKNOWN |
| `SALES.md` | How enquiry → qualification → quote/booking/purchase appears to work, CTAs used |
| `CONTACT.md` | Verified phones, emails, addresses, hours, social handles, forms |
| `BRAND.md` | Voice, terminology, visual direction, colours if reliably observed, do/don't list |
| `SOURCES.md` | URL for every important fact, grouped by page, with the date fetched |
| `UNKNOWN.md` | Every important thing that could not be verified |
| `INTENTS.md` | Likely reasons a customer messages the company on WhatsApp (Step 5) |
| `WHATSAPP.md` | How an automated WhatsApp representative for this company should behave |
| `FLOW.md` | The shortest useful inbound qualification flow for this business |

Write in plain Markdown. Mark every unverified item inline as
`UNKNOWN / REQUIRES COMPANY CONFIRMATION` and also list it in UNKNOWN.md so the gaps are
visible in one place. UNKNOWN.md is the most important file for downstream safety: an AI that
knows what it does not know will ask instead of inventing.

## Step 5: Intents, WhatsApp behaviour, and qualification flow

These three files must be derived from *this* business, not copied from a template.
Read `references/whatsapp-and-flow.md` before writing them. The short version:

- **INTENTS.md**: list the 6–12 most likely reasons someone would WhatsApp this company,
  named in `UPPER_SNAKE_CASE`, each with example customer messages, the information needed to
  handle it, and the business outcome it should lead to. A solar installer, a wedding DJ, and
  a dental clinic have almost nothing in common here. Include the universal ones only when they
  apply (`PRICE_QUERY`, `LOCATION`, `OPENING_HOURS`, `HUMAN_SUPPORT`).
- **WHATSAPP.md**: define the assistant's identity, tone (matched to BRAND.md), the business
  outcomes it steers toward (quote, booking, site visit, consultation, purchase, reservation,
  handoff to a person), the strict business boundary with the redirect line, the
  *answer → then move one step forward* rule with company-specific examples, and what it must
  say when asked about anything in UNKNOWN.md.
- **FLOW.md**: 3–6 questions that this company genuinely needs before it can quote, book, or
  hand over, in the order a good salesperson would ask them, with why each question matters
  and what to do when the customer already answered it. Fewer questions is better.

## Step 6: Knowledge boundary for downstream tasks

Put this in the folder's `README.md` so any later task that reads the folder inherits it:

> Facts about this company come only from the files in this folder. General industry
> knowledge may be used to explain concepts but must never be presented as company-specific.
> If something is not in these files, or is marked UNKNOWN, say it requires confirmation from
> the company. Do not guess prices, availability, timelines, policies, or contact details.

## Step 7: Report back

Finish with this concise report in the chat, filled in from what you actually verified:

```
COMPANY STUDIED

Company:   <name>
Industry:  <industry>
Website:   <URL>
Folder:    company-knowledge/<slug>/

Knowledge:
✓ Profile
✓ Services
✓ Products          (or "– not applicable")
✓ FAQ
✓ Sales process
✓ Contact
✓ Brand
✓ Customer intents
✓ WhatsApp behavior
✓ Qualification flow

Confidence: High | Medium | Low
Missing information: <N> important items (see UNKNOWN.md) — <the 3–5 most consequential>

Company knowledge ready.
```

Confidence guide: **High** when the official site was fully readable and services, contact,
and positioning are all verified from it. **Medium** when the site was partly readable or key
commercial facts (pricing, areas, hours) are missing. **Low** when the official site could not
be read or found and the profile rests mostly on third-party sources.

Then stop. Do not start building anything unless the user asks.

## Quality bar before you report

- Open each file you wrote and check that every specific claim has a source in SOURCES.md.
- Search your output for numbers (prices, years, counts, times) and confirm each one was on a
  page you read. Delete or mark UNKNOWN anything you cannot place.
- Confirm no intent, flow question, or FAQ answer assumes a service the site does not mention.
- Confirm UNKNOWN.md lists at least the commercial basics that were not found: pricing,
  turnaround or delivery times, warranty terms, financing, service area limits, hours.
