const fs = require('fs');
const path = require('path');
const marked = require('marked');

// sharp — для OG-картинок; если не установлен, пропускаем без падения сборки
let sharp = null;
try { sharp = require('sharp'); } catch { console.warn('⚠️ sharp не установлен — OG-картинки пропущены (npm i sharp)'); }

// Настройки
const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const DATA_DIR = path.join(ROOT, 'data');
const CONTENT_DIR = path.join(ROOT, 'data', 'content');
const SITE_URL = 'https://xaosland.ru';
const SITE_TITLE = 'XaosLand IT-блог';

const { getSlugFromCategory } = require('./utils');

// Читаем JSON
const base = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'base.json'), 'utf8'));
const articles = base.articles || [];

// Копирование папок/файлов
function copyDir(src, dest) {
    if (!fs.existsSync(src)) return;
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Копируем статические файлы
function copyStatic() {
    const items = ['css', 'js', 'webfonts', 'icons', 'images', 'data', 'manifest.json', 'service-worker.js', 'robots.txt', 'rss.xml', 'sitemap.xml', 'index.html', 'about.html', 'contacts.html', 'privacy.html'];
    for (const item of items) {
        const src = path.join(ROOT, item);
        const dest = path.join(DIST, item);
        if (fs.existsSync(src)) {
            if (fs.lstatSync(src).isDirectory()) copyDir(src, dest);
            else fs.copyFileSync(src, dest);
        }
    }
}

// Экранирование HTML
function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

// Форматирование даты
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Удаляем frontmatter из Markdown (надёжная версия)
function stripFrontmatter(markdown) {
    // Удаляем BOM и пробелы в начале
    const trimmed = markdown.replace(/^\uFEFF/, '').trimStart();
    // Проверяем, начинается ли с '---'
    if (!trimmed.startsWith('---')) return markdown;
    // Находим закрывающий '---'
    const lines = trimmed.split('\n');
    let endIndex = -1;
    // Ищем '---' начиная со второй строки
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '---') {
            endIndex = i;
            break;
        }
    }
    if (endIndex === -1) return markdown; // если не нашли закрывающий, оставляем как есть
    // Возвращаем содержимое после закрывающего '---'
    return lines.slice(endIndex + 1).join('\n').trim();
}

// Генерация HTML-страницы статьи
function generateArticleHTML(article) {
    const slug = getSlugFromCategory(article.category);
    const contentFile = path.join(CONTENT_DIR, slug, `${article.id}.md`);
    let contentHtml = '';
    if (fs.existsSync(contentFile)) {
        const markdown = fs.readFileSync(contentFile, 'utf8');
        const cleanedMarkdown = stripFrontmatter(markdown);
        contentHtml = marked.parse(cleanedMarkdown);
    } else {
        contentHtml = '<p>Контент не найден.</p>';
    }

    const title = article.metaTitle || article.title;
    const description = article.metaDescription || article.excerpt;
    const tags = article.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join(' ');
    const articleUrl = `${SITE_URL}/${slug}/${article.id}/`;
    const ogImage = `${SITE_URL}/og/${article.id}.png`;

    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)} | ${escapeHtml(article.category)} | ${SITE_TITLE}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${articleUrl}">
    <meta property="og:image" content="${ogImage}">
    <meta name="twitter:image" content="${ogImage}">
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/fonts-local.css">
    <link rel="preload" href="/css/all.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<link rel="preload" as="style" href="/css/style.css">
<link rel="preload" as="font" type="font/woff2" href="/webfonts/fa-solid-900.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/webfonts/fa-brands-400.woff2" crossorigin>
    <noscript><link rel="stylesheet" href="/css/all.min.css"></noscript>
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#0a0a0a">
    <link rel="apple-touch-icon" href="/icons/icon-192.png">
    <link rel="alternate" type="application/rss+xml" title="RSS" href="/rss.xml">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22><tspan fill=%22%2393FF00%22>{</tspan><tspan fill=%22%2300BFFF%22>/</tspan><tspan fill=%22%23FF00FF%22>}</tspan></text></svg>">
    <!-- Yandex.Metrika counter -->
<script type="text/javascript">
   (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();
   for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
   k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

   ym(XXXXXX, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
   });
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/XXXXXX" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->
</head>
<body>
<div id="notification-container" aria-live="polite"></div>
<div id="overlay" class="overlay"></div>
<div id="reading-progress" class="reading-progress"></div>

