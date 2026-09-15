const fs = require('fs');
const path = require('path');
const { categoryMap, isSafeArticleId } = require('./utils');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'data');
const errors = [];
const warnings = [];

function readJson(file) {
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (error) {
        errors.push(`${path.relative(ROOT, file)}: некорректный JSON (${error.message})`);
        return null;
    }
}

const base = readJson(path.join(DATA, 'base.json')) || {};
readJson(path.join(DATA, 'navigation.json'));
readJson(path.join(DATA, 'footer.json'));

if (!Array.isArray(base.articles)) {
    errors.push('data/base.json: поле articles должно быть массивом');
} else {
    const ids = new Set();
    for (const article of base.articles) {
        if (!isSafeArticleId(article.id)) errors.push(`Некорректный id статьи: ${article.id}`);
        if (ids.has(article.id)) errors.push(`Дубликат id статьи: ${article.id}`);
        ids.add(article.id);
        if (!categoryMap[article.category]) warnings.push(`Неизвестная категория: ${article.category}`);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(article.date) || Number.isNaN(new Date(article.date).getTime())) {
            errors.push(`Некорректная дата у ${article.id}: ${article.date}`);
        }
        if (!Number.isInteger(article.readTime) || article.readTime < 1) {
            errors.push(`Некорректный readTime у ${article.id}: ${article.readTime}`);
        }
        const slug = categoryMap[article.category];
        const content = path.join(DATA, 'content', slug, `${article.id}.md`);
        if (!fs.existsSync(content)) warnings.push(`Нет Markdown-контента: ${path.relative(ROOT, content)}`);
    }
}

for (const file of ['index.html', 'style.css', 'app.js', 'service-worker.js', 'package.json']) {
    if (!fs.existsSync(path.join(ROOT, file))) errors.push(`Отсутствует ${file}`);
}

if (errors.length) {
    console.error(`❌ Ошибок: ${errors.length}`);
    errors.forEach(e => console.error(`  - ${e}`));
    if (warnings.length) {
        console.warn(`⚠️ Предупреждений: ${warnings.length}`);
        warnings.slice(0, 20).forEach(w => console.warn(`  - ${w}`));
        if (warnings.length > 20) console.warn(`  ... ещё ${warnings.length - 20}`);
    }
    process.exit(1);
}

console.log('✅ Валидация структуры и данных прошла успешно.');
if (warnings.length) {
    console.warn(`⚠️ Предупреждений: ${warnings.length}`);
    warnings.slice(0, 20).forEach(w => console.warn(`  - ${w}`));
    if (warnings.length > 20) console.warn(`  ... ещё ${warnings.length - 20}`);
}
