// One-time import of community data for AION 2 Codex.
// Sources: aion2-meta.com (Daevanion boards, skill/stigma/wings tables, icons)
//          daevaguides.com (class portraits)
// Politeness: sequential requests, ~150 ms delay, single pass, cached icons.
// Run: node scripts/scrape-meta.mjs

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';

const UA = 'Aion2CodexFanImport/1.0 (one-time import for a fan guide site)';
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const CLASSES = ['templar', 'gladiator', 'assassin', 'ranger', 'sorcerer', 'spiritmaster', 'cleric', 'chanter'];

function decode(s) {
  return String(s ?? '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function attr(tag, name) {
  const m = tag.match(new RegExp(`${name}="([\\s\\S]*?)"`));
  return m ? decode(m[1]) : undefined;
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'user-agent': UA } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

async function download(url, out) {
  if (existsSync(out)) return 'skip';
  const res = await fetch(url, { headers: { 'user-agent': UA } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  writeFileSync(out, Buffer.from(await res.arrayBuffer()));
  return 'ok';
}

// ---------- headings / section helpers ----------

function headings(html) {
  const out = [];
  for (const m of html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)) {
    out.push({ idx: m.index, text: decode(m[1]), raw: m[0] });
  }
  return out;
}

function section(html, headingText) {
  const hs = headings(html);
  const h = hs.find((x) => x.text === headingText || x.text.startsWith(headingText));
  if (!h) return null;
  const next = hs.find((x) => x.idx > h.idx);
  return { start: h.idx, end: next ? next.idx : html.length };
}

// ---------- span/chip/table parsers ----------

function parseInteractive(scope) {
  // .sk and .chip spans — tolerant to attribute order
  const out = [];
  const re = /<span class="(sk|chip)"[\s\S]*?<\/span>/g;
  let m;
  while ((m = re.exec(scope))) {
    const tag = m[0];
    const icon = (tag.match(/<img src="(\/icons\/[^"]+)"/) ?? [])[1] ?? null;
    const order = (tag.match(/<i[^>]*>(\d+)<\/i>/) ?? [])[1] ?? null;
    out.push({
      name: attr(tag, 'data-tip-title') ?? decode((tag.match(/>([^<]+)<\/span>$/) ?? [])[1] ?? ''),
      icon,
      order: order ? +order : null,
      meta: attr(tag, 'data-tip-meta') ?? null,
      tip: attr(tag, 'data-tip') ?? null,
      end: m.index + m[0].length,
    });
  }
  return out;
}

function barsIn(scope) {
  const out = [];
  const re = /<span class="bar([^"]*)" style="--w:([\d.]+%)"[^>]*>([^<]*)<\/span>/g;
  let m;
  while ((m = re.exec(scope))) {
    const cls = m[1];
    out.push({
      kind: cls.includes('pvp') ? 'pvp' : cls.includes('glob') ? 'global' : 'pve',
      value: decode(m[3]),
    });
  }
  return out;
}

function rowsWithSpans(scope) {
  const rows = [];
  const trRe = /<tr[\s\S]*?<\/tr>/g;
  let tr;
  while ((tr = trRe.exec(scope))) {
    const spans = parseInteractive(tr[0]);
    if (spans.length === 0) continue;
    const bars = barsIn(tr[0].slice(tr[0].indexOf('</span>') + 7));
    const row = { name: spans[0].name, icon: spans[0].icon, tip: spans[0].tip, meta: spans[0].meta };
    for (const b of bars) {
      if (b.kind === 'pve') row.pve ??= b.value;
      else if (b.kind === 'pvp') row.pvp ??= b.value;
      else if (b.kind === 'global') row.global ??= b.value;
    }
    rows.push(row);
  }
  return rows;
}

// ---------- daevanion boards ----------

