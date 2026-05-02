# walkwitheric.com — Implementation Spec (Current)

## Overview

A redesign of walkwitheric.com. The site serves two audiences: people looking for a walking tour guide in San Francisco, and people looking for Eric's book. The goal is for visitors to quickly understand that Eric is an exceptional guide — without bragging — and to find his schedule and book a tour through SF City Guides. The site should feel unhurried, confident, and literary. Not a site people linger on; a site that gives them what they need and sends them where they need to go.

**Stack:** Eleventy + Tailwind CSS + Alpine.js
**Structure:** Two pages — `index.html` (tour guide, one long scroll) and `/the-ledger-and-the-mirror/` (book page)
**Live site:** https://walkwitheric.com
**Dev deployment:** ericdf.github.io/walkwitheric — all paths rooted at `/`

---

## Environment

- Python virtualenv named `walkwitheric` exists. Create a `.venv` symlink pointing to it and install packages there.
- During dev and prod, everything is rooted at `/`
- Ensure all assets use efficient formats (prefer `.webp`, optimize images for web)

---

## Design System

### Aesthetic Direction

Editorial/cartographic. Think a beautifully typeset city guide magazine crossed with an old map. Warm paper tones, distinguished serif headlines, generous whitespace, subtle texture. Confident without being showy.

### Fonts

Load via Google Fonts:

```
https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300;1,8..60,400&display=swap
```

- **Headlines:** Playfair Display (400, 600, italic 400)
- **Body:** Source Serif 4 (300, 400, italic variants)

### Color Palette

```css
--ink: #2a2118;            /* primary text */
--ink-mid: #5a4e3c;        /* body text, secondary */
--ink-light: #8a7a66;      /* captions, metadata */
--parchment: #f5f0e8;      /* page background */
--parchment-dark: #ede6d6; /* strip backgrounds, card backgrounds */
--parchment-deep: #d4c9b0; /* borders, rules */
--accent: #8b3a1a;         /* CTAs, links, accent elements */
--accent-light: #c0582a;   /* hover states */
--gold: #b8932a;           /* credentials labels, tour "written by" tags */
--rule: rgba(90,78,60,0.25); /* horizontal rules */
```

Add to `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      ink: '#2a2118',
      'ink-mid': '#5a4e3c',
      'ink-light': '#8a7a66',
      parchment: '#f5f0e8',
      'parchment-dark': '#ede6d6',
      'parchment-deep': '#d4c9b0',
      accent: '#8b3a1a',
      'accent-light': '#c0582a',
      gold: '#b8932a',
    },
    fontFamily: {
      serif: ['"Playfair Display"', 'Georgia', 'serif'],
      body: ['"Source Serif 4"', 'Georgia', 'serif'],
    },
  }
}
```

### Typography Scale

- **Masthead H1:** 52px, Playfair Display 400
- **Section titles:** 30px, Playfair Display 400
- **Tour names:** 22px, Playfair Display 400
- **Book title:** 24px, Playfair Display italic
- **Pull quotes:** 17px, Playfair Display italic (quote cards: 15px)
- **Intro p1:** 19px, Source Serif 4, italic, color: --ink
- **Intro p2:** 17px, Source Serif 4, color: --ink-mid
- **Body/descriptions:** 14px, Source Serif 4, weight 300, color: --ink-mid
- **Credentials/labels:** 12px, Source Serif 4, color: --ink-mid
- **Eyebrow/uppercase labels:** 10-11px, letter-spacing: 0.2-0.25em, uppercase
- **Captions:** 11px, uppercase, letter-spacing: 0.08em

### Max Width & Layout

- Max width: 780px, centered, padding: 0 1.5rem
- Single column with full-bleed exceptions for the credentials strip and book promo block (margin: 0 -1.5rem to break out of the content column)

---

## Image Directory

Source images live in `src/images/`. Reference all images in templates as `/images/filename.jpg` (or `.webp` after conversion). Configure Eleventy passthrough:

```javascript
eleventyConfig.addPassthroughCopy("src/images");
```

**All confirmed image files:**

