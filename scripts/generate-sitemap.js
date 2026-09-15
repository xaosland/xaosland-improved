const fs = require('fs');
const path = require('path');
const { getSlugFromCategory } = require('./utils');

const SITE_URL = 'https://xaosland.ru';
const ARTICLES_PATH = path.join(__dirname, '..', 'data', 'base.json');
const OUTPUT_PATH = path.join(__dirname, '..', 'sitemap.xml');

function generateSitemap() {
    try {
        const data = fs.readFileSync(ARTICLES_PATH, 'utf8');
        const json = JSON.parse(data);
        const articles = json.articles || [];

        articles.sort((a, b) => new Date(b.date) - new Date(a.date));

        const seen = new Set();
        const urls = [];
        for (const article of articles) {
            const slug = getSlugFromCategory(article.category);
            const loc = `${SITE_URL}/${slug}/${article.id}/`;
            if (seen.has(loc)) continue;
            seen.add(loc);

            const lastmod = article.date ? article.date.split('T')[0] : new Date().toISOString().split('T')[0];
            urls.push(`    <url>
        <loc>${loc}</loc>
        <lastmod>${lastmod}</lastmod>
        <priority>0.8</priority>
    </url>`);
        }

        const today = new Date().toISOString().split('T')[0];
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${SITE_URL}/</loc>
        <lastmod>${today}</lastmod>
        <priority>1.0</priority>
    </url>
${urls.join('\n')}
</urlset>`;

        fs.writeFileSync(OUTPUT_PATH, sitemap, 'utf8');
        console.log(`✅ Sitemap успешно создан: ${OUTPUT_PATH}`);
        console.log(`📊 Всего добавлено статей: ${urls.length}`);
    } catch (error) {
        console.error('❌ Ошибка генерации sitemap:', error.message);
    }
}

generateSitemap();