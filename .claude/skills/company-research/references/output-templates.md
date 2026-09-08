# Output templates

Skeletons for the files in `company-knowledge/<slug>/`. Adapt headings to the business; these
are a starting shape, not a cage. Keep the source markers, the UNKNOWN markers, and the
"Last researched" line in every file — they are what make the output trustworthy later.

Every file starts with:

```markdown
> Company: <Name> · Last researched: <YYYY-MM-DD> · Primary source: <official URL>
> Facts here are verified against the sources in SOURCES.md. Anything marked
> UNKNOWN / REQUIRES COMPANY CONFIRMATION has not been verified — do not fill it in by guessing.
```

## README.md

Index of the folder, one line per file, plus the knowledge boundary block from Step 6 of
SKILL.md, plus the confidence rating and a count of open unknowns.

## PROFILE.md

```markdown
# <Name> — Company profile

## What they do
<One paragraph in plain language.> [source]

## Industry
## Positioning
## Customers they serve
## Where they operate
## Business model
<How money appears to be made: installation projects, retail sales, retainers, events.>

## Scale and history
<Founded, size, projects completed — only if published.>

## Claimed differentiators
## Notable proof points
<Named clients, certifications, awards — only if shown.>
```

## SERVICES.md

One section per service:

```markdown
## <Service name as the company calls it>
- **What it covers**: ...
- **Who it is for**: ...
- **How it works**: <steps the site describes, or UNKNOWN>
- **Price**: <published price, or UNKNOWN / REQUIRES COMPANY CONFIRMATION>
- **Source**: <URL>
```

## PRODUCTS.md

Group by category. For each product or category record: what it is, brands carried, specs
shown on the site, published price or UNKNOWN, warranty or UNKNOWN, and source URL. If the
company sells no products, write "No products — this is a services business" and skip the file.

## FAQ.md

Questions grouped by theme, each answered in the voice the company would use, followed by a
source. Where the honest answer is unknown, write the answer as the assistant should say it:

```markdown
**Do you offer financing?**
UNKNOWN / REQUIRES COMPANY CONFIRMATION — the website does not mention payment plans.
Suggested reply: "Let me check with the team on payment options and come back to you."
```

Include the questions the site answers *and* the obvious ones it doesn't, because the
unanswered ones are exactly what a WhatsApp assistant will be asked first.

## SALES.md

```markdown
# How customers buy

## The journey the site describes
<Enquiry → qualification → survey/consultation → quotation → deposit → delivery → aftercare.
Mark each stage verified or inferred, and say which.>

## Entry points
<Contact form, WhatsApp link, phone, showroom visit, booking page — with URLs.>

## Calls to action used on the site
<Exact wording, and where each leads.>

## What the company asks for up front
<Fields on their forms — these are the questions the business itself considers necessary.>

## Qualification signals that matter to this business
<E.g. property type, load size, budget band, timeline, location.>

## Conversion outcomes
<Quote, booking, site visit, purchase, consultation, technician dispatch.>

## Gaps
<Anything about the process that is not published.>
```

## CONTACT.md

Verified only. Table of phone numbers with what each is for and whether it is WhatsApp;
emails; physical addresses with any map link; opening hours or UNKNOWN; social profiles;
contact form URL and its fields; booking links. Flag anything found only on a third-party
listing as *third-party — confirm with company*.

## BRAND.md

```markdown
## Voice
<Formal/casual, person, sentence length, emoji, greetings, local idiom — with quoted examples
from the site so downstream copy can imitate rather than approximate.>

## Words they use / avoid
<Their term → what others call it. E.g. "solar package" not "kit"; "site survey" not "audit".>

## Visual direction
<Colours only if reliably observed from the site's CSS, logo, or images — say where you saw
them. Typography, imagery style, logo description.>

## How they treat customers
<Consultative, transactional, technical, warm.>

## Do / don't for anyone writing as this company
```

## SOURCES.md

```markdown
| Fact or area | Source URL | Type | Date fetched |
|---|---|---|---|
| Services list | https://... | Official site | 2026-09-08 |
| Opening hours | https://... | Google listing (third party) | 2026-09-08 |
```

Then a **Discrepancies** section for anything where sources disagree, and a **Pages fetched**
list including pages that returned nothing so the next researcher does not repeat the attempt.

## UNKNOWN.md

The safety file. Group by impact:

```markdown
## Commercial (blocks quoting)
- Pricing — UNKNOWN / REQUIRES COMPANY CONFIRMATION
- Financing or payment plans — UNKNOWN
- Deposit terms — UNKNOWN

## Operational (blocks promising)
- Installation turnaround — UNKNOWN
- Delivery times and charges — UNKNOWN
- Service-area boundaries — UNKNOWN

## Policy (blocks reassurance)
- Warranty terms and length — UNKNOWN
- Returns — UNKNOWN

## Company facts
- Team size, founding year, certifications — UNKNOWN

## How to handle these in customer conversations
<One line per item: what the assistant should say instead of guessing.>
```

End with: **Ask the company these questions first** — a short, ordered list of the questions
whose answers would unlock the most downstream work.