| File | Used on | Alt text |
|------|---------|----------|
| `eric.jpg` | index — intro block | Eric leading a tour |
| `maritime.jpg` | index — Maritime SF tour card | A tall ship under full sail passing the Golden Gate Bridge |
| `1840s.jpg` | index — 1840s SF tour card | 1840s San Francisco |
| `japaneseteagarden.jpg` | index — Japanese Tea Garden tour card | The Japanese Tea Garden, Golden Gate Park |
| `boomandbust.jpg` | index — Boom and Bust tour card | San Francisco Financial District |
| `japantown.jpg` | index — Japantown tour card | Japantown, San Francisco |
| `latm-front-cover.jpg` | book page — cover image | The Ledger and the Mirror, book cover |
| `komorebi_logo.jpg` | book page — publisher logo | Komorebi Press |

Convert all to `.webp` for production. Keep originals as fallback.

Tour card images: fixed height 200px, `object-fit: cover`, `object-position: center`, filter: `sepia(15%) contrast(0.95)`. Image spans full card width above the text content — the `1fr auto` grid applies only to the content row below the image.

---

## Page 1: index.html

### Section 1 — Masthead

Centered. Border-bottom: 2px solid --rule. Padding: 3.5rem 0 2rem.

```
[eyebrow — 10px, uppercase, letter-spacing 0.25em, color --ink-light]
Discover San Francisco With Eric

[H1 — 52px, Playfair Display]
Walk With Eric

[tagline — 16px, italic, color --ink-mid]
History, stories, and a great excuse to be outside
```

---

### Section 2 — Intro Block

Two-column grid: `1fr 200px`. Gap: 2.5rem. Padding: 2.5rem 0. Border-bottom: 1px solid --rule. Align-items: start.

**Left — text:**

Paragraph 1 (19px, italic, color --ink):
> Walk with me to journey from looking to seeing with understanding — the moment when a building, a street corner, or a name on a plaque stops being scenery and suddenly has something to say.

Paragraph 2 (17px, color --ink-mid):
> I believe history should be engaging — thought-provoking and genuinely rewarding to encounter. That's why I scour the archives: to find the facts, yes, but more importantly to unearth the stories that make those facts land. I've been leading tours with San Francisco City Guides for years, wrote two of the tours I lead, and have trained dozens of other guides along the way.

**Right — photo:**

`/images/eric.jpg` — max-width 180px, border: 3px solid --parchment-deep, filter: sepia(20%) contrast(0.95)

Caption: `Eric F. · SF City Guides` — 11px, uppercase, letter-spacing: 0.08em, color --ink-light

**Mobile (≤560px):** Stack to single column, photo moves above text, max-width 120px.

---

### Section 3 — Credentials Strip

Full-bleed (margin: 0 -1.5rem). Background: --parchment-dark. Border-top and border-bottom: 1px solid --parchment-deep. Padding: 1.25rem 1.5rem. Flex-wrap. Gap: 0.4rem 1.5rem.

Five credentials, each preceded by a 4px × 4px circle (background --accent). Text: 12px, color --ink-mid, letter-spacing: 0.04em.

1. Author, *The Ledger and the Mirror*
2. Featured on KALW & CBS Bay Area
3. Trained dozens of City Guides volunteers
4. Founding Editor, Japanese Tea Garden Newsletter
5. Available for speaking engagements

---

### Section 4 — Quotes Grid

Two-column grid `1fr 1fr`, gap: 1rem. Padding: 2rem 0. Border-bottom: 1px solid --rule.

Five cards. Cards 1–4 in the 2×2 grid. Card 5 spans full width (`grid-column: 1 / -1`).

Each card: background --parchment-dark, border-left: 3px solid --parchment-deep, padding: 1.1rem 1.25rem.

Quote text: 15px, Playfair Display italic, color --ink, line-height 1.6.
Attribution: 11px, uppercase, letter-spacing: 0.06em, color --ink-light.

**Card 1:**
> "Eric is exceptional. Knowledgeable, witty, and gracious — Japantown tells a terrific story, but Eric makes it memorable."

*— Japantown*

**Card 2:**
> "His knowledge and professionalism made it the highlight of their visit to San Francisco."

*— Japanese Tea Garden*

**Card 3:**
> "A great guide, great tour, and great scenery — a trifecta."

*— Maritime San Francisco*

**Card 4:**
> "Our family has enjoyed walking tours all over the globe, and many in San Francisco — this really was one of the best ever. Lots of gasps from our crowd at what we learned."

*— 1840s San Francisco*

