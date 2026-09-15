// scripts/fetch-news.js — RSS-парсер новостей для XaosLand
// Тянет RSS-ленты, фильтрует по ключевым словам, пишет статьи
// в категорию "Новости" (data/content/news/*.md + data/base.json).
// Дедупликация по source+link (state) и по id в base.json.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const BASE_PATH = path.join(DATA_DIR, 'base.json');
const NEWS_DIR = path.join(DATA_DIR, 'content', 'news');
const STATE_PATH = path.join(ROOT, 'data', 'news-state.json');
const SITE_URL = 'https://xaosland.ru';

const { isSafeArticleId } = require('./utils');

// ---------------- Настройки ----------------
const MAX_HOURS = parseInt(process.env.NEWS_MAX_HOURS || '48', 10);
const MAX_PER_RUN = parseInt(process.env.NEWS_MAX_PER_RUN || '12', 10);
const FETCH_TIMEOUT_MS = 15000;

const FEEDS = [
    { name: 'Habr', url: 'https://habr.com/ru/rss/news/?fl=ru', maxAge: 24 },
    { name: 'OpenNET', url: 'https://www.opennet.ru/opennews/opennews_all.rss', maxAge: 48 },
    { name: 'Lenta.ru', url: 'https://lenta.ru/rss/news', maxAge: 12, keywords: ['интернет', 'технолог', 'компьютер', 'программ', 'хакер', 'цифров', 'искусственный интеллект', 'сайт', 'взлом', 'уязвим'] },
    { name: '3DNews', url: 'https://www.3dnews.ru/news/rss/', maxAge: 24 },
    { name: 'IXBT', url: 'https://www.ixbt.com/export/news.rss', maxAge: 24 },
];

const CATEGORY = 'Новости';

// ---------------- Утилиты ----------------
function loadJson(file, fallback) {
    try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
    catch { return fallback; }
}
function saveJson(file, obj) {
    const tmp = `${file}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(obj, null, 2), 'utf8');
    fs.renameSync(tmp, file);
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function stripHtml(html) {
    return String(html || '')
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;|&apos;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&laquo;/g, '«')
        .replace(/&raquo;/g, '»')
        .replace(/&mdash;/g, '—')
        .replace(/&[a-z]+;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function extractTag(block, tag) {
    const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
    return m ? m[1].trim() : '';
}

function extractAttr(block, tagName, attr) {
    const m = block.match(new RegExp(`<${tagName}[^>]*\\s${attr}="([^"]*)"`, 'i'));
    return m ? m[1] : '';
}

function parseDate(str) {
    if (!str) return null;
    const t = Date.parse(str);
    return Number.isNaN(t) ? null : t;
}

function transliterate(s) {
    const map = { а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'e',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'sch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya' };
    return s.toLowerCase().split('').map(ch => map[ch] !== undefined ? map[ch] : ch).join('');
}

function makeId(source, title) {
    const slug = transliterate(title)
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 48);
    const day = new Date().toISOString().slice(0, 10);
    return `${slug || 'news'}-${day}`.slice(0, 99);
}

function estimateReadTime(text) {
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.round(words / 180));
}

