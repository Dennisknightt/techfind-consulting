# Research checklist

Use this while working through Step 2 (official website) and Step 3 (secondary sources).
The goal is coverage: it is easy to read a homepage and think you understand a business, and
easy to miss the Terms page where the actual warranty lives.

## Pages to look for

Try these paths and any equivalents the navigation reveals. Kenyan and other regional sites
often use different wording, so match on meaning, not on the exact slug.

| Purpose | Common paths |
|---|---|
| Overview | `/`, `/home` |
| Identity | `/about`, `/about-us`, `/our-story`, `/who-we-are`, `/team`, `/careers` |
| Offer | `/services`, `/solutions`, `/what-we-do`, `/products`, `/shop`, `/catalogue` |
| Commercial | `/pricing`, `/packages`, `/plans`, `/quote`, `/financing` |
| Trust | `/faq`, `/testimonials`, `/reviews`, `/case-studies`, `/projects`, `/portfolio`, `/clients` |
| Policy | `/terms`, `/warranty`, `/returns`, `/delivery`, `/shipping`, `/privacy`, `/installation` |
| Reach | `/contact`, `/locations`, `/branches`, `/book`, `/appointment` |
| Depth | `/blog`, `/news`, `/resources`, `/guides`, `/downloads` |

Also fetch `/sitemap.xml` (and `/sitemap_index.xml`) and `/robots.txt`. Sitemaps routinely
expose product and service pages that the menu does not link to.

## Fetching tactics

- Fetch in parallel. Batch related pages in one turn rather than one at a time.
- If a fetch returns almost no text, the site is probably client-rendered. Try `curl -sL` on
  the raw HTML, check the sitemap for content, and try a search engine query scoped to the
  domain (`site:example.com pricing`). Product data sometimes sits in embedded JSON-LD.
- Watch for a WhatsApp link (`wa.me/...`) or click-to-chat widget — the number in it is a
  verified contact, and its presence tells you the company already sells over WhatsApp.
- Check `<meta>` description, Open Graph tags, and the footer for the legal entity name,
  registration numbers, and secondary phone numbers.
- Note the currency and units used. A price in KSh, ZAR, or USD changes how downstream copy
  should be written.

## Fields to extract

For each, record the value **and** the URL it came from. Mark anything absent rather than
leaving it out silently, because a gap is information downstream tasks need.

- **Identity**: trading name, legal name, tagline, founding year, ownership, size.
- **Description**: what the company does, in its own words.
- **Industry** and sub-sector.
- **Positioning**: premium/budget, specialist/generalist, who it says it is for, claims it
  repeats (fastest, certified, licensed, authorised dealer).
- **Services**: each one, what it includes, who it is for, how it is delivered.
- **Products**: categories, individual products, brands carried, specs shown, stock claims.
- **Customer types**: residential, commercial, institutional, government, resellers.
- **Locations and service areas**: physical addresses, towns/counties covered, whether they
  travel, any stated limits.
- **Contact**: phone numbers (note which is WhatsApp), emails, physical address, hours,
  contact form fields, booking links, social handles.
- **Pricing**: only if published. Note whether it is fixed, "from", per-unit, or a range.
- **Guarantees**: warranty length and scope, workmanship guarantee, returns, service level.
- **FAQs**: the site's own, plus questions the site's copy implies customers ask.
- **Sales process**: consultation, survey, site visit, quotation, deposit, installation,
  handover, aftercare — whatever the site describes.
- **Calls to action**: the exact button and link wording used, and where each leads.
- **Tone of voice**: formal or casual, first or third person, emoji use, sentence length,
  English variety, local idiom, how they address the reader.
- **Terminology**: the words the company uses for its own things (system, package, kit,
  installation, survey, technician, consultant). Downstream copy should match these.
- **Differentiators**: what the company says makes it different, and what visibly does.
- **Certifications, licences, partnerships, accreditations**: only if shown on the site.
- **Proof**: named clients, project counts, review counts, awards, media mentions.

## What to record as not available

Explicitly check for and note the absence of: published prices, lead times, installation or
delivery turnaround, financing or payment plans, warranty terms, opening hours, service-area
boundaries, staff numbers, and after-sales process. These are the facts customers ask about
first, and the ones an AI is most tempted to invent.

## Secondary sources

Search for: `"<company name>"`, `"<company name>" reviews`, `"<company name>" LinkedIn`,
`"<company name>" <city>`, and the phone number if you found one. Look at Google Business
Profile data in search results (hours, rating, address), LinkedIn (size, founding, sector),
Facebook and Instagram (activity level, offers, how they talk to customers), directories,
and industry association member lists.

Record for each source: the URL, what it told you, and whether it agrees with the official
site. Conflicts belong in SOURCES.md as a noted discrepancy and in UNKNOWN.md if the conflict
affects something a customer would rely on.
