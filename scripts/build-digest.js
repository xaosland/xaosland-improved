#!/usr/bin/env node
// scripts/build-digest.js — недельный дайджест «Лучшее за неделю» из статистики
// GoatCounter (свой, на VPS). Читает hits напрямую из sqlite (read-only), берёт
// топ статей раздела /news/ за период и создаёт статью в категории «Статьи».
// Запускается на VPS из cron-обёртки xaosland-digest.sh (раз в неделю).
// Идемпотент: digest-<ISO-неделя> перезаписывается, дублей не плодит.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const GC_DB = process.env.GC_DB || '/var/lib/goatcounter/db.sqlite3';
const GC_BIN = process.env.GC_BIN || '/usr/local/bin/goatcounter';
const DAYS = parseInt(process.env.DIGEST_DAYS || '7', 10);
const TOP = parseInt(process.env.DIGEST_TOP || '5', 10);
const MIN_VIEWS = parseInt(process.env.DIGEST_MIN_VIEWS || '3', 10);

const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

function isoWeekId(d) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const week = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
    return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

function ruDate(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return `${d} ${MONTHS[m - 1]}`;
}

// 1. Запрос к GoatCounter: пути статей новостей и их помесячные просмотры за период
const since = new Date(Date.now() - DAYS * 86400000).toISOString().slice(0, 10);
let out;
try {
    out = execFileSync(GC_BIN, ['db', 'query', '-db', 'sqlite+' + GC_DB,
        `select p.path, s.stats from hit_stats s join paths p on p.path_id = s.path_id where s.day >= '${since}' and p.path like '/news/%'`],
        { encoding: 'utf8', timeout: 30000 });
} catch (e) {
    console.error('❌ goatcounter query failed:', e.message);
    process.exit(1);
}

// Формат: первая строка — заголовок, далее "path  [h0,h1,...]"; колонки — 2+ пробела
const views = new Map();
for (const line of out.split('\n')) {
    const m = line.match(/^(\S+)\s{2,}(\[[\d,]+\])$/);
    if (!m) continue;
    const p = m[1];
    const sum = m[2].slice(1, -1).split(',').reduce((a, b) => a + Number(b || 0), 0);
    views.set(p, (views.get(p) || 0) + sum);
}

// 2. Топ по base.json (исключаем сами дайджесты)
const base = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'base.json'), 'utf8'));
const byId = new Map(base.articles.map(a => [a.id, a]));
const ranked = [...views.entries()]
    .map(([p, v]) => ({ id: decodeURIComponent(p.replace(/^\/news\//, '').replace(/\/$/, '')), views: v }))
    .filter(x => x.views > 0 && byId.has(x.id))
    .sort((a, b) => b.views - a.views)
    .slice(0, TOP);

const totalViews = [...views.values()].reduce((a, b) => a + b, 0);
if (ranked.length < 3 || totalViews < MIN_VIEWS) {
    console.log(`📊 Недостаточно данных за ${DAYS} дн. (статей с просмотрами: ${ranked.length}, просмотров: ${totalViews}) — дайджест пропущен`);
    process.exit(0);
}

// 3. Готовим статью
const weekId = isoWeekId(new Date());
const digestId = `digest-${weekId}`;
const today = new Date().toISOString().slice(0, 10);
const range = `${ruDate(since)} — ${ruDate(today)}`;
const title = `Дайджест XaosLand #${weekId.split('W')[1]}: лучшие материалы за неделю`;
const image = (byId.get(ranked[0].id) || {}).image || '';

const items = ranked.map(({ id, views: v }, i) => {
    const a = byId.get(id);
    return `<li><strong><a href="/news/${id}/">${a.title.replace(/"/g, '&quot;')}</a></strong> — ${a.excerpt.slice(0, 140)}… <em>(просмотров за период: ${v})</em></li>`;
});

const md = `---
id: ${digestId}
category: Статьи
title: ${title}
excerpt: ${ranked.length} материалов, которые чаще всего читали на XaosLand за ${DAYS} дней (${range}).
date: ${today}
readTime: 3
featured: false
popular: false
tags: [дайджест, популярное]
image: "${image}"
metaTitle: "Дайджест #${weekId.split('W')[1]} — топ материалов"
metaDescription: "Лучшие материалы XaosLand за период ${range}: что читали больше всего."
---

<h2>Что читали на XaosLand на этой неделе</h2>
<p>Каждую неделю собираем самые популярные материалы по реальной статистике посещений. Период: <strong>${range}</strong>.</p>

<ol>
${items.join('\n')}
</ol>

<p>Статистика — собственная (GoatCounter, без внешних трекеров и куки), поэтому цифры честные и никого не преследуют.</p>
`;

// 4. Записываем md и обновляем base.json (upsert по id)
const digestDir = path.join(ROOT, 'data', 'content', 'articles');
fs.mkdirSync(digestDir, { recursive: true });
fs.writeFileSync(path.join(digestDir, `${digestId}.md`), md, 'utf8');
base.articles = base.articles.filter(a => a.id !== digestId);
base.articles.unshift({
    id: digestId,
    category: 'Статьи',
    title,
    excerpt: `${ranked.length} материалов, которые чаще всего читали на XaosLand за ${DAYS} дней (${range}).`,
    date: today,
    readTime: 3,
    featured: false,
    popular: false,
    tags: ['дайджест', 'популярное'],
    image,
    metaTitle: `Дайджест #${weekId.split('W')[1]} — топ материалов`,
    metaDescription: `Лучшие материалы XaosLand за период ${range}.`,
});
fs.writeFileSync(path.join(ROOT, 'data', 'base.json'), JSON.stringify(base, null, 2), 'utf8');

console.log(`✅ Дайджест ${digestId}: топ-${ranked.length} за ${DAYS} дн., всего просмотров новостей: ${totalViews}`);
ranked.forEach((r, i) => console.log(`   ${i + 1}. [${r.views}] ${r.id}`));