async function fetchText(url) {
    const res = await fetch(url, {
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        headers: { 'User-Agent': 'XaosLandNewsBot/1.0 (+https://xaosland.ru)' },
        redirect: 'follow',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // Некоторые источники (OpenNET) отдают koi8-r/windows-1251 — декодируем по charset
    const buf = await res.arrayBuffer();
    let charset = /charset=([\w-]+)/i.exec(res.headers.get('content-type') || '')?.[1]?.toLowerCase();
    if (!charset) {
        const head = new TextDecoder('latin1').decode(buf.slice(0, 4096));
        charset = /charset=["']?([\w-]+)/i.exec(head)?.[1]?.toLowerCase()
            || /<\?xml[^>]*encoding=["']([\w-]+)["']/i.exec(head)?.[1]?.toLowerCase();
    }
    if (charset && charset !== 'utf-8' && charset !== 'utf8') {
        try { return new TextDecoder(charset).decode(buf); } catch { /* fallthrough */ }
    }
    return new TextDecoder('utf-8').decode(buf);
}

// ---------------- Извлечение текста статьи ----------------
const AD_PATTERNS = /^(подпис|реклам|фото:|видео:|источник:|читайте также|смотрите также|смотрите далее|не пропустите|ранее мы|наши соцсети|комментарии|обсудить|share|advertisement|ссылка по теме|материал (редактируется|дополняется))/i;
const SENT_LIMIT = parseInt(process.env.NEWS_SENTENCES || '10', 10);
const BODY_MAX_CHARS = 3500;

function countSentences(text) {
    return (text.match(/[.!?…]+(?=\s|$)/g) || []).length;
}

async function extractArticleText(url) {
    let html;
    try {
        html = await fetchText(url);
    } catch (e) {
        console.warn(`   ⚠️ не удалось скачать статью (${e.message})`);
        return [];
    }
    // Убираем шум до извлечения параграфов
    const cleaned = html
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
        .replace(/<(header|footer|nav|aside)[\s\S]*?<\/\1>/gi, ' ');
    // NB: <form> НЕ вырезаем — у OpenNET он оборачивает весь текст статьи.

    // Обрезаем секцию комментариев (иначе в статью попадает форумный мусор)
    const commentMarkers = [
        /<td[^>]+class=\"?ctxt\"?/i, /<div[^>]+id="comments"/i,
        /<div[^>]+class="[^"]*comments/i, /id="disqus/i,
        /<div[^>]+class="[^"]*comment-list/i,
    ];
    let cut = cleaned.length;
    for (const re of commentMarkers) {
        const m = re.exec(cleaned);
        if (m && m.index < cut) cut = m.index;
    }
    const bodyHtml = cleaned.slice(0, cut);

    // Разбираем параграфы. Старый HTML (OpenNET) не закрывает <p>, поэтому
    // режем по открывающим тегам, а текст берём до следующего блочного элемента.
    const paragraphs = [];
    const seenPar = new Set();
    const chunks = bodyHtml.split(/<p[^>]*>/i).slice(1);
    for (const chunk of chunks) {
        const untilBlock = chunk.split(/<\/(?:p|div|td|li)>|<(?:div|table|h[1-6]|ul|ol|blockquote|tr)[\s>]/i)[0];
        const text = stripHtml(untilBlock);
        if (text.length < 40) continue;                      // обрывки, кнопки, подписи
        if (AD_PATTERNS.test(text)) continue;                 // реклама/меню
        const key = text.slice(0, 60);
        if (seenPar.has(key)) continue;                       // дубли
        seenPar.add(key);
        paragraphs.push(text);
    }
    // Набираем ~SENTENCES предложений
    const out = [];
    let sentences = 0;
    for (const p of paragraphs) {
        out.push(p);
        sentences += countSentences(p);
        if (sentences >= SENT_LIMIT) break;
    }
    // Обрезаем по длине (аккуратно, по границе абзаца)
    let total = 0;
    const trimmed = [];
    for (const p of out) {
        if (total + p.length > BODY_MAX_CHARS && trimmed.length > 0) break;
        trimmed.push(p);
        total += p.length;
    }
    return trimmed;
}

// ---------------- Парсинг RSS ----------------
function parseRss(xml) {
    const items = [];
    const itemRe = /<item[\s\S]*?<\/item>/gi;
    let m;
    while ((m = itemRe.exec(xml)) !== null) {
        const block = m[0];
        const title = stripHtml(extractTag(block, 'title'));
        const link = stripHtml(extractTag(block, 'link')).replace(/^https?:\/\/t\.co\/\S+$/, '') || extractAttr(block, 'link', 'href');
        const description = stripHtml(extractTag(block, 'description'));
        const pubDate = extractTag(block, 'pubDate') || extractTag(block, 'dc:date') || extractTag(block, 'updated');
        const encoded = extractTag(block, 'content:encoded');
        const bodyHtml = encoded || extractTag(block, 'content') || '';
        if (title && link) items.push({ title, link, description, pubDate, bodyHtml });
    }
    // Atom fallback
    if (items.length === 0) {
        const entryRe = /<entry[\s\S]*?<\/entry>/gi;
        while ((m = entryRe.exec(xml)) !== null) {
            const block = m[0];
            const title = stripHtml(extractTag(block, 'title'));
            const link = extractAttr(block, 'link', 'href');
            const description = stripHtml(extractTag(block, 'summary') || extractTag(block, 'content'));
            const pubDate = extractTag(block, 'published') || extractTag(block, 'updated');
            if (title && link) items.push({ title, link, description, pubDate, bodyHtml: '' });
        }
    }
    return items;
}

// ---------------- Генерация markdown ----------------
function buildMarkdown(item, sourceName) {
    const lines = [
        '---',
        `id: ${item.id}`,
        'category: Новости',
        `title: ${item.title.replace(/"/g, "'")}`,
        `excerpt: ${(item.description || item.title).slice(0, 250).replace(/"/g, "'")}`,
        `date: ${item.date}`,
        `readTime: ${item.readTime}`,
        `tags: [новости, ${item.tagHint || 'технологии'}]`,
        'featured: false',
        'popular: false',
        'image: ""',
        `metaTitle: ${item.title.replace(/"/g, "'").slice(0, 60)}`,
        `metaDescription: ${(item.description || item.title).slice(0, 150).replace(/"/g, "'")}`,
        `source: ${sourceName}`,
        `sourceUrl: ${item.link}`,
        '---',
        '',
    ];
    const srcLine = `**Источник:** ${sourceName} — <${item.link}>`;
    if (item.articleParagraphs && item.articleParagraphs.length) {
        lines.push(...item.articleParagraphs, '');
    } else {
        lines.push(
            `(Краткая новость. Полный текст читайте по ссылке: <${item.link}>)`,
            '',
        );
    }
    lines.push('---', '', srcLine);
    return lines.join('\n');
}

// ---------------- Основной цикл ----------------
async function main() {
    const base = loadJson(BASE_PATH, { articles: [] });
    if (!Array.isArray(base.articles)) base.articles = [];
    const state = loadJson(STATE_PATH, { seen: {} });

    const existingIds = new Set(base.articles.map(a => a.id));
    const now = Date.now();
    const cutoffDefault = now - MAX_HOURS * 3600 * 1000;

    const stats = { fetched: 0, parsed: 0, added: 0, skipped: 0 };
    const articles = [];

    fs.mkdirSync(NEWS_DIR, { recursive: true });

    for (const feed of FEEDS) {
        try {
            const xml = await fetchText(feed.url);
            stats.fetched++;
            const items = parseRss(xml);
            stats.parsed += items.length;

            const cutoff = now - (feed.maxAge || MAX_HOURS) * 3600 * 1000;
            const kw = feed.keywords || null;

            for (const item of items) {
                if (articles.length + stats.added >= MAX_PER_RUN) break;
                const seenKey = `${feed.name}|${item.link}`;
                if (state.seen[seenKey]) continue;
                const ts = parseDate(item.pubDate) || now;
                if (ts < cutoff) { state.seen[seenKey] = ts; stats.skipped++; continue; }
                if (kw) {
                    const hay = (item.title + ' ' + item.description).toLowerCase();
                    if (!kw.some(k => hay.includes(k.toLowerCase()))) { state.seen[seenKey] = ts; stats.skipped++; continue; }
                }

                let id = makeId(feed.name, item.title);
                let n = 2;
                while (existingIds.has(id)) { id = `${makeId(feed.name, item.title)}-${n++}`; }
                if (!isSafeArticleId(id)) { state.seen[seenKey] = ts; stats.skipped++; continue; }

                const date = new Date(ts).toISOString().slice(0, 10);
                const enriched = { ...item, id, date };

                // Качаем текст статьи и достаём до ~10 предложений
                enriched.articleParagraphs = await extractArticleText(item.link);

                const bodyText = (enriched.articleParagraphs || []).join(' ') || stripHtml(item.bodyHtml) || item.description || item.title;
                enriched.readTime = estimateReadTime(bodyText);

                const md = buildMarkdown(enriched, feed.name);
                fs.writeFileSync(path.join(NEWS_DIR, `${id}.md`), md, 'utf8');

                const article = {
                    id,
                    category: 'Новости',
                    title: item.title,
                    excerpt: (item.description || item.title).slice(0, 250),
                    date,
                    readTime: enriched.readTime,
                    tags: ['новости', feed.name.toLowerCase()],
                    featured: false,
                    popular: false,
                    image: '',
                    metaTitle: item.title.slice(0, 60),
                    metaDescription: (item.description || item.title).slice(0, 150),
                    source: feed.name,
                    sourceUrl: item.link,
                };
                base.articles.unshift(article);
                existingIds.add(id);
                state.seen[seenKey] = ts;
                stats.added++;
                articles.push(id);
            }
        } catch (e) {
            console.error(`⚠️  ${feed.name}: ${e.message}`);
        }
        await sleep(500);
    }

    // Чистим state — оставляем только свежие записи (не раздуваем файл)
    const stateCutoff = now - 14 * 24 * 3600 * 1000;
    for (const [k, ts] of Object.entries(state.seen)) {
        if (ts < stateCutoff) delete state.seen[k];
    }

    saveJson(BASE_PATH, base);
    saveJson(STATE_PATH, state);

    console.log(`✅ Лент: ${stats.fetched}/${FEEDS.length}, записей прочитано: ${stats.parsed}`);
    console.log(`📰 Новых новостей: ${stats.added}, пропущено: ${stats.skipped}`);
    if (articles.length) console.log(`   ID: ${articles.join(', ')}`);
}

// Тестовый режим: NEWS_TEST_URL=<url> — скачать одну статью и показать извлечённый текст
if (process.env.NEWS_TEST_URL) {
    extractArticleText(process.env.NEWS_TEST_URL).then((ps) => {
        console.log(`Извлечено абзацев: ${ps.length}, предложений: ${ps.reduce((s, p) => s + countSentences(p), 0)}`);
        console.log('---');
        console.log(ps.join('\n\n').slice(0, 2000));
    });
} else {
    main().catch(e => { console.error('❌', e); process.exit(1); });
}