<header>
    <div class="container header-container">
        <a href="/" class="logo" aria-label="Главная страница XaosLand">
            <span class="hacker-terminal"><span class="text">ACCESS DENIED...</span></span>
        </a>
        <button class="burger-btn" aria-label="Меню" aria-expanded="false" aria-controls="nav-list">
            <span class="burger-line"></span><span class="burger-line"></span><span class="burger-line"></span>
        </button>
        <nav class="nav-menu" aria-label="Основная навигация">
            <ul class="nav-list" id="nav-list"></ul>
        </nav>
    </div>
</header>

<div class="quick-filters container">
    <div class="search-container">
        <input type="text" id="search-input" placeholder="Поиск статей..." aria-label="Поиск" autocomplete="off">
        <button id="search-btn" aria-label="Начать поиск"><i class="fas fa-search"></i></button>
        <div id="search-suggestions" class="search-suggestions"></div>
    </div>
    <div class="breadcrumb nav-link" aria-label="Хлебные крошки"></div>
    <div class="filter-tags" role="group" aria-label="Фильтры по тегам"></div>
</div>

<main class="container">
    <div class="blog-layout">
        <div class="main-column">
        <div class="main-articles" role="main">
            <article class="full-article" data-id="${article.id}">
                <h1>${escapeHtml(article.title)}</h1>
                <div class="article-meta">
                    <span><i class="far fa-calendar"></i> ${formatDate(article.date)}</span>
                    <span><i class="fas fa-clock"></i> ${article.readTime} мин чтения</span>
                    <span><i class="fas fa-tags"></i> ${tags}</span>
                    <button class="favorite-btn" data-id="${article.id}" aria-label="Добавить в избранное"><i class="fas fa-star"></i></button>
                </div>
                <div class="article-body">
                    ${contentHtml}
                </div>
                <div class="share-section">
                    <div class="share-title"><i class="fas fa-share-alt"></i> Поделиться:</div>
                    <div class="share-buttons">
                        <a href="https://vk.com/share.php?url=${encodeURIComponent(articleUrl)}&title=${encodeURIComponent(article.title)}" target="_blank" rel="noopener noreferrer" class="share-btn vk"><i class="fab fa-vk"></i> <span>ВКонтакте</span></a>
                        <a href="https://t.me/share/url?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(article.title)}" target="_blank" rel="noopener noreferrer" class="share-btn telegram"><i class="fab fa-telegram-plane"></i> <span>Telegram</span></a>
                        <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(article.title)}" target="_blank" rel="noopener noreferrer" class="share-btn twitter"><i class="fab fa-twitter"></i> <span>Twitter</span></a>
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}" target="_blank" rel="noopener noreferrer" class="share-btn facebook"><i class="fab fa-facebook-f"></i> <span>Facebook</span></a>
                        <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + ' ' + articleUrl)}" target="_blank" rel="noopener noreferrer" class="share-btn whatsapp"><i class="fab fa-whatsapp"></i> <span>WhatsApp</span></a>
                        <button class="share-btn copy" data-url="${articleUrl}" onclick="copyToClipboard(this)"><i class="fas fa-copy"></i> <span>Копировать ссылку</span></button>
                    </div>
                </div>
                <div class="related-articles" id="related-articles"></div>
                <div class="comments-section" id="comments-${article.id}">
                    <h3 class="comments-title"><i class="fas fa-comments"></i> Комментарии</h3>
                    <div class="comments-placeholder"></div>
                </div>
            </article>
        </div>
        <div id="pagination-container" class="pagination-wrapper"></div>
        </div>
        <aside class="sidebar" aria-label="Боковая панель">
            <div class="sidebar-section">
                <h3 class="sidebar-title"><i class="fas fa-fire"></i> Популярное</h3>
                <ul class="sidebar-links" aria-label="Популярные статьи"></ul>
            </div>
            <div class="sidebar-section">
                <h3 class="sidebar-title"><i class="fas fa-folder"></i> Категории</h3>
                <ul class="sidebar-links category-links" aria-label="Категории"></ul>
            </div>
            <div class="sidebar-section">
                <h3 class="sidebar-title"><i class="fas fa-tags"></i> Теги</h3>
                <div class="tag-cloud" id="tag-cloud"></div>
            </div>
            <div class="sidebar-section">
                <h3 class="sidebar-title"><i class="fas fa-star"></i> Избранное</h3>
                <ul class="sidebar-links" id="favorites-list" aria-label="Избранные статьи"></ul>
            </div>
            <div class="sidebar-section">
                <h3 class="sidebar-title"><i class="fas fa-download"></i> Скачать</h3>
                <ul class="sidebar-links">
                    <li><a href="#"><i class="fas fa-file-archive"></i> Сборка программ</a></li>
                    <li><a href="#"><i class="fas fa-code"></i> Готовые скрипты</a></li>
                    <li><a href="#"><i class="fas fa-palette"></i> Темы для Windows</a></li>
                    <li><a href="#"><i class="fas fa-gamepad"></i> Патчи для игр</a></li>
                </ul>
            </div>
        </aside>
    </div>
