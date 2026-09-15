const fs = require('fs');
const path = require('path');
const { getSlugFromCategory, escapeXML } = require('./utils');

const SITE_URL = 'https://xaosland.ru';
const SITE_TITLE = 'XaosLand IT-блог';
const SITE_DESCRIPTION = 'Новые статьи о технологиях, программах, играх и безопасности';
// Путь к данным – из папки scripts поднимаемся на уровень выше
const ARTICLES_PATH = path.join(__dirname, '..', 'data', 'base.json');
// Путь вывода – в корень проекта
const OUTPUT_PATH = path.join(__dirname, '..', 'rss.xml');

function formatRSSDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) return new Date().toUTCString();
    return date.toUTCString();
}

function generateRSS() {
    try {
        const data = fs.readFileSync(ARTICLES_PATH, 'utf8');
        const json = JSON.parse(data);
        const articles = json.articles || [];

        if (articles.length === 0) {
            console.warn('⚠️  Нет статей для генерации RSS.');
            return;
        }

        // Сортируем по дате
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Собираем уникальные элементы
        const seen = new Set();
        const items = [];
        for (const article of articles) {
            const slug = getSlugFromCategory(article.category);
            const link = `${SITE_URL}/${slug}/${article.id}/`;

            // Проверяем дубликаты
            if (seen.has(link)) continue;
            seen.add(link);

            const title = escapeXML(article.title);
            const description = escapeXML(article.excerpt || '');
            const pubDate = formatRSSDate(article.date);

            items.push(`
    <item>
        <title>${title}</title>
        <link>${link}</link>
        <description>${description}</description>
        <pubDate>${pubDate}</pubDate>
        <guid isPermaLink="true">${link}</guid>
    </item>`);
        }

        const lastBuildDate = new Date().toUTCString();
        const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>${SITE_TITLE}</title>
        <link>${SITE_URL}</link>
        <description>${SITE_DESCRIPTION}</description>
        <language>ru</language>
        <lastBuildDate>${lastBuildDate}</lastBuildDate>
        <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
        ${items.join('')}
    </channel>
</rss>`;

        fs.writeFileSync(OUTPUT_PATH, rss, 'utf8');
        console.log(`✅ RSS-лента успешно сгенерирована в ${OUTPUT_PATH}`);
        console.log(`📊 Всего статей: ${articles.length}, уникальных: ${items.length}`);
    } catch (error) {
        console.error('❌ Ошибка генерации RSS:', error.message);
    }
}

generateRSS();