**Card 5 (full width):**
> "Eric made a point to understand our group and tailored the experience accordingly — weaving in insights from his own background that added an extra layer of authenticity. Knowing that he offers these tours for free makes his dedication even more impressive."

*— Boom and Bust, private tour*

**Mobile:** Stack to single column.

---

### Section 5 — Book Promo Block

Full-bleed (margin: 2.5rem -1.5rem). Background: --ink. Color: --parchment. Padding: 2.5rem 2rem.
Grid: `1fr 140px`, gap: 2rem, align-items: start.

**Left column:**

Label (10px, uppercase, letter-spacing: 0.25em, color --gold, weight 300):
`New from Komorebi Press`

Title (24px, Playfair Display italic, color --parchment):
`The Ledger and the Mirror`

Byline (11px, uppercase, letter-spacing: 0.1em, color rgba(245,240,232,0.45), weight 300):
`Eric Friedman`

Body (14px, color rgba(245,240,232,0.75), weight 300, line-height 1.7):
> Why had California's most consequential early businessman been nearly erased from history? The Leidesdorff tour started with that question. This book is the answer — archival detective work tracing William Alexander Leidesdorff across continents, legends, and contested origins, born from the same deep curiosity that drives every walk I lead.

Blurbs block (border-top: 1px solid rgba(245,240,232,0.12), padding-top: 1rem, margin-bottom: 1.25rem, gap: 0.75rem):

Blurb 1 text (13px, Playfair Display italic, color rgba(245,240,232,0.8)):
> "A well-researched biography of one of young San Francisco's most enigmatic citizens."

Attribution (11px, color rgba(245,240,232,0.4), letter-spacing: 0.06em):
`—Gary Kamiya, author of Cool Gray City of Love and Spirits of San Francisco`

Blurb 2 text:
> "Refreshingly urgent twenty-first-century prose."

Attribution:
`—John King, author of Portal and Cityscapes`

CTA (border: 1px solid --gold, color --gold, 11px, uppercase, letter-spacing: 0.12em, padding: 0.5rem 1rem):
`About the book` → `/the-ledger-and-the-mirror/`

**Right column — book cover:**

`/images/latm-front-cover.jpg` — aspect ratio 2/3, full width of column.
Alt: `The Ledger and the Mirror, book cover`

**Mobile:** Stack to single column. Cover image stacks below text.

---

### Section 6 — Tours

**Section head:**

Label (11px, uppercase, letter-spacing: 0.2em, color --ink-light, Source Serif 4 300):
`The Tours`

Title (30px, Playfair Display):
`San Francisco's history, mysteries, and the Bay itself.`

Subtitle (15px, Source Serif 4 300, italic, color --ink-mid, line-height 1.7):
> A quiet garden, a windswept bay, a neighborhood with three hidden histories, one of the city's most enigmatic founders, and the cycles of discovery, innovation, and disruption that have reinvented San Francisco and the world again and again. Riveting stories that will make you glad you came.

**Tour intro note** (14px, italic, weight 300, color --ink-light, padding: 0.75rem 0 1rem, border-bottom: 1px solid --rule):
> All tours run through San Francisco City Guides — a nonprofit program of the San Francisco Public Library. Every walk is free; donations support the program. Private tours are also available — ideal for work groups, family visits, or custom experiences. I lead the tours below, but the full City Guides schedule has outstanding guides across the whole city. Book whatever calls to you.

---

#### Tour Card Structure

Each tour card:
1. Full-width image (200px height, `object-fit: cover`, filter: `sepia(15%) contrast(0.95)`) — spans full card width
2. Content row below image: grid `1fr auto`, gap: 1.5rem, padding: 1.25rem 0 1.75rem
3. Border-bottom: 1px solid --rule. First card also has border-top.

**Content left column:**
- Tour name: 22px, Playfair Display, color --ink
- "Tour written by Eric" label (where applicable): 11px, uppercase, letter-spacing: 0.1em, color --gold, weight 300
- Description: 14px, Source Serif 4 300, color --ink-mid, line-height 1.7
- Media callout (where applicable): 12px, italic, color --ink-light; links in --accent
- Bracket aside (Japanese Tea Garden only): background --parchment-dark, border-left: 3px solid --parchment-deep, padding: 0.85rem 1rem, margin: 0.85rem 0 0.25rem, 13px, color --ink-mid, weight 300
- "Nearby recommendations" link: 12px, color --accent, border-bottom: 1px solid rgba(139,58,26,0.3), opens in new tab