function parseBoards(html) {
  const tabRe = /data-board="(\d)"[^>]*>\s*([A-Za-z]+)\s*<small[^>]*>\s*(\d+)\s*crystals/g;
  const tabMeta = [];
  let m;
  while ((m = tabRe.exec(html))) tabMeta.push({ idx: +m[1], name: m[2], total: +m[3] });

  const unlockRe = /This board opens at character level (\d+)\. Completing it takes (\d+) Daevanion Crystals/g;
  const unlocks = [];
  while ((m = unlockRe.exec(html))) unlocks.push({ level: +m[1], total: +m[2] });

  const steps = {};
  for (const sm of html.matchAll(/<h3[^>]*>First 12 nodes on (\w+)<\/h3>\s*<ol class="dv-steps"[^>]*>([\s\S]*?)<\/ol>/g)) {
    const items = [];
    for (const li of sm[2].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)) {
      const type = (li[1].match(/<b[^>]*>([\s\S]*?)<\/b>/) ?? [])[1];
      const gives = (li[1].match(/<span[^>]*>([\s\S]*?)<\/span>/) ?? [])[1];
      const cost = (li[1].match(/<em[^>]*>([\s\S]*?)<\/em>/) ?? [])[1];
      items.push({ type: decode(type), gives: decode(gives), cost: decode(cost) });
    }
    steps[sm[1]] = items;
  }

  const boards = [];
  for (const sm of html.matchAll(/<svg([^>]*aria-label="(\w+) board"[^>]*)>([\s\S]*?)<\/svg>/g)) {
    const name = sm[2];
    const viewBox = (sm[1].match(/viewBox="([^"]+)"/) ?? [])[1] ?? '0 0 528 528';
    const links = (sm[3].match(/<path class="links" d="([^"]+)"/) ?? [])[1] ?? '';
    const nodes = [];
    const gRe = /<g class="(n[^"]*)" transform="translate\((\d+) (\d+)\)" data-spent="(\d+)" data-tip="([\s\S]*?)" data-tip-title="([\s\S]*?)"(?:\s+data-tip-meta="([\s\S]*?)")?\s*>\s*<image href="(\/icons\/[^"]+)"/g;
    let g;
    while ((g = gRe.exec(sm[3]))) {
      const title = decode(g[6]);
      const orderMatch = title.match(/#(\d+)\s*·\s*(.*)/);
      const meta = g[7] ? decode(g[7]) : '';
      const costMatch = meta.match(/(\d+)\s*crystal/);
      const shareMatch = meta.match(/(\d+(?:\.\d+)?)% of top KR/);
      nodes.push({
        x: +g[2],
        y: +g[3],
        spent: +g[4],
        gives: decode(g[5]),
        order: orderMatch ? +orderMatch[1] : null,
        type: orderMatch ? decode(orderMatch[2]) : 'Start',
        icon: g[8],
        cost: costMatch ? +costMatch[1] : null,
        krShare: shareMatch ? `${shareMatch[1]}%` : null,
        variant: g[1].replace(/^n\s*/, '') || 'node',
      });
    }
    const tab = tabMeta.find((t) => t.name.toLowerCase() === name.toLowerCase());
    const unlock = tab ? (unlocks[tab.idx] ?? { level: null, total: tab.total }) : unlocks[boards.length];
    boards.push({
      name,
      unlockLevel: unlock?.level ?? null,
      totalCrystals: tab?.total ?? unlock?.total ?? null,
      viewBox,
      links,
      nodes,
      firstTwelve: steps[name] ?? [],
    });
  }
  return boards;
}

// ---------- meta build ----------

function parseMeta(html) {
  const sec = {
    activeSkills: section(html, 'Active skills'),
    specialties: section(html, 'Skill specialties'),
    passives: section(html, 'Passive skills'),
    stigmas: section(html, 'Stigma skills'),
    wings: section(html, 'Wings'),
    statPriority: section(html, 'Stat priority'),
    titles: section(html, 'Titles'),
    daevanion: section(html, 'Daevanion boards'),
  };

  const skillOrder = [];
  const ringSkills = [];
  const specialties = [];
  if (sec.activeSkills) {
    const scope = html.slice(sec.activeSkills.start, sec.activeSkills.end);
    const iOrder = scope.indexOf('Level in this order');
    const iRings = scope.indexOf('Look for these on your rings');
    if (iOrder >= 0 && iRings > iOrder) {
      for (const s of parseInteractive(scope.slice(iOrder, iRings))) skillOrder.push({ name: s.name, icon: s.icon, order: s.order, meta: s.meta });
    }
    if (iRings >= 0) {
      for (const s of parseInteractive(scope.slice(iRings))) ringSkills.push({ name: s.name, icon: s.icon });
    }
  }
  if (sec.specialties) {
    for (const s of parseInteractive(html.slice(sec.specialties.start, sec.specialties.end))) specialties.push({ name: s.name, icon: s.icon });
  }

  const passives = sec.passives ? rowsWithSpans(html.slice(sec.passives.start, sec.passives.end)) : [];
  const stigmas = sec.stigmas ? rowsWithSpans(html.slice(sec.stigmas.start, sec.stigmas.end)) : [];
  const wings = sec.wings ? rowsWithSpans(html.slice(sec.wings.start, sec.wings.end)) : [];
  const titles = sec.titles ? rowsWithSpans(html.slice(sec.titles.start, sec.titles.end)) : [];

  const statPriority = [];
  if (sec.statPriority) {
    const scope = html.slice(sec.statPriority.start, sec.statPriority.end);
    for (const slot of ['Weapons', 'Armor', 'Jewelry']) {
      const i = scope.indexOf(`>${slot}<`);
      if (i === -1) continue;
      const ends = ['Weapons', 'Armor', 'Jewelry'].map((s) => scope.indexOf(`>${s}<`, i + 1)).filter((x) => x > i);
      const end = ends.length ? Math.min(...ends) : scope.length;
      const raw = scope.slice(i, end).replace(/<[^>]*$/, ' ');
      statPriority.push({ slot, text: decode(raw.replace(/<[^>]*>/g, ' ')).replace(/^[>\s]+/, '') });
    }
  }

  return { skillOrder, ringSkills, specialties, passives, stigmas, wings, titles, statPriority };
}

function collectIcons(html, set) {
  for (const m of html.matchAll(/(?:src|href)="(\/icons\/[^"]+\.webp)"/g)) set.add(m[1]);
}

// ---------- main ----------

const iconSet = new Set();
const failures = [];

mkdirSync('data/daevanion', { recursive: true });
mkdirSync('data/meta', { recursive: true });
mkdirSync('public/icons', { recursive: true });
mkdirSync('public/portraits', { recursive: true });

for (const slug of CLASSES) {
  try {
    const html = await fetchText(`https://aion2-meta.com/guides/${slug}/`);
    const boards = parseBoards(html);
    const meta = parseMeta(html);
    collectIcons(html, iconSet);
    writeFileSync(
      `data/daevanion/${slug}.json`,
      JSON.stringify(
        {
          slug,
          source: 'aion2-meta.com — suggested unlock order from top KR players (AION2CAL); global boards',
          boards,
        },
        null,
        1,
      ),
    );
    writeFileSync(
      `data/meta/${slug}.json`,
      JSON.stringify(
        {
          slug,
          source: 'aion2-meta.com — KR top-player builds (AION2CAL) + NCSOFT official Global profiles',
          ...meta,
        },
        null,
        1,
      ),
    );
    console.log(
      `OK ${slug}: boards=${boards.length} nodes=${boards.reduce((a, b) => a + b.nodes.length, 0)} skills=${meta.skillOrder.length} specialties=${meta.specialties.length} stigmas=${meta.stigmas.length} wings=${meta.wings.length} titles=${meta.titles.length} statPr=${meta.statPriority.length}`,
    );
  } catch (e) {
    failures.push(`${slug}: ${e.message}`);
    console.error(`FAIL ${slug}: ${e.message}`);
  }
  await delay(150);
}

// Download icons
let iconOk = 0;
let iconFail = 0;
for (const path of [...iconSet].sort()) {
  try {
    const r = await download(`https://aion2-meta.com${path}`, `public${path}`);
    if (r === 'ok') iconOk++;
    await delay(120);
  } catch (e) {
    iconFail++;
    console.error(`ICON FAIL ${path}: ${e.message}`);
  }
}

// Class portraits from daevaguides
const portraitMap = {
  templar: 'templar',
  gladiator: 'gladiator',
  assassin: 'assassin',
  ranger: 'ranger',
  sorcerer: 'sorcerer',
  spiritmaster: 'elementalist',
  cleric: 'cleric',
  chanter: 'chanter',
};
let portraitsOk = 0;
for (const [slug, theirs] of Object.entries(portraitMap)) {
  try {
    const r = await download(`https://daevaguides.com/grafiki/klasy/${theirs}.webp`, `public/portraits/${slug}.webp`);
    if (r === 'ok') portraitsOk++;
    await delay(120);
  } catch (e) {
    console.error(`PORTRAIT FAIL ${slug}: ${e.message}`);
  }
}

console.log(`\nDone. icons ok=${iconOk} fail=${iconFail}; portraits ok=${portraitsOk}; class failures=${failures.length}`);
if (failures.length) {
  console.log(failures.join('\n'));
  process.exitCode = 1;
}
