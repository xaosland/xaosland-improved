#!/usr/bin/env node
// scripts/retag-news.js — ретроспективное проставление тематических тегов
// всем существующим новостям (по заголовку + выдержке + тексту статьи).
// Запуск: node scripts/retag-news.js [--dry]

const fs = require('fs');
const path = require('path');
const { detectTopicTags } = require('./topic-tags');

const ROOT = path.join(__dirname, '..');
const BASE_PATH = path.join(ROOT, 'data', 'base.json');
const NEWS_DIR = path.join(ROOT, 'data', 'content', 'news');
const DRY = process.argv.includes('--dry');

function mdBody(id) {
    const f = path.join(NEWS_DIR, `${id}.md`);
    if (!fs.existsSync(f)) return '';
    const raw = fs.readFileSync(f, 'utf8');
    // Отбрасываем frontmatter, убираем markdown-разметку
    const withoutFm = raw.replace(/^---[\s\S]*?---/, '');
    return withoutFm
        .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/[#>*`_|]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

const base = JSON.parse(fs.readFileSync(BASE_PATH, 'utf8'));
let changed = 0;
const stats = {};

for (const a of base.articles) {
    if (a.category !== 'Новости') continue;
    const text = [a.title, a.excerpt, mdBody(a.id)].join(' ');
    const topics = detectTopicTags(text);
    const source = a.source ? a.source.toLowerCase() : null;
    const next = [...new Set(['новости', ...topics, ...(source ? [source] : [])])].slice(0, 5);
    const oldKey = (a.tags || []).join('|');
    const newKey = next.join('|');
    if (oldKey !== newKey) {
        changed++;
        for (const t of topics) stats[t] = (stats[t] || 0) + 1;
        if (!DRY) a.tags = next;
    }
}

console.log(`Новостей с изменёнными тегами: ${changed}`);
console.log('Распределение тем:', JSON.stringify(stats));

if (!DRY) {
    fs.writeFileSync(BASE_PATH, JSON.stringify(base, null, 2), 'utf8');
    console.log('✅ base.json обновлён');
} else {
    console.log('（dry run — ничего не записано)');
}
