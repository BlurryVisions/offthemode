## Always-On · Being Found

> **Output:** the Found by line in `.offthemode/PRODUCT.md` (where the product should be found: web search, AI answers, app stores, or nowhere), with its reason in `.offthemode/DECISIONS.md`; the words people type, in the People search with column of `.offthemode/GLOSSARY.md` §Terms; a Found column in `.offthemode/ROUTES.md` (yes, noindex or login) that the sitemap is generated from; a `robots.txt` that carries the AI-crawler choice recorded in DECISIONS.md; store listings written for store search when there is a mobile app; and a passed Being Found Audit before launch.

<!-- offthemode:rules -->
### Working rules (for a change inside an existing product)
- Read the Found by line in PRODUCT.md first. If there is none and the change touches a public page, a store listing or robots.txt, ask where the product should be found, with your recommended answer, before changing it.
- A page meant to be found sends its words, links, title, description, canonical URL and share tags in the first HTML the server returns (rendered on the server or prebuilt), never only after JavaScript runs in the browser.
- A new page meant to be found gets one canonical URL, a ROUTES.md row with Found set to yes, a place in the generated sitemap, and a link from at least one other page in words that say what is there. A moved page gets one permanent redirect straight to its new address.
- A page that should stay out of search gets noindex and is not blocked in robots.txt, so the tag can be read; anything private stays behind its login. robots.txt never hides a page.
- Titles, descriptions, headings, alt text and store fields use the words people type (GLOSSARY.md §Terms, People search with) and say truthfully what is there. Structured data says only what the page shows.
- No ranking promises and no tricks aimed at search engines or AI answers (stuffed keywords, a page per search phrase, bought links). Report what Search Console and Bing Webmaster Tools show.
- Open the whole guide to decide where the product should be found, to change robots.txt or the AI-crawler choice, to write a store listing, before a launch, or to run the Being Found Audit.
<!-- /offthemode:rules -->

Being found is usually left to a checklist in the week before launch. By then the choices that decide it are made: how pages are rendered (P4), what their addresses are (P5), and which words the product uses (P1, Words & Voice). So this guide runs as a thread through the method, and the Being Found Audit at the end checks what the thread built. It also reaches past search engines: to the answers AI assistants give, to the app stores, and to products that should not be found at all.

A few words, once. A crawler is a program that fetches pages for a search engine or an AI company. `robots.txt` is a file at the root of a site that tells crawlers which paths they may fetch. noindex is a tag or header that asks search engines to leave a page out of their results. A canonical URL is the one address you want shown for a page that can be reached at several. Structured data is a block of labelled facts in a page's code, such as a product's price, that search engines can read. Grounding is an AI answer looking things up on the web and citing what it finds. A token is the name a crawler answers to in robots.txt.

> **Rule:** Nobody can promise a ranking, and Google says so itself. Make the product easy to find, read and trust, then measure what happens. A promise of first place by Friday is a sign the advice is wrong.

### Decide first: where should it be found?

P1 decides this, because it changes the build. Write it in PRODUCT.md's Found by line (§Person, job, moment) with its evidence, and its reason in DECISIONS.md.

