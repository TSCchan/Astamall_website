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
  const body = /text|xml/.test(res.headers.get('content-type') ?? '') ? await res.text() : '';
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

// 7. Phase 2: sitemap, canonicals, descriptions, headings, images and structured data
const site = 'https://www.astamall.com.my';
check(new RegExp(`^Sitemap: ${site}/sitemap.xml$`, 'm').test(robots.body), 'robots.txt points to the production sitemap');
const sitemap = await fetchPage('/sitemap.xml');
const locs = [...sitemap.body.matchAll(/<loc>([^<]*)<\/loc>/g)].map(m => m[1].replace(/&amp;/g, '&'));
check(sitemap.status === 200 && /^<\?xml/.test(sitemap.body) && /<urlset[^>]*sitemaps.org\/schemas\/sitemap\/0.9/.test(sitemap.body), `/sitemap.xml is a valid urlset (${locs.length} URLs)`);
check(locs.every(loc => loc === site || loc.startsWith(site + '/')), 'every sitemap URL is absolute on the production host');
check(new Set(locs).size === locs.length, 'no duplicate sitemap URLs');
check(!/changefreq|priority/.test(sitemap.body), 'no change frequency or priority claimed');

const canonicalOf = html => [...html.matchAll(/<link rel="canonical" href="([^"]*)"/g)].map(m => m[1].replace(/&amp;/g, '&'));
const descriptionOf = html => [...html.matchAll(/<meta name="description" content="([^"]*)"/g)].map(m => m[1].replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"'));
const sitemapProblems = [];
for (const loc of locs) {
  const path = loc.slice(site.length) || '/';
  const page = pages.get(path) ?? await fetchPage(path);
  if (page.status !== 200) sitemapProblems.push(`${path} ${page.status}`);
  else if (noindex(page)) sitemapProblems.push(`${path} noindex`);
  else if (canonicalOf(page.body)[0] !== loc) sitemapProblems.push(`${path} canonical ${canonicalOf(page.body)[0]}`);
}
check(sitemapProblems.length === 0, 'every sitemap URL responds 200, is indexable and is its own canonical' + (sitemapProblems.length ? `: ${sitemapProblems.join(', ')}` : ''));
const crawled = indexable.map(([path]) => path === '/' ? site : site + path);
const notInSitemap = crawled.filter(url => !locs.includes(url));
const notCrawled = locs.filter(url => !crawled.includes(url));
check(notInSitemap.length === 0, 'every indexable page found by crawling is in the sitemap' + (notInSitemap.length ? `: ${notInSitemap.join(', ')}` : ''));
check(notCrawled.length === 0, 'every sitemap page is reachable through internal links' + (notCrawled.length ? `: ${notCrawled.join(', ')}` : ''));