</main>

<button id="scroll-top" class="scroll-top" aria-label="Наверх"><i class="fas fa-arrow-up"></i></button>
<footer id="footer"></footer>

<script src="/js/app.js" defer></script>
</body>
</html>`;
}

// ---------- OG-картинки (1200×630) ----------
function ogSvg(article) {
    const title = (article.title || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const cat = (article.category || '').replace(/&/g, '&amp;');
    // Режем заголовок на строки ~26 символов, максимум 4 строки
    const words = (article.title || '').split(' ');
    const lines = [];
    let cur = '';
    for (const w of words) {
        if ((cur + ' ' + w).trim().length > 26 && cur) { lines.push(cur); cur = w; }
        else cur = (cur + ' ' + w).trim();
        if (lines.length === 4) break;
    }
    if (cur && lines.length < 4) lines.push(cur);
    const tspans = lines.map((l, i) =>
        `<text x="80" y="${280 + i * 78}" font-size="56" font-weight="700" fill="#f0f0f0" font-family="DejaVu Sans, sans-serif">${l.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</text>`
    ).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#0a0a0a"/>
  <rect x="0" y="0" width="1200" height="4" fill="#93FF00"/>
  <text x="80" y="140" font-size="34" fill="#93FF00" font-family="DejaVu Sans Mono, monospace" font-weight="600">{/${cat}} XAOSLAND</text>
  ${tspans}
  <text x="80" y="580" font-size="28" fill="#8f8f8f" font-family="DejaVu Sans Mono, monospace">xaosland.ru</text>
  <rect x="0" y="626" width="1200" height="4" fill="#FF00FF"/>
</svg>`;
}

async function generateOgImages() {
    if (!sharp) return;
    const ogDir = path.join(DIST, 'og');
    fs.mkdirSync(ogDir, { recursive: true });
    // Кэш вне dist: dist стирается при каждой сборке и свапается при деплое,
    // а кэш переживает всё — рендерим только новые статьи
    const cacheDir = path.join(ROOT, 'cache', 'og');
    fs.mkdirSync(cacheDir, { recursive: true });
    let rendered = 0;
    for (const article of articles) {
        const cached = path.join(cacheDir, `${article.id}.png`);
        try {
            if (!fs.existsSync(cached)) {
                await sharp(Buffer.from(ogSvg(article))).png({ quality: 90 }).toFile(cached);
                rendered++;
            }
        } catch (e) {
            console.warn(`⚠️ OG для ${article.id}: ${e.message}`);
        }
    }
    fs.cpSync(cacheDir, ogDir, { recursive: true });
    console.log(`✅ OG-картинок: ${articles.length} (отрендерено новых: ${rendered})`);
}

// ---------- Индекс поиска (data/search-index.json) ----------
function buildSearchIndex() {
    const idx = [];
    for (const article of articles) {
        const slug = getSlugFromCategory(article.category);
        const contentFile = path.join(CONTENT_DIR, slug, `${article.id}.md`);
        let body = '';
        if (fs.existsSync(contentFile)) {
            body = stripFrontmatter(fs.readFileSync(contentFile, 'utf8')).slice(0, 2500);
        }
        idx.push({
            id: article.id,
            category: article.category,
            title: article.title,
            excerpt: article.excerpt,
            date: article.date,
            tags: article.tags || [],
            body,
        });
    }
    fs.writeFileSync(path.join(DIST, 'data', 'search-index.json'), JSON.stringify(idx), 'utf8');
    console.log(`✅ Поисковый индекс: ${idx.length} статей`);
}

