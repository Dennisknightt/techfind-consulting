# Intents, WhatsApp behaviour, and qualification flow

These three files are what turn research into something an automation can use. They fail in a
predictable way: a generic template gets copied from one company to the next, and the
assistant ends up asking a wedding DJ's customers about their electricity bill. Derive
everything here from what you actually read about *this* business.

## INTENTS.md

An intent is a reason someone opens WhatsApp and messages this company. Find them by asking:
what does this business sell, what goes wrong with it, what do customers need to check before
buying, and what do they need after buying?

Aim for 6–12. Name them in `UPPER_SNAKE_CASE`. Format:

```markdown
## HOME_SOLAR
**Customer wants**: to power a home with solar.
**Sounds like**: "Do you install solar for houses?" · "How much for a 3 bedroom?" ·
"I want backup for when power goes"
**Needs to know**: property type, load or bill size, location, goal (backup vs savings).
**Knowledge to answer from**: SERVICES.md § Residential installation, FAQ.md
**Leads to**: site visit or quotation.
**Watch out**: pricing is UNKNOWN — do not quote figures.
```

Cover the shape of the business, not just its headline offer: pre-sale questions, the buying
intent itself, after-sale and support intents, logistics (location, hours, directions), and
a `HUMAN_SUPPORT` escape hatch. Include a `NOT_OUR_BUSINESS` note for how off-topic messages
are handled.

Examples of how different industries diverge — read these as a warning against copying:
- Solar installer: `HOME_SOLAR`, `COMMERCIAL_SOLAR`, `BATTERY`, `INVERTER`, `MAINTENANCE`,
  `SITE_VISIT`, `PRICE_QUERY`, `QUOTE`.
- Events company: `EVENT_BOOKING`, `DATE_AVAILABILITY`, `SOUND_HIRE`, `LIGHTING`, `STAGE`,
  `DJ`, `VENUE`, `QUOTE`.
- Dental clinic: `BOOK_APPOINTMENT`, `TOOTHACHE`, `EMERGENCY`, `CLEANING`, `WHITENING`,
  `BRACES`, `PRICE_QUERY`, `LOCATION`, `INSURANCE`.

## WHATSAPP.md

Write it as instructions to the assistant that will run the account. Cover:

**Identity and tone.** Who it represents, and how it speaks — pulled from BRAND.md, not
invented. Short WhatsApp-length messages, the company's own vocabulary, the greeting style the
company actually uses.

**The core rule — answer, then progress.** The failure mode of sales bots is interrogation:
the customer asks a question and gets a form. The rule is *answer the question first, then ask
the single most useful next question.* One question at a time.

```
Customer: "Do you install solar in Kiambu?"
Good:     "Yes, we cover Kiambu. Is this for your home or a business?"
Bad:      "What's your name? Where do you live? What's your budget?"
```

Write two or three of these good/bad pairs using this company's actual services and areas, so
the pattern is concrete rather than abstract.

**Business boundary.** The assistant represents this company. It answers about the company and
its industry, and politely redirects everything else:

```
Customer: "Who won the football match?"
Assistant: "I'm here to help with <Company>'s services. What can I help you with today?"
```

It should not do general-purpose assistant work (writing essays, coding, unrelated advice),
and should not discuss competitors beyond declining politely.

**Verified-facts rule.** Answers about this company come from the knowledge files. When asked
something in UNKNOWN.md, the assistant says it will confirm and offers to connect a person —
never a plausible-sounding guess. Give the exact wording for the most likely cases
(price, timeline, warranty, stock).

**Outcomes.** List the conversions this business actually has — quotation, booking, site
visit, purchase, consultation, technician dispatch, reservation, human handoff — and which
intents lead to which. Include how the assistant hands over to a person and what it collects
first (usually name, contact, location, and the need).

**Escalation triggers.** Complaints, safety issues, emergencies, refund requests, anything
legal, and repeated confusion go to a human immediately.

**Message style rules.** Length, when emoji are appropriate for this brand, currency and
number formatting, language (including whether Swahili, Sheng, or another local language
should be mirrored if the customer uses it), and never sending walls of text.

## FLOW.md

The shortest path from "hello" to a qualified handover. Three to six questions. Every question
must earn its place: if the sales team cannot act differently based on the answer, cut it.

For each step give: the question in the company's voice, why it matters commercially, the
answer options if they are naturally closed, how to skip it when the customer already told you,
and what to do with an unclear answer.

```markdown
### 1. Home or business?  → routes to the right service and price band
### 2. Where are you located? → confirms it is in the service area
### 3. What are you hoping to achieve? → backup vs savings changes the recommendation
### 4. Roughly what do you spend on power a month? → sizes the system
### 5. When are you looking to do this? → priority and pipeline
→ Then: offer a site visit or quotation, collect name and number, hand over.
```

Close the file with the handover summary the assistant should produce for the sales team —
the collected fields in a fixed order, plus a note of anything the customer asked that
required company confirmation, so the human picks up where the bot stopped.