**Content right column:**
- "View schedule" CTA: background --accent, color --parchment, 11px, uppercase, letter-spacing: 0.12em, padding: 0.5rem 1rem. Hover: --accent-light. Opens in new tab.

**Mobile:** Stack to single column. CTA aligns left.

---

**Tour 1: Maritime San Francisco**
Image: `/images/maritime.jpg`
*Tour written by Eric*

> A tour of the City by the Bay that finally gives the Bay its due. History and culture woven together with whatever is actually unfolding in front of us — boardsport athletes, racing sailboats, Coast Guard vessels, fishing boats. I spend a fair amount of time on the water myself, and it shows.

Media callout: Featured by [Latitude 38](https://www.latitude38.com/lectronic/2025/09/29/#guided-walk-san-francisco-maritime-past-present)

Nearby recommendations: https://docs.google.com/document/d/1nv8yu3_P6hR9_ZF9g5GAbupsVxdPJjTW5kXbAxRJu-U/edit?usp=sharing

View schedule: https://sfcityguides.org/tour/maritime-sf/

---

**Tour 2: 1840s San Francisco & the Legacy of America's First Black Millionaire**
Image: `/images/1840s.jpg`
*Tour written by Eric*

> I built this tour from scratch, hunting through archives for clues about a remarkable and shockingly undervalued figure in California history. The story is intriguing; the story of the story takes it even further. The research also became my book.

Media callout: Featured on [KALW 91.7](https://www.kalw.org/show/state-bay/2025-08-24/valkyries-vibes-bay-area-unified-americas-first-black-millionaire) and [CBS Bay Area](https://www.youtube.com/watch?v=_pXELxaVHCI)

Nearby recommendations: https://docs.google.com/document/d/1LfxVYSsd9saJUW4UQYjZLLTT0lX6fz7hfk51dBmFHas

View schedule: https://sfcityguides.org/tour/1840s-san-francisco-and-the-astonishing-legacy-of-americas-first-black-millionaire/

---

**Tour 3: Japanese Tea Garden**
Image: `/images/japaneseteagarden.jpg`
*(No "Tour written by Eric" label)*

> People who wander in without intending to take a tour often end up staying for the whole experience. The oldest continuously operating public Japanese garden outside of Japan, the Garden was created for the 1894 Midwinter Fair. It is transformed when someone shows you how to read it: botany, history, horticulture, spiritual depth, and the iconic structures that will earn their place in your memory and photo stream.

Bracket aside:
> This Garden and I go deeper than the tours. After studying the Main Gate's traditional bracket system, I built a scale model of one of its roof brackets — displayed at the Garden and at the Kezuroukai woodworking gathering. The project and photos are [on my woodworking site](https://justwood.design/work/tokyo-bracket/).

Nearby recommendations: https://docs.google.com/document/d/1lhsKlREKSpnU_VCr_fmnfQz0kgdz-dH3e71h3T1Eow4/edit

View schedule: https://sfcityguides.org/tour/japanese-tea-garden/

---

**Tour 4: Boom and Bust**
Image: `/images/boomandbust.jpg`
*(No "Tour written by Eric" label)*

> Gold Rush. Silver Rush. Dot Com. Today's AI boom. The plummets into panic, racial violence, and displacement. A sweeping yet focused look at the city's economic rhythms from the 1840s to today — history that rhymes loudly with the present. As a veteran of the tech industry, I bring particular insight into how that sector has shaped and continues to shape the region. Especially compelling as a private tour for work groups.

Nearby recommendations: https://docs.google.com/document/d/1sEy2sdILs1GU-u7tZVMsL388FAE-ZppbOpQP-BVCQdA

View schedule: https://sfcityguides.org/tour/san-francisco-boom-bust/

---

**Tour 5: Japantown**
Image: `/images/japantown.jpg`
*(No "Tour written by Eric" label)*

> San Francisco's Japantown — one of only three remaining in the US, and the largest and oldest — is also the city's most layered neighborhood, once called "the Little United Nations." Jewish, Japanese, and Black American communities each made a home here, in a neighborhood always already in flux. Food culture, public art, comparative religions, and surprising cultural crossovers. Lots of good places to eat nearby too.

Nearby recommendations: https://docs.google.com/document/d/1L7WFtLzVNASo6L24OwwiKGq-d2MUAIKTxcJtW2lEZDU/

View schedule: https://sfcityguides.org/tour/japantown/

---

### Section 7 — Schedule Banner

Background: --parchment-dark. Border: 1px solid --parchment-deep. Border-left: 4px solid --accent. Padding: 1.5rem 1.75rem. Margin: 2.5rem 0.

**Heading (20px, Playfair Display):** Ready to walk?

**Body (14px, Source Serif 4 300, color --ink-mid):**
> My personal tour calendar shows exactly when I'm leading — but you'll need to head to the San Francisco City Guides website to book. Once there, look for Eric F. on the schedule.

**Inline calendar feed** (appears above CTAs, only when events exist — see Alpine.js section below)

**Primary CTA** (background --accent, color --parchment, 12px uppercase, opens in new tab):
`My personal schedule` → https://calendar.google.com/calendar/embed?src=aldkllofa2m63nlbo4rca9lscu31mm52%40import.calendar.google.com&ctz=America%2FLos_Angeles

**Secondary CTA** (transparent, border: 1px solid --accent, color --accent, opens in new tab):
`Book on City Guides` → https://sfcityguides.org

---

#### Inline Calendar Feed (Alpine.js + iCal)

**iCal feed URL:** `REDACTED_ICAL_URL`

This is a Google Calendar public iCal feed — reliable uptime, standard `.ics` format. Parse with ical.js (CDN: `https://cdn.jsdelivr.net/npm/ical.js`). Google Calendar public iCal feeds are generally CORS-friendly, but if the browser blocks the request route through a lightweight proxy.

**Behavior:**
- Fetch on page load
- Filter events: DTSTART >= today, sort ascending
- If `events.length === 0`: render nothing — no heading, no container, no empty state
- If events exist: render a simple list above the CTAs

**Event display format:**
```
Saturday, May 10 — Japanese Tea Garden — 10:00 AM
```
Style: 13px, Source Serif 4, color --ink-mid, no bullets, simple list.

---

### Section 8 — Beyond the Tour

Label (11px, uppercase, letter-spacing: 0.2em, color --ink-light):
`Beyond the Tour`

Title (30px, Playfair Display):
`When I'm not walking`

Body (15px, Source Serif 4 300, color --ink-mid, line-height 1.8):

> I'm a Berkeley-based artist, craftsman, and writer. My woodworking practice — Japanese joinery, furniture, turned and carved objects — lives at [justwood.design](https://justwood.design). I enjoy drawing and painting in various media. I spend as much time as possible in, on, and under the water.

> The same impulse drives all of it: curiosity about how things come together, and why they matter.

Border-bottom: 1px solid --rule.

---

### Section 9 — Footer

Flex row, space-between, flex-wrap, padding: 2rem 0.

**Left** (13px, italic, weight 300, color --ink-light):
> There's always another story around the corner. Come find it.

**Right — links** (12px, uppercase, letter-spacing: 0.08em, color --ink-light, no underline, hover: color --accent):
- [Instagram](https://instagram.com/ericofberkeley) — new tab
- Email — obfuscated (see below)
- [justwood.design](https://justwood.design) — new tab

**Email obfuscation (Alpine.js, String.fromCharCode):**

Use the same pattern as justwood.design — assemble the address at click time via Alpine.js computed properties so it never appears as a plain string in source:

```javascript
function emailLink() {
  return {
    href() {
      const u = 'eric';
      const d = 'walkwitheric' + String.fromCharCode(46) + 'com';
      return 'mailto:' + u + String.fromCharCode(64) + d;
    }
  }
}
```

Apply the same pattern to the "Notify me when available" button on the book page.

---

## Page 2: /the-ledger-and-the-mirror/

Same design system, fonts, and color palette as index. Page lives at `src/the-ledger-and-the-mirror/index.njk` so it resolves to `/the-ledger-and-the-mirror/`.

Includes a site header with a small back-link to `/` — styled as a quiet text link in --ink-light:
`← Walk With Eric`

---

### Book Page — Section 1: Masthead

Centered. Border-bottom: 2px solid --rule. Padding: 3.5rem 0 2rem.

```
[eyebrow — 10px, uppercase, letter-spacing 0.25em, color --gold]
New from Komorebi Press

[H1 — 44px, Playfair Display italic]
The Ledger and the Mirror

[byline — 14px, Source Serif 4 300, color --ink-mid]
Eric Friedman
```

---

### Book Page — Section 2: Cover + Description

Two-column grid: `200px 1fr`, gap: 3rem, align-items: start. Padding: 3rem 0. Border-bottom: 1px solid --rule.

**Left — cover image:**
`/images/latm-front-cover.jpg` — full width of column, box-shadow: 0 4px 24px rgba(42,33,24,0.18)
Alt: `The Ledger and the Mirror, book cover`

**Right — description:**

Label (10px, uppercase, letter-spacing: 0.2em, color --ink-light):
`About the book`

Body (16px, Source Serif 4, color --ink-mid, line-height 1.85):

> William Alexander Leidesdorff arrived in Yerba Buena in 1841 with a ship, a story, and a secret. Within a few years he had become one of the most prominent figures in the small Mexican port that would soon transform into San Francisco — a merchant, a diplomat, a civic leader, and by some measures the wealthiest man in California. He died in May 1848, four months after the discovery of gold — and, as it happened, on property neighboring the discovery site. He left behind a hotly contested estate and a biography so carefully constructed that it would take nearly two centuries to unravel.

> Leidesdorff was Black. Born in the Danish Caribbean to a Danish father and an Afro-Caribbean mother, he had reinvented himself in the United States as a man of ambiguous origins — a reinvention that society demanded and that history then completed, quietly erasing the man behind the ledger.

> *The Ledger and the Mirror* is the story of that erasure and its undoing. Drawing on archival records in California and Denmark, on the paper trails left by the men who knew Leidesdorff and the men who profited from his death, Eric Friedman reconstructs a life lived at the intersection of race, commerce, and the founding of American California. The result is a portrait of an extraordinary man and of the city he helped build — a city that would go on to forget him almost completely.

> The book grew directly out of Friedman's research for his San Francisco City Guides walking tour on the 1840s city and Leidesdorff's legacy — a tour he designed from scratch after the archival evidence refused to leave him alone.

**Mobile:** Stack to single column, cover image above description, max-width 240px centered.

---

### Book Page — Section 3: Blurbs

Background: --parchment-dark. Margin: 0 -1.5rem. Padding: 2.5rem 2rem. Border-top: 1px solid --parchment-deep. Border-bottom: 1px solid --parchment-deep.

Three blurbs, stacked, separated by thin rules (1px solid --parchment-deep).

Each blurb:
- Quote (18px, Playfair Display italic, color --ink, line-height 1.65)
- Attribution (12px, Source Serif 4, color --ink-light, margin-top: 0.5rem)

**Blurb 1:**
> "The Ledger and the Mirror is a well-researched biography of William Leidesdorff, one of Yerba Buena and young San Francisco's leading, and most enigmatic, citizens. It clears up a number of myths about this mixed-race pioneer."

*—Gary Kamiya, author of Cool Gray City of Love: 49 Views of San Francisco and Spirits of San Francisco: Voyages Through the Unknown City*

**Blurb 2:**
> "Embodying in his own European, African, Jewish, and Caribbean ancestry the cosmopolitan populace of Mexican Yerba Buena before it leapt onto the world's attention as San Francisco, William Leidesdorff emerges as a vivid character in Eric Friedman's The Ledger and the Mirror. Based on extensive research into his subject's records and those who knew him, Friedman recreates an almost mythical California just prior to the discovery of gold whose riches narrowly eluded one extraordinary man at an epochal hinge of world history."

*—Gray Brechin, author of Imperial San Francisco: Urban Power, Earthly Ruin*

**Blurb 3:**
> "The history of a city is never straightforward, especially in a place as tumultuous as San Francisco, and that's what makes Eric Friedman's biography of William Leidesdorff so fascinating. In telling the story of a civic leader forced by society to hide his Black identity, Friedman captures the ever-shifting tensions of 1840s San Francisco and tells the tale with refreshingly urgent twenty-first-century prose."

*—John King, author of Portal and Cityscapes*

---

### Book Page — Section 4: Availability + Notify Me

Padding: 2.5rem 0. Border-bottom: 1px solid --rule.

Label (11px, uppercase, letter-spacing: 0.2em, color --ink-light):
`Availability`

Title (30px, Playfair Display):
`Coming Soon`

Body (15px, Source Serif 4 300, color --ink-mid):
> *The Ledger and the Mirror* will be available from major booksellers. Purchase links will appear here when the book is released.

**Notify Me button:**

Label: `Notify me when available`
Style: background --accent, color --parchment, 12px, uppercase, letter-spacing: 0.12em, padding: 0.6rem 1.4rem

**Email obfuscation — same String.fromCharCode Alpine.js pattern as the footer email link.** Subject line: `Notify me when The Ledger and the Mirror is available`

```javascript
function notifyBtn() {
  return {
    notify() {
      const u = 'eric';
      const d = 'walkwitheric' + String.fromCharCode(46) + 'com';
      const addr = u + String.fromCharCode(64) + d;
      const subj = encodeURIComponent('Notify me when The Ledger and the Mirror is available');
      window.location = 'mailto:' + addr + '?subject=' + subj;
    }
  }
}
```

```html
<div x-data="notifyBtn()">
  <button @click="notify()">Notify me when available</button>
</div>
```

---

### Book Page — Section 5: Author

Two-column grid: `160px 1fr`, gap: 2.5rem, align-items: start. Padding: 2.5rem 0. Border-bottom: 1px solid --rule.

**Left — author photo:**
`/images/eric.jpg` — full width of column, border: 3px solid --parchment-deep, filter: sepia(20%) contrast(0.95)

**Right — bio:**

Label (11px, uppercase, letter-spacing: 0.2em, color --ink-light):
`About the Author`

Body (15px, Source Serif 4 300, color --ink-mid, line-height 1.8):

> Eric Friedman is a Berkeley-based writer, artist, and independent researcher. For *The Ledger and the Mirror*, he worked extensively with archival records in California and Denmark, as well as later public commemorations and visual representations of the past.

> He is also a practicing painter and woodworker, and leads public walking tours in San Francisco on the Japanese Tea Garden, Japantown, maritime San Francisco, 1840s pre–Gold Rush San Francisco, and the city's recurring cycles of boom and bust. *The Ledger and the Mirror* is his first book.

**Mobile:** Stack to single column, photo max-width 120px centered above bio.

---

### Book Page — Section 6: Publisher

Centered. Padding: 2.5rem 0. Border-bottom: 1px solid --rule.

Komorebi Press logo: `/images/komorebi_logo.jpg`
Max-width: 120px, centered, filter: sepia(10%) contrast(0.9), margin-bottom: 0.75rem.

Text (12px, Source Serif 4, color --ink-light, italic, centered):
`Published by Komorebi Press, Berkeley, California`

---

### Book Page — Footer

Same as index footer:

**Left** (13px, italic, weight 300, color --ink-light):
> There's always another story around the corner. Come find it.

**Right — links:**
- [Walk With Eric](/) 
- [Instagram](https://instagram.com/ericofberkeley)
- Email — same obfuscation pattern

---

## Implementation Notes

### Eleventy

- `index.njk` → serves `/`
- `src/the-ledger-and-the-mirror/index.njk` → serves `/the-ledger-and-the-mirror/`
- Shared layout for common head, fonts, Tailwind, Alpine.js
- No other pages or collections needed

### Alpine.js

Used for:
1. iCal calendar feed on index (schedule banner)
2. Email obfuscation on index footer
3. Notify Me button on book page

Load Alpine from CDN or install via npm. Use `String.fromCharCode(64)` for `@` and `String.fromCharCode(46)` for `.` consistently — this is the same pattern used on justwood.design.

### Full-Bleed Elements

Use negative margins (`-mx-6` or equivalent) with inner padding to maintain readable line lengths. Applies to:
- Credentials strip (index)
- Book promo block (index)
- Blurbs block (book page)

### Links

- All "Nearby recommendations" links: new tab
- All SF City Guides links: new tab
- justwood.design: new tab
- Instagram: new tab
- Email: obfuscated mailto (Alpine.js)
- Internal links (`/the-ledger-and-the-mirror/`, `/`): same tab

### Accessibility

- All images have descriptive alt text (see image table above)
- Color contrast meets WCAG AA
- CTAs clearly labeled
- Semantic HTML throughout (h1, h2, h3, main, footer, nav)
- Button elements for interactive actions (not anchor tags with `#`)