// ---------- Карта похожих статей (data/related.json) ----------
function buildRelatedMap() {
    const STOPLIST = new Set(['новости', 'обзор', 'подборка', 'софт', 'настройка', 'безопасность', 'технологии']);
    const related = {};
    for (const a of articles) {
        const atags = new Set((a.tags || []).filter(t => !STOPLIST.has(t.toLowerCase())).map(t => t.toLowerCase()));
        const awords = new Set((a.title || '').toLowerCase().match(/[а-яёa-z0-9]{4,}/g) || []);
        const scored = [];
        for (const b of articles) {
            if (b.id === a.id) continue;
            let score = 0;
            for (const t of (b.tags || [])) if (atags.has(t.toLowerCase())) score += 3;
            if (b.category === a.category) score += 1;
            const bwords = (b.title || '').toLowerCase().match(/[а-яёa-z0-9]{4,}/g) || [];
            for (const w of bwords) if (awords.has(w)) score += 2;
            if (score > 0) scored.push({ id: b.id, score });
        }
        related[a.id] = scored.sort((x, y) => y.score - x.score).slice(0, 4).map(x => x.id);
    }
    fs.writeFileSync(path.join(DIST, 'data', 'related.json'), JSON.stringify(related), 'utf8');
    console.log(`✅ Карта похожих статей: ${Object.keys(related).length}`);
}

// ---------- 404-страница ----------
function generate404() {
    const html = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 — Страница не найдена | XaosLand</title>
    <meta name="robots" content="noindex">
    <link rel="stylesheet" href="/css/style.css">
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#0a0a0a">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22><tspan fill=%22%2393FF00%22>{</tspan><tspan fill=%22%2300BFFF%22>/</tspan><tspan fill=%22%23FF00FF%22>}</tspan></text></svg>">
    <style>
        .e404 { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:70vh; text-align:center; padding:40px 20px; }
        .e404-code { font-family: var(--font-mono); font-size: clamp(64px, 14vw, 140px); font-weight:700; color:var(--accent-primary); text-shadow: 3px 0 var(--glitch-color-1), -3px 0 var(--glitch-color-2); line-height:1; }
        .e404-text { font-size:1.2rem; color:var(--text-secondary); margin:20px 0 30px; }
        .e404-btn { display:inline-block; padding:12px 28px; background:var(--accent-primary); color:var(--bg-primary); border-radius:8px; font-weight:600; text-decoration:none; }
        .e404-btn:hover { box-shadow: 0 0 15px rgba(147,255,0,0.5); }
    </style>
</head>
<body>
    <div class="e404">
        <div class="e404-code">404</div>
        <div class="e404-text">ACCESS DENIED — такой страницы нет. Возможно, её удалили или никогда не существовало.</div>
        <a class="e404-btn" href="/">← На главную</a>
    </div>
</body>
</html>`;
    fs.writeFileSync(path.join(DIST, '404.html'), html, 'utf8');
    console.log('✅ 404-страница создана');
}

// Основная функция генерации
async function generatePages() {
    // Очищаем dist
    if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true, force: true });
    fs.mkdirSync(DIST, { recursive: true });

    // Копируем статику
    copyStatic();

    // Генерируем страницы статей
    for (const article of articles) {
        const slug = getSlugFromCategory(article.category);
        const pageDir = path.join(DIST, slug, article.id);
        fs.mkdirSync(pageDir, { recursive: true });
        const html = generateArticleHTML(article);
        fs.writeFileSync(path.join(pageDir, 'index.html'), html, 'utf8');
    }

    // Индексные страницы категорий — иначе nginx отдаёт 403 на /news/ и т.п.
    const shell = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    const slugs = new Set(articles.map(a => getSlugFromCategory(a.category)).filter(Boolean));
    const contentRoot = path.join(DATA_DIR, 'content');
    if (fs.existsSync(contentRoot)) {
        for (const d of fs.readdirSync(contentRoot)) {
            if (fs.statSync(path.join(contentRoot, d)).isDirectory()) slugs.add(d);
        }
    }
    for (const slug of slugs) {
        const dir = path.join(DIST, slug);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), shell, 'utf8');
    }

    buildSearchIndex();
    buildRelatedMap();
    generate404();
    await generateOgImages();

    console.log(`✅ Сгенерировано страниц: ${articles.length} + категории: ${slugs.size}`);
}

generatePages().catch(e => { console.error('❌', e); process.exit(1); });