const descriptions = new Map();
const outlineProblems = [];
const altProblems = [];
for (const [path, page] of indexable) {
  const canon = canonicalOf(page.body), desc = descriptionOf(page.body);
  if (canon.length !== 1) check(false, `${path} has exactly one canonical (found ${canon.length})`);
  if (desc.length !== 1) check(false, `${path} has exactly one description (found ${desc.length})`);
  else {
    if (desc[0].length < 70 || desc[0].length > 165) check(false, `${path} description is ${desc[0].length} characters`);
    descriptions.set(desc[0], [...(descriptions.get(desc[0]) ?? []), path]);
  }
  const levels = [...page.body.replace(/<svg[\s\S]*?<\/svg>/g, '').matchAll(/<h([1-6])\b/g)].map(m => +m[1]);
  if (levels.filter(l => l === 1).length !== 1) outlineProblems.push(`${path}: ${levels.filter(l => l === 1).length} h1`);
  levels.forEach((l, i) => { if (i && l > levels[i - 1] + 1) outlineProblems.push(`${path}: h${levels[i - 1]} -> h${l}`); });
  for (const [, tag] of page.body.matchAll(/(<img\b[^>]*>)/g)) if (!/\salt="/.test(tag)) altProblems.push(`${path}: ${tag.slice(0, 80)}`);
}
const duplicateDescriptions = [...descriptions].filter(([, paths]) => paths.length > 1);
check(duplicateDescriptions.length === 0, `${descriptions.size} unique descriptions` + (duplicateDescriptions.length ? `: ${duplicateDescriptions.map(([, p]) => p.join(' = ')).join('; ')}` : ''));
check(outlineProblems.length === 0, 'one h1 per page and no skipped heading levels' + (outlineProblems.length ? `: ${[...new Set(outlineProblems)].slice(0, 6).join(', ')}` : ''));
check(altProblems.length === 0, 'every image has an alt attribute' + (altProblems.length ? `: ${altProblems.slice(0, 3).join(', ')}` : ''));

const tracked = await fetchPage('/shop?utm_source=instagram&utm_medium=social');
check(canonicalOf(tracked.body)[0] === `${site}/shop`, `tracking parameters canonicalise to the clean URL (${canonicalOf(tracked.body)[0]})`);
const filtered = await fetchPage('/shop?category=Skincare&utm_source=newsletter');
check(canonicalOf(filtered.body)[0] === `${site}/shop?category=Skincare`, `a category view keeps its category in the canonical (${canonicalOf(filtered.body)[0]})`);
const shared = await fetchPage('/contact?utm_source=instagram');
check(!noindex(shared) && canonicalOf(shared.body)[0] === `${site}/contact`, 'a tracked contact link stays indexable and canonicalises to /contact');

// structured data: valid JSON, the right types in the right places, nothing promised that is not there
const jsonld = html => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
const typesOf = blocks => blocks.flatMap(b => (b['@graph'] ?? [b]).map(n => n['@type']));
let parseErrors = 0;
const typesAt = {};
for (const [path, page] of indexable) {
  try { typesAt[path] = typesOf(jsonld(page.body)); } catch { parseErrors++; }
}
check(parseErrors === 0, 'all JSON-LD blocks parse');
const home = jsonld(pages.get('/').body).flatMap(b => b['@graph'] ?? [b]);
const org = home.find(n => n['@type'] === 'Organization');
check(!!org && org.name === 'ASTAMALL' && org.legalName === 'ASTA MALL PLT' && org.url === `${site}/` && org.logo?.url?.startsWith(site), 'home page: Organization with name, legal name, URL and logo');
check(home.some(n => n['@type'] === 'WebSite' && !n.potentialAction), 'home page: WebSite, without a search action');
const lipstick = typesAt['/shop/asta-s-glow-lipstick'] ?? [];
check(lipstick.includes('BreadcrumbList'), 'product page: BreadcrumbList');
check(!Object.values(typesAt).flat().some(t => t === 'Product' || t === 'ProductGroup' || t === 'Offer'), 'no Product or Offer markup while prices are to be confirmed');
check((typesAt['/journal/why-we-started-with-astaxanthin'] ?? []).includes('BlogPosting'), 'journal article: BlogPosting');
check((typesAt['/faq'] ?? []).includes('FAQPage'), 'FAQ page: FAQPage');
const duplicateTypes = Object.entries(typesAt).filter(([, types]) => new Set(types).size !== types.length);
check(duplicateTypes.length === 0, 'no page repeats a structured data type' + (duplicateTypes.length ? `: ${duplicateTypes.map(([p]) => p).join(', ')}` : ''));
const crumbs = jsonld(pages.get('/shop/asta-s-glow-lipstick').body).flatMap(b => b['@graph'] ?? [b]).find(n => n['@type'] === 'BreadcrumbList');
const crumbUrls = crumbs.itemListElement.map(item => item.item);
const crumbProblems = [];
for (const url of crumbUrls) { const page = await fetchPage(url.slice(site.length)); if (page.status !== 200) crumbProblems.push(`${url} ${page.status}`); }
check(crumbProblems.length === 0, `breadcrumb links resolve (${crumbUrls.map(u => u.slice(site.length) || '/').join(' > ')})`);

console.log(failures ? `\n${failures} check(s) failed` : '\nAll SEO checks passed');
process.exit(failures ? 1 : 0);
