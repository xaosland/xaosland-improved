#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'data');
const DIST = path.join(ROOT, 'dist');
const fail = message => { console.error(`❌ ${message}`); process.exitCode = 1; };
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));

const base = readJson(path.join(DATA, 'base.json'));
const articles = base.articles || [];
const ids = new Set();
let errors = 0;

for (const article of articles) {
    if (!article.id || ids.has(article.id)) { fail(`duplicate or empty article id: ${article.id}`); errors++; }
    ids.add(article.id);
    const category = { 'Новости': 'news', 'Статьи': 'articles', 'Обучение': 'learning', 'Пентестинг': 'pentest', 'Windows': 'windows', 'Программы': 'programs', 'Игры': 'games', 'Скрипты': 'scripts', 'Сети': 'networks', 'GitHub проекты': 'github', 'Ozon находки': 'ozon' }[article.category];
    if (!category) { fail(`unknown category for ${article.id}: ${article.category}`); errors++; continue; }
    const content = path.join(DATA, 'content', category, `${article.id}.md`);
    if (!fs.existsSync(content)) { fail(`missing markdown for ${article.id}: ${content}`); errors++; }
}

for (const file of fs.readdirSync(path.join(DATA, 'content'), { withFileTypes: true })) {
    if (!file.isDirectory()) continue;
    for (const entry of fs.readdirSync(path.join(DATA, 'content', file.name))) {
        if (!entry.endsWith('.md')) continue;
        const id = entry.slice(0, -3);
        if (!ids.has(id)) console.warn(`⚠️ markdown не зарегистрирован в base.json (ожидается при параллельном news-fetch): ${file.name}/${entry}`);
    }
}

if (fs.existsSync(DIST)) {
    const required = ['index.html', '404.html', 'css/style.css', 'js/app.js', 'data/search-index.json', 'data/related.json', 'learning/routes/index.html', 'learning/academy/index.html'];
    for (const file of required) if (!fs.existsSync(path.join(DIST, file))) { fail(`missing build artifact: dist/${file}`); errors++; }
    const og = path.join(DIST, 'og');
    if (fs.existsSync(og)) {
        const pngs = fs.readdirSync(og).filter(file => file.endsWith('.png'));
        if (pngs.length !== articles.length) { fail(`OG count ${pngs.length} differs from article count ${articles.length}`); errors++; }
    }
}

if (!errors) console.log(`✅ Project integrity OK: ${articles.length} articles`);
else process.exitCode = 1;