| Where | What it means | What it changes in the build |
|---|---|---|
| Web search (Google, Bing) | Strangers find it by typing what they need | Public pages rendered on the server or prebuilt, real addresses, a sitemap, titles in the searcher's words |
| AI answers (ChatGPT, Claude, Perplexity, Copilot, Google's AI Overviews and AI Mode) | Someone asks a question, and the answer quotes or links the product | Everything web search needs, plus a choice per AI crawler in robots.txt |
| App stores (App Store, Google Play) | People search the store | Store fields written for store search; links that open the app when it is installed and the web page when it isn't |
| Nowhere (an internal tool, a logged-in app, previews and staging) | Only people with the link or a login reach it | noindex or a login on everything; unlisted or private distribution for an app |

Most products mix these: a public site meant to be found, and an app behind a login that isn't. ROUTES.md marks each route. For a mobile app, decide before the first upload: a private app on Google Play reaches only the organizations you list, and making it public later needs a new package name.

### The words people type

GLOSSARY.md §Terms holds one word per concept, the one the product uses. People looking for the product may type other words: "bill" where the product says "invoice". Collect their words from real people (the Five-Person Test notes record the words people use for your nouns, and so do support messages and interviews), and write them in GLOSSARY.md §Terms, in the People search with column beside the term they mean. They never go under Never call it, which keeps a word out of everything people read. The interface keeps its one word. The searcher's words go where people search: page titles, descriptions, headings, link text, alt text and store fields, wherever they are true and read naturally. Stuffing them in works against you: Google may treat stuffed alt text as spam, and Google Play may suspend an app for repeated or irrelevant keywords.

### Pages that must be found (P4)

Render them on the server or prebuild them, so the first HTML the server sends already holds the words, links and tags. Google does run JavaScript, but rendering can wait in a queue, and Google still recommends server-side rendering or prerendering, because it is faster and not every crawler runs JavaScript. Bing asks sites not to hide important content behind rendering in the browser, Apple's Messages link previews run no JavaScript at all, and Common Crawl says its crawler doesn't either. I think the AI companies' crawlers read only the first HTML too, because none of them documents running JavaScript; complete first HTML makes the answer not matter.

- Give crawlers and people the same page. Serving crawlers a separate prerendered copy was a workaround that Google no longer recommends.
- Only pages that answer 200 (OK) get rendered. A noindex in the first HTML may stop rendering, so JavaScript that removes it later may never run for the crawler.
- Google indexes the mobile version of a page, so the phone layout carries the same words, links and tags.
- Google reads only the first 2 MB of each HTML, CSS and JavaScript file (before compression), so what matters comes early.
- Never block, in robots.txt or at the host, the CSS and JavaScript a page needs to render.

Speed counts, but relevance counts more. Google's ranking systems use Core Web Vitals, yet no single page-experience signal decides a rank, good scores guarantee nothing, and a more relevant page still wins with a poorer experience. A product that needs search traffic may hold Google's published thresholds as lcp_ms, inp_ms and cls in RULES.md §Budgets (Accessibility & Performance Budgets lists them); Off the Mode sets none for you.

### Addresses, sitemap and links (P5)

- **Real addresses.** Every page meant to be found has its own URL, set with the History API, never a `#fragment`. Google follows only `<a>` elements with an `href`, so links are real links, not click handlers.
- **One canonical URL per page.** Absolute (with https:// and the domain), in the first HTML, never changed by JavaScript. It is a strong hint, not an order: Google may choose another. Never use robots.txt or noindex to handle duplicates. The same content at two addresses wastes crawling; it is not penalized.
- **The sitemap.** Generated at build time from the ROUTES.md rows with Found set to yes: absolute canonical URLs, a lastmod only if it is always accurate, and no priority or changefreq, which Google ignores. It helps discovery and guarantees nothing; a well-linked site of about 500 pages or fewer may not need one. One file holds up to 50,000 URLs or 50 MB. Name it in robots.txt with a `Sitemap:` line and submit it in Search Console; the old ping address is gone.
- **Links.** Every page you care about gets a link from at least one other page, with link text that says what is there. Breadcrumbs help people find their way; Google still reads breadcrumb markup, but since January 2025 shows it on desktop results only.
- **Moves.** A page that moves gets one permanent redirect, done on the server, straight to the final address, and internal links point at the final address. Chains slow crawling; JavaScript redirects are a last resort.
- **Missing pages.** A page that is gone returns a real 404, and that is normal. The problem is a soft 404: a page that answers 200 but says "not found" or shows nothing. In a single-page app, send a missing page to a real 404 address or add noindex.
- **IndexNow.** Bing and the other engines that take part (Naver, Seznam.cz, Yandex, Yep) share one ping for each added, changed or removed page; a key file on the site proves it is yours. Bing asks for it alongside the sitemap.

### Titles, descriptions and structured data

Words & Voice sets the voice; this is where those words show up.

- **Titles.** Google writes the title in its results itself, from the page's `<title>`, its main heading, og:title, the text of links to it and more. Give each page a unique, descriptive, concise `<title>` that names what is there in the searcher's words (never "Home | X"). There is no length limit.
- **Descriptions.** The snippet under the title comes mostly from the page's own text; Google uses the meta description only sometimes. Write one per page anyway, unique, saying what the page holds.
- **Headings.** Google has no ideal number of headings, and their order doesn't matter to Search; it does matter to screen readers. Make the main title the one that stands out. There is no preferred word count, and Google ignores the keywords meta tag.
- **Structured data.** Only what the page visibly shows, and only types Google still documents for a rich result (a richer listing, such as stars or a price). Generate it from the same data and query that render the page (P4), so the two can never disagree. HowTo results ended in 2023 and FAQ results in May 2026, and AI features need no special markup.

### Images and share previews

- **Alt text** describes the image in plain words. Google reads it together with what it sees in the image, it is the link text when the image is a link, and it is what a screen reader says.
- **Formats.** I think format is a speed choice, not a search rule, because no Google page we checked asks for WebP; measure it against the product's own budgets. Store screenshots stay JPEG or PNG: neither store takes WebP for them.
- **Share previews.** When someone pastes a link into a chat or a post, the app builds the card from the page's Open Graph tags. The four required ones are og:title, og:type, og:image and og:url (the canonical URL); add og:description, og:site_name, and og:image:alt for every image. One image at 1200 x 630 meets Meta's, LinkedIn's and Apple Messages' guidance. Apple asks for no text in the image, and for the site name in og:site_name, not in the title.
- Messages previews run no JavaScript and follow no meta redirects, so the tags must be in the HTML the server sends. A page behind a login still needs useful tags: a plain title and the product's image, never private data. Landing as Demo (P8) generates the image per page from the design tokens and real data.

### AI answers and AI crawlers

Being quoted in an AI answer starts where being found in search does. Google's AI Overviews and AI Mode are built on the Search index: a page needs to be indexed and allowed to show a snippet, nothing more, and Google says optimizing for them is still SEO. Bing's search, Copilot and its grounding service share one crawl and one index. ChatGPT and Claude each run a search crawler you can allow apart from their training crawler; Perplexity's crawler is not used for training. So the choice is per company and per use. Write it in DECISIONS.md, then in robots.txt.

| Company | Crawler for search and answers | For model training | Fetches when a person asks |
|---|---|---|---|
| Google | Googlebot: Search, AI Overviews, AI Mode | Google-Extended, a robots.txt token only: Gemini training, and grounding answers in the Gemini apps and Vertex AI; no effect on Search | User-triggered fetchers, which generally ignore robots.txt |
| OpenAI | OAI-SearchBot: ChatGPT search answers | GPTBot | ChatGPT-User; robots.txt may not apply |
| Anthropic | Claude-SearchBot: Claude's search answers | ClaudeBot | Claude-User, which follows robots.txt |
| Perplexity | PerplexityBot, not used for training | none | Perplexity-User: its crawler page says it generally ignores robots.txt; its help center (September 2026) says summarizing blocked pages on request was turned off |
| Apple | Applebot (follows Googlebot's rules when it has none of its own) | Applebot-Extended, a token only: whether Applebot's data trains Apple's models; search is unaffected | — |
| Common Crawl | — | CCBot, an open crawl archive; its own pages don't say whether it trains AI models | — |

A change reaches OpenAI and Perplexity within about a day. Each subdomain serves its own robots.txt; Anthropic asks for the rule on every one. Hosts add their own switches on top: Vercel's AI Bots rule, set to Deny, blocks training, search and person-asks crawlers alike. Google asks for crawling to be allowed at the host too, and OpenAI asks sites to allow its published IP addresses, so check that the host's bot protection says the same thing as robots.txt.

This file shows one choice: found and quoted, but not used for training. It also leaves out grounding in the Gemini apps, because Google-Extended covers both.

```file path="robots.txt"
# Served at /robots.txt on each host and subdomain. The choice and its reason: .offthemode/DECISIONS.md D-{{NNN}}.
# This version: found in search and quoted in AI answers, not used to train AI models.
# Search and answer crawlers (Googlebot, Bing's crawler, Applebot, OAI-SearchBot, Claude-SearchBot, PerplexityBot) fall under * and are allowed.
User-agent: *
Allow: /

# Training. Each token is separate from its company's search crawler.
# Google-Extended also covers grounding in the Gemini apps; Google Search, AI Overviews and AI Mode are unaffected.
User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: Applebot-Extended
Disallow: /

# Common Crawl's own pages don't say whether its open archive trains AI models, so this group is a judgment call.
User-agent: CCBot
Disallow: /

Sitemap: https://{{DOMAIN}}/sitemap.xml
```

Some controls change what AI answers show without leaving search:
- **Google:** nosnippet, data-nosnippet (on part of a page) and max-snippet limit what AI Overviews and AI Mode show, and noindex removes the page. A Search Console setting (worldwide since 31 August 2026) takes a whole site out of AI Overviews, AI Mode and Discover's AI features without touching the rest of Search; it takes a few days.
- **Bing:** NOARCHIVE keeps content out of Copilot answers and grounding, NOCACHE limits Copilot to the URL, title and snippet, and NOINDEX keeps a page out of all of them.
- **Apple:** nosnippet keeps content out of the world-knowledge answers in Siri and Search.

What makes a page worth quoting is what makes it worth finding. Google lists splitting content into chunks, rewriting it for AI and chasing every variant of a question as things you don't need. Its spam policies now cover attempts to manipulate AI answers, and a page per variant of a query, made for that, is scaled content abuse. What works instead: original, accurate content in plain sentences in the first HTML, a real byline where readers expect one, and facts checked, including anything an AI wrote.

AI agents that act in a browser read the screenshot, the page's structure and its accessibility tree, and ChatGPT's agent reads the roles and labels screen readers use. The accessibility work the product already does (real buttons, named controls) makes it usable by agents too.

llms.txt is a proposed markdown file that points AI agents to a site's key pages. Google Search ignores it: no help, no harm. Lighthouse's experimental agent audit checks the file when there is one and counts a missing one as not applicable. Add one when agents are a real audience, such as developer docs. I think it does little for AI answers today, because none of the AI companies says its assistants read other sites' llms.txt; check before counting on it.

### App stores (mobile)

The store listing is a page people search, so its words come from GLOSSARY.md like any page title, and its screenshots come from the real app on the demo seed in moment-of-value order (P8). What each store says about search, checked in October 2026; the stores change these, so check each one again before a listing goes live:

| | App Store | Google Play |
|---|---|---|
| Text search matches | App name, subtitle, keyword field, primary and secondary category; the app is also found by its name and the company's name | Listing text; Play names the title, icon and developer name as especially helpful, and asks for search best practice in the full description |
| Text limits | Name 2 to 30 characters, subtitle 30, keywords 100 bytes (commas, no spaces), promotional text 170, description 4000 | Title 30, short description 80, full description 4000; no keyword field |
| Doesn't help search | Promotional text; the description (it feeds web search results after release); repeating the name, subtitle, company or category words in keywords; plurals of words already used | Extra keywords in the short description; repeated or irrelevant keywords can get the app suspended |
| Ranking also weighs | Downloads, ratings and reviews | Ratings, reviews, downloads and more; Play advises regular updates and replies to users |
| Art | 1 to 10 screenshots per device size, JPEG or PNG; the first 1 to 3 show in search results when there is no preview video | Icon 512 x 512 PNG; a 1024 x 500 feature graphic (required); 2 to 8 screenshots per device type, JPEG or PNG |
| A page per audience | Up to 70 custom product pages, each with its own URL, and keywords that can show it in search | Up to 50 custom store listings, targeted by country, search keywords and more |
| Tests | Up to 3 versions of the icon, screenshots and previews (not the text), one test at a time | Store listing experiments on graphics, or on localized text |
| Never allowed | Competitor names in keywords; unverifiable "#1" claims in In-App Events | "#1", "Best", "Top", prices and "download now" in the listing |
| Not meant to be found | Unlisted distribution: out of search, charts and categories, opened only by direct link | Private apps, reaching only the organizations you list through managed Google Play |

Ratings move rank in both stores. Ask after the moment of value, never at first launch; Apple's system prompt can ask at most 3 times in 365 days. Apple's search results can also show app tags that AI writes from your listing's metadata, one more reason every word there must be accurate.

One address for both: universal links (Apple) and App Links (Android) let a single HTTPS URL open the app when it is installed and the web page when it isn't. Each needs a file under `/.well-known/` (`apple-app-site-association`, `assetlinks.json`), served over HTTPS with no redirect; Apple's is needed on every subdomain, and Android's is served as `application/json`. A Smart App Banner (the `apple-itunes-app` meta tag) on the website opens the app, or its store page if it isn't installed. I think content inside an app can be found by web search or AI answers only when its URL also serves a real web page, because crawlers read pages, not apps; shared addresses make that true.

### Keeping things out

- Logged-in pages aren't crawled. What must stay private stays behind the login, because the crawlers that fetch a page when a person asks (ChatGPT-User, Perplexity-User and Google's user-triggered fetchers) may ignore robots.txt.
- A public page that should stay out of results gets noindex, as a meta tag or an `X-Robots-Tag` header, and is not blocked in robots.txt. A blocked page's noindex is never read, and its address can still appear through links to it. OpenAI gives the same advice for ChatGPT Atlas, and Perplexity may still show a blocked page's domain, headline and a short summary.
- Preview deployments and staging get a noindex header or a login.
- Apps not meant to be found use Apple's unlisted distribution or a private app on managed Google Play (see the table above).

### Measuring, not promising

- **Search Console** (Google) and **Bing Webmaster Tools** are where results are measured. Neither is needed to be found, but a sitemap submitted in Search Console may speed up discovery. Search Console shows which pages are indexed and why others aren't (Page indexing, URL Inspection), Core Web Vitals, and traffic in the Performance report, which counts AI Overviews and AI Mode too; its Generative AI performance report shows AI impressions for every site since 31 August 2026. Bing's AI Performance report (a preview since February 2026) shows citations in Copilot and Bing's AI summaries.
- ChatGPT adds `utm_source=chatgpt.com` to the links it sends; count those visits through the tracking plan (Instrumentation).
- Third-party SEO tools have no access to Google's ranking data, and Google approves none of them. Read their numbers as hints, never as proof.
- Judge a change after a few weeks, not days: recrawling takes from days to months.
- I think being in Bing's index helps ChatGPT find pages, because ChatGPT search sends rewritten queries to outside search providers and OpenAI names Bing for its Enterprise and Edu plans. OpenAI names OAI-SearchBot as the control, so verify the site in Bing Webmaster Tools for Bing's own sake, and treat any effect on ChatGPT as a hypothesis.

### The popular checklist, checked

A search checklist that circulates in short videos, taken the way this method takes every suggestion: to heart, never as a script. Each item is kept for what makes it work, checked against the official source (October 2026), and changed or dropped where the source disagrees. Then the guide goes further than the list: deciding where to be found before building, the words people type, AI answers and the crawler choice, app stores, keeping private things out, and measuring instead of promising.

| The checklist says | Verdict | What holds up, and the better version | Source |
|---|---|---|---|
| Render it server-side | Keep | For pages meant to be found: rendering can queue, not every crawler runs JavaScript, and Bing asks for it | [Google](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [Bing](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a) |
| Generate sitemap.xml | Keep, from ROUTES.md | Absolute canonical URLs of the found routes, an honest lastmod or none; it helps discovery and guarantees nothing | [Google](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) |
| Submit to Search Console | Keep, for measuring | Optional, since pages are found without it; a sitemap there may speed discovery, and the old ping is gone. Add Bing Webmaster Tools | [Google](https://developers.google.com/search/docs/monitor-debug/search-console-start), [Google](https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping) |
| Unblock Googlebot | Keep, wider | Check robots.txt and the host's bot protection, keep the CSS and JavaScript pages need open, then choose per AI crawler | [Google](https://developers.google.com/search/docs/appearance/ai-features) |
| No noindex tags | Change | None on pages meant to be found; noindex is the right tool for pages that should stay out, as long as robots.txt doesn't block them | [Google](https://developers.google.com/search/docs/crawling-indexing/block-indexing) |
| No redirect chains | Keep | One permanent server-side redirect straight to the final address, and links that point there | [Google](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes) |
| No 404s | Change | A removed page should return 404, which is normal; fix soft 404s, and give moved pages a permanent redirect | [Search Console Help](https://support.google.com/webmasters/answer/7440203) |
| Canonical tags | Keep, as a hint | Absolute, in the first HTML, never changed by JavaScript; Google may choose another, and duplicates aren't penalized | [Google](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) |
| Meta descriptions | Keep, expect less | Google uses them only sometimes, since snippets come mostly from the page's own text; unique per page | [Google](https://developers.google.com/search/docs/appearance/snippet) |
| One H1 per page | Drop as a rule | Search has no ideal number of headings; make the main title stand out, and keep heading order for screen readers | [Google](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) |
| FAQ schema | Drop | FAQ results stopped showing in May 2026; mark up only what the page shows, with types Google still documents | [Google](https://developers.google.com/search/updates) |
| Breadcrumbs | Keep, for people | The markup is still read, but shown on desktop results only since January 2025 | [Google](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb) |
| Link orphan pages | Keep | Every page you care about is linked from another, in words that say what is there | [Google](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) |
| Alt text on images | Keep | Describe the image; stuffed keywords may count as spam | [Google](https://developers.google.com/search/docs/appearance/google-images) |
| Images to WebP | Change | I think this is a speed choice, not a search rule, because no Google page we checked asks for it; store screenshots must be JPEG or PNG | [Apple](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications), [Google Play](https://support.google.com/googleplay/android-developer/answer/9866151) |
| Fix layout shift | Keep, by choice | Layout shift (CLS) is a Core Web Vital that ranking systems use, but relevance wins; hold cls in §Budgets if search traffic matters | [Google](https://developers.google.com/search/docs/appearance/core-web-vitals), [Google](https://developers.google.com/search/docs/appearance/page-experience) |
| Load under 2s | Change | Google publishes no 2-second target; its nearest line is the main content within 2.5 s for 75% of page loads (the lcp_ms key, by choice) | [web.dev](https://web.dev/articles/vitals) |
| No AI content | Drop | Allowed; what breaks the rules is pages made in bulk to game rankings, however they are made. Fact-check what an AI writes | [Google](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content) |
| Author bio | Keep, where readers expect one | An accurate byline linking to the author's background; never an invented profile or an AI headshot | [Google](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) |
| Backlink from Forbes | Drop | Paid links that pass ranking credit are link spam, and borrowing a big site's reputation for your pages is site reputation abuse; be worth citing instead | [Google](https://developers.google.com/search/docs/essentials/spam-policies) |
| "Rank #1 by Friday" | Drop | No one can guarantee a top ranking; judge a change after a few weeks | [Google](https://developers.google.com/search/docs/fundamentals/do-i-need-seo) |

```prompt title="Being Found Audit"
Audit how {{?PRODUCT_NAME}} gets found. Talk first: report, then wait for my go before changing anything.
Read .offthemode/PRODUCT.md (where the product should be found), .offthemode/GLOSSARY.md (the words people type), .offthemode/ROUTES.md (its Found column: yes, noindex or login) and .offthemode/DECISIONS.md (the AI-crawler choice). If PRODUCT.md doesn't say where the product should be found, stop and ask me that first, with your recommended answer.
Check {{?SITE_URL}} and {{STORE_LISTINGS | none}} against those files, not against a generic checklist. Fetch each page's first HTML without running JavaScript ({{FETCH_TOOL | curl -sSL -D -}}), the way a crawler sees it.
1. Every route with Found set to yes: answers 200; its words, title, meta description, canonical URL (absolute) and Open Graph tags are in the first HTML; it is in the sitemap; another page links to it in words that say what is there; no noindex anywhere.
2. Every route that should stay out: noindex or behind a login, never only blocked in robots.txt; preview and staging deployments included.
3. robots.txt on every host and subdomain, and the host's bot protection, match the AI-crawler choice in DECISIONS.md; the CSS and JavaScript pages need are not blocked; the sitemap is named.
4. Moved pages: one permanent redirect straight to the final address. Removed pages: a real 404. No page answers 200 while saying "not found".
5. Titles, descriptions, headings, alt text and store fields: in the words from GLOSSARY.md, true to what is there, unique per page, nothing stuffed. Structured data: only what the page shows, and only types Google still documents.
6. Mobile: store fields against the store's current rules, checked on its developer pages today; the files under /.well-known/ served over HTTPS with no redirect.
7. Measurement: whether Search Console and Bing Webmaster Tools are verified, and what their reports show now.
Report Page or file | Check | Expected (and the file or official page that says so) | Actual | Proof (the command and its output, a response header, a screenshot or file:line) | Fix. A finding without proof is a question, not a finding.
Never promise or predict a ranking, and propose no trick aimed at search engines or AI answers. After my go, fix the smallest items first and rerun the checks that failed.
```
