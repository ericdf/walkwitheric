const https = require('https');
const fs = require('fs');
const path = require('path');

const ICAL_URL = process.env.ICAL_URL;
if (!ICAL_URL) { console.error('ICAL_URL env var not set'); process.exit(1); }

const TOUR_MAP = {
  'Japanese Tea Garden': 'japaneseteagarden',
  'Maritime SF': 'maritime',
  '1840s San Francisco and the Astonishing Legacy of America\'s "First Black Millionaire."': '1840s',
  'Japantown': 'japantown',
  'Boom and Bust': 'boomandbust',
};

const TOUR_LABELS = {
  maritime: 'Maritime SF',
  '1840s': '1840s San Francisco',
  japaneseteagarden: 'Japanese Tea Garden',
  japantown: 'Japantown',
  boomandbust: 'Boom and Bust',
};

const TOUR_URLS = {
  maritime: 'https://sfcityguides.org/tour/maritime-sf/',
  '1840s': 'https://sfcityguides.org/tour/1840s-san-francisco-and-the-astonishing-legacy-of-americas-first-black-millionaire/',
  japaneseteagarden: 'https://sfcityguides.org/tour/japanese-tea-garden/',
  japantown: 'https://sfcityguides.org/tour/japantown/',
  boomandbust: 'https://sfcityguides.org/tour/san-francisco-boom-bust/',
};

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function unfold(text) {
  return text.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '');
}

function parseDate(dtLine) {
  // dtLine is everything after the first colon: e.g. 20260510T090000 or 20260510T160000Z
  const m = dtLine.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})/);
  if (!m) return null;
  const [, yr, mo, dy, hr, mn] = m;
  if (dtLine.endsWith('Z')) {
    return new Date(Date.UTC(+yr, +mo - 1, +dy, +hr, +mn));
  }
  // TZID or floating — treat as local (TZ env var set to America/Los_Angeles in CI)
  return new Date(+yr, +mo - 1, +dy, +hr, +mn);
}

function formatDisplay(date) {
  const day = new Intl.DateTimeFormat('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    timeZone: 'America/Los_Angeles',
  }).format(date);
  const time = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric', minute: '2-digit',
    timeZone: 'America/Los_Angeles',
  }).format(date);
  return `${day} · ${time}`;
}

async function main() {
  const raw = await fetchUrl(ICAL_URL);
  const text = unfold(raw);

  const now = new Date();
  const cutoff = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

  const byTour = { maritime: [], '1840s': [], japaneseteagarden: [], japantown: [], boomandbust: [] };
  const allEvents = [];

  const blocks = text.split(/BEGIN:VEVENT/);
  blocks.shift();

  for (const block of blocks) {
    const lines = block.split(/\r?\n/);
    let summary = '';
    let dtstart = '';

    for (const line of lines) {
      if (line.startsWith('SUMMARY:')) summary = line.slice(8).trim();
      if (line.startsWith('DTSTART')) {
        const idx = line.indexOf(':');
        dtstart = line.slice(idx + 1).trim();
      }
    }

    const slug = TOUR_MAP[summary];
    if (!slug || !dtstart) continue;

    const date = parseDate(dtstart);
    if (!date || date < now || date > cutoff) continue;

    byTour[slug].push({ iso: date.toISOString(), display: formatDisplay(date) });
    allEvents.push({ iso: date.toISOString(), display: formatDisplay(date), slug, label: TOUR_LABELS[slug], url: TOUR_URLS[slug] });
  }

  // Sort and flatten
  for (const slug of Object.keys(byTour)) {
    byTour[slug].sort((a, b) => a.iso.localeCompare(b.iso));
    byTour[slug] = byTour[slug].map((e) => e.display);
  }

  allEvents.sort((a, b) => a.iso.localeCompare(b.iso));
  const all = allEvents.map((e) => ({ display: e.display, label: e.label, url: e.url, slug: e.slug, startISO: e.iso }));

  const schedule = { ...byTour, all, generated: new Date().toISOString() };

  const outPath = path.join(__dirname, '..', 'src', '_data', 'schedule.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(schedule, null, 2) + '\n');

  console.log(`Schedule written — ${all.length} total event(s)`);
  for (const [slug, dates] of Object.entries(byTour)) {
    if (dates.length) console.log(`  ${slug}: ${dates.length}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
