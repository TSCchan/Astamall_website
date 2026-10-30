#!/usr/bin/env node
// SEO foundation checks against a running build: robots.txt, titles, indexing directives, redirects and links.
// Usage: npm run build && npm start, then in another shell: npm run test:seo [-- http://localhost:3000]
// No dependencies; exits with status 1 if any check fails.

const base = (process.argv[2] || process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
let failures = 0;
const check = (ok, message) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${message}`);
  if (!ok) failures++;
};

const fetchPage = async path => {
  const res = await fetch(base + path, { redirect: 'manual' });
  const body = res.headers.get('content-type')?.includes('text') ? await res.text() : '';
  return { status: res.status, location: res.headers.get('location'), robotsHeader: res.headers.get('x-robots-tag') ?? '', body };
};
const titlesOf = html => [...html.replace(/<svg[\s\S]*?<\/svg>/g, '').matchAll(/<title>([^<]*)<\/title>/g)].map(m => m[1].replace(/&amp;/g, '&'));
const robotsOf = html => [...html.matchAll(/<meta name="robots" content="([^"]*)"/g)].map(m => m[1]).join(',');
const noindex = page => /noindex/.test(robotsOf(page.body) + page.robotsHeader);

// 1. robots.txt (production build)
const robots = await fetchPage('/robots.txt');
check(robots.status === 200, `/robots.txt responds 200 (${robots.status})`);
check(/User-Agent: \*/i.test(robots.body) && /Allow: \/\s*$/m.test(robots.body), '/robots.txt allows the whole site');
check(!/^Disallow: \/\s*$/m.test(robots.body), '/robots.txt does not block the site (production build)');

// 2. crawl every internal page linked from the homepage
const pages = new Map();
const queue = ['/'];
const fragments = [];
while (queue.length) {
  const path = queue.shift();
  if (pages.has(path)) continue;
  const page = await fetchPage(path);
  pages.set(path, page);
  if (page.status !== 200 || !page.body) continue;
  for (const [, href] of page.body.matchAll(/<a\b[^>]*\shref="([^"]*)"/g)) {
    const url = new URL(href.replace(/&amp;/g, '&'), base + path);
    if (url.origin !== base || /\.(png|jpe?g|webp|svg|gif|pdf)$/i.test(url.pathname)) continue;
    if (url.hash) fragments.push({ from: path, target: url.pathname + url.search, id: decodeURIComponent(url.hash.slice(1)) });
    queue.push(url.pathname + url.search);
  }
}
const broken = [...pages].filter(([, p]) => p.status >= 400);
check(broken.length === 0, `${pages.size} internal pages crawled, none broken` + (broken.length ? `: ${broken.map(([u, p]) => `${u} ${p.status}`).join(', ')}` : ''));
const missingAnchors = fragments.filter(f => pages.get(f.target)?.status === 200 && !new RegExp(`\\sid="${f.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`).test(pages.get(f.target).body));
check(missingAnchors.length === 0, `${fragments.length} in-page links point at existing anchors` + (missingAnchors.length ? `: ${missingAnchors.map(f => `${f.from} -> ${f.target}#${f.id}`).join(', ')}` : ''));

// 3. titles and indexing of the crawlable pages
const indexable = [...pages].filter(([, p]) => p.status === 200 && p.body && !noindex(p));
const titleCount = new Map();
for (const [path, page] of indexable) {
  const titles = titlesOf(page.body);
  if (titles.length !== 1 || !titles[0].trim()) check(false, `${path} has exactly one non-empty title (found ${titles.length})`);
  else titleCount.set(titles[0], [...(titleCount.get(titles[0]) ?? []), path]);
  const title = titles[0] ?? '';
  if (title.length > 60) check(false, `${path} title is ${title.length} characters: ${title}`);
  if (!/ASTAMALL/.test(title)) check(false, `${path} title names ASTAMALL: ${title}`);
}
const duplicates = [...titleCount].filter(([, paths]) => paths.length > 1);
check(duplicates.length === 0, `${indexable.length} indexable pages have unique titles` + (duplicates.length ? `: ${duplicates.map(([t, p]) => `"${t}" on ${p.join(', ')}`).join('; ')}` : ''));

const expectedTitles = {
  '/': 'ASTAMALL Malaysia | Taiwanese Skincare, Lipstick & Beauty',
  '/shop': 'Shop Skincare, Beauty & Wellness Malaysia | ASTAMALL',
  '/about': 'About ASTAMALL | Our Brand & Beauty Philosophy',
  '/faq': 'Frequently Asked Questions | ASTAMALL',
  '/contact': 'Contact ASTAMALL Malaysia',
  '/shop/asta-s-glow-lipstick': 'Asta-S Glow Lipstick | ASTAMALL Malaysia',
};
for (const [path, expected] of Object.entries(expectedTitles)) {
  const page = pages.get(path) ?? await fetchPage(path);
  check(titlesOf(page.body)[0] === expected, `${path} title is "${expected}" (got "${titlesOf(page.body)[0]}")`);
}

// 4. public pages indexable, private and utility pages not
for (const path of ['/', '/shop', '/shop/asta-s-glow-lipstick', '/about', '/faq', '/contact', '/journal', '/ingredients', '/astaxanthin', '/privacy-policy', '/shipping-returns', '/terms']) {
  const page = pages.get(path) ?? await fetchPage(path);
  check(page.status === 200 && !noindex(page), `${path} is indexable`);
}
for (const path of ['/cart', '/checkout', '/order-confirmation']) {
  const page = await fetchPage(path);
  check(/noindex/.test(robotsOf(page.body)), `${path} is noindex (${robotsOf(page.body)})`);
}
const enquiry = await fetchPage('/contact?product=Asta-S+Glow+Lipstick&option=NLC02+Saturn+Nude&quantity=1');
check(robotsOf(enquiry.body) === 'noindex, follow', `pre-filled enquiry form is noindex, follow (${robotsOf(enquiry.body)})`);
const missing = await fetchPage('/this-page-does-not-exist');
check(missing.status === 404 && noindex(missing), 'unknown pages return 404 with noindex');

// 5. permanent redirects for moved pages
for (const [from, to] of [['/brand-story', '/about#journey'], ['/privacy', '/privacy-policy'], ['/shipping', '/shipping-returns'], ['/returns', '/shipping-returns']]) {
  const page = await fetchPage(from);
  check(page.status === 308 && page.location?.endsWith(to), `${from} redirects permanently to ${to} (${page.status} ${page.location})`);
}

// 6. Google Search Console verification file
const verification = await fetchPage('/google9409f2a807c1b58a.html');
check(verification.status === 200 && verification.body.trim() === 'google-site-verification: google9409f2a807c1b58a.html', 'Search Console verification file is served unchanged');

console.log(failures ? `\n${failures} check(s) failed` : '\nAll SEO checks passed');
process.exit(failures ? 1 : 0);
