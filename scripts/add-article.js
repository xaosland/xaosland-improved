// scripts/add-article.js
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const BASE_PATH = path.join(DATA_DIR, 'base.json');
const CONTENT_DIR = path.join(DATA_DIR, 'content');

const { categoryMap, isSafeArticleId } = require('./utils');

function parseFrontmatter(markdown) {
    const lines = markdown.split('\n');
    if (lines[0].trim() !== '---') {
        throw new Error('Файл должен начинаться с "---" (frontmatter)');
    }

    const frontmatter = {};
    let inFrontmatter = true;
    let contentStart = 1;

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (inFrontmatter && line.trim() === '---') {
            inFrontmatter = false;
            contentStart = i + 1;
            break;
        }
        if (inFrontmatter) {
            const colonIndex = line.indexOf(':');
            if (colonIndex === -1) continue;
            const key = line.slice(0, colonIndex).trim();
            const value = line.slice(colonIndex + 1).trim();
            frontmatter[key] = value.replace(/^['"]|['"]$/g, '');
        }
    }

    if (frontmatter.tags) {
        frontmatter.tags = frontmatter.tags
            .replace(/\[|\]/g, '')
            .split(',')
            .map(t => t.trim())
            .filter(Boolean);
    }

    if (frontmatter.readTime) {
        frontmatter.readTime = parseInt(frontmatter.readTime, 10);
    }
    if (frontmatter.featured !== undefined) {
        frontmatter.featured = frontmatter.featured === 'true';
    }
    if (frontmatter.popular !== undefined) {
        frontmatter.popular = frontmatter.popular === 'true';
    }
    if (frontmatter.lab !== undefined) {
        frontmatter.lab = frontmatter.lab === 'true';
    }
    if (frontmatter.labTools) {
        frontmatter.labTools = frontmatter.labTools.replace(/^\[|\]$/g, '').split(',').map(t => t.trim()).filter(Boolean);
    }

    const content = lines.slice(contentStart).join('\n').trim();

    return { frontmatter, content };
}

function addArticle(mdFilePath) {
    const fullPath = path.resolve(mdFilePath);
    if (!fs.existsSync(fullPath)) {
        console.error(`❌ Файл не найден: ${fullPath}`);
        process.exit(1);
    }

    const markdown = fs.readFileSync(fullPath, 'utf8');
    let parsed;
    try {
        parsed = parseFrontmatter(markdown);
    } catch (error) {
        console.error(`❌ Ошибка чтения frontmatter: ${error.message}`);
        process.exit(1);
    }

    const { frontmatter } = parsed;

    const requiredFields = ['id', 'category', 'title', 'excerpt', 'date', 'readTime'];
    for (const field of requiredFields) {
        if (!frontmatter[field]) {
            console.error(`❌ Отсутствует поле "${field}" в frontmatter`);
            process.exit(1);
        }
    }

    if (!categoryMap[frontmatter.category]) {
        console.error(`❌ Категория "${frontmatter.category}" не существует. Доступные: ${Object.keys(categoryMap).join(', ')}`);
        process.exit(1);
    }

    if (!isSafeArticleId(frontmatter.id)) {
        console.error('❌ ID статьи должен содержать только латинские буквы, цифры и дефисы (2–100 символов).');
        process.exit(1);
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(frontmatter.date) || Number.isNaN(new Date(frontmatter.date).getTime())) {
        console.error('❌ Дата должна быть в формате YYYY-MM-DD.');
        process.exit(1);
    }

    if (!Number.isInteger(frontmatter.readTime) || frontmatter.readTime < 1 || frontmatter.readTime > 1440) {
        console.error('❌ readTime должен быть целым числом от 1 до 1440.');
        process.exit(1);
    }

    const base = JSON.parse(fs.readFileSync(BASE_PATH, 'utf8'));
    if (base.articles.some(a => a.id === frontmatter.id)) {
        console.error(`❌ Статья с id "${frontmatter.id}" уже существует`);
        process.exit(1);
    }

    const article = {
        id: frontmatter.id,
        category: frontmatter.category,
        title: frontmatter.title,
        excerpt: frontmatter.excerpt,
        date: frontmatter.date,
        readTime: frontmatter.readTime,
        tags: frontmatter.tags || [],
        featured: frontmatter.featured || false,
        popular: frontmatter.popular || false,
        image: frontmatter.image || '',
        lab: frontmatter.lab || false,
        labTools: frontmatter.labTools || [],
        labLevel: frontmatter.labLevel || '',
        metaTitle: frontmatter.metaTitle || frontmatter.title,
        metaDescription: frontmatter.metaDescription || frontmatter.excerpt
    };

    base.articles.unshift(article);
    fs.writeFileSync(BASE_PATH, JSON.stringify(base, null, 2), 'utf8');

    const slug = categoryMap[frontmatter.category];
    const expectedPath = path.join(CONTENT_DIR, slug, `${frontmatter.id}.md`);

    if (fullPath !== expectedPath) {
        fs.mkdirSync(path.dirname(expectedPath), { recursive: true });
        fs.copyFileSync(fullPath, expectedPath);
        console.log(`📝 Файл скопирован в: ${expectedPath}`);
        console.log(`ℹ️  Исходный файл оставлен на месте (удалите вручную при необходимости).`);
    }

    console.log(`✅ Статья "${frontmatter.title}" добавлена!`);
    console.log(`📌 ID: ${frontmatter.id}`);
}

const args = process.argv.slice(2);
if (args.length === 0) {
    console.log('Использование: node scripts/add-article.js <путь-к-md-файлу>');
    console.log('Пример: node scripts/add-article.js my-article.md');
    process.exit(1);
}

addArticle(args[0]);
