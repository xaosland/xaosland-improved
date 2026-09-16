#!/usr/bin/env node
// scripts/post-telegram.js — постинг свежих новостей XaosLand в Telegram-канал.
// Токен берётся ТОЛЬКО из env TELEGRAM_BOT_TOKEN (на VPS — файл /etc/xaosland/tg-token,
// который прокидывает обёртка xaosland-news.sh). В репозитории токена нет.
// Состояние постинга: data/tg-state.json (gitignored) — идемпотентно, дубли не пришлёт.

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.join(__dirname, '..');
const BASE_PATH = path.join(ROOT, 'data', 'base.json');
const STATE_PATH = path.join(ROOT, 'data', 'tg-state.json');

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT = process.env.NEWS_TG_CHAT || '-1002966275357';
const MAX_PER_RUN = parseInt(process.env.NEWS_TG_MAX_PER_RUN || '5', 10);
const SITE = 'https://xaosland.ru';

if (!TOKEN) {
    console.log('tg: TELEGRAM_BOT_TOKEN не задан — пропуск (это ок, пока бот не настроен)');
    process.exit(0);
}

function loadState() {
    try { return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8')); }
    catch { return { posted: {} }; }
}

function saveState(state) {
    fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), 'utf8');
}

function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function sendMessage(text) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify({
            chat_id: CHAT,
            text,
            parse_mode: 'HTML',
            link_preview_options: { is_disabled: false }
        });
        const req = https.request({
            hostname: 'api.telegram.org',
            path: `/bot${TOKEN}/sendMessage`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
            timeout: 20000,
        }, res => {
            let buf = '';
            res.on('data', d => { buf += d; });
            res.on('end', () => {
                try {
                    const j = JSON.parse(buf);
                    if (j.ok) resolve(j);
                    else reject(new Error('telegram: ' + buf.slice(0, 300)));
                } catch (e) { reject(new Error('telegram bad response: ' + buf.slice(0, 200))); }
            });
        });
        req.on('timeout', () => req.destroy(new Error('telegram timeout')));
        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

function formatMessage(a) {
    const link = `${SITE}/news/${a.id}/`;
    const excerpt = (a.excerpt || '').slice(0, 220).trim();
    const hashtags = (a.tags || [])
        .filter(t => t !== 'новости')
        .slice(0, 3)
        .map(t => '#' + String(t).replace(/\s+/g, '_'))
        .join(' ');
    let msg = `📰 <b>${esc(a.title)}</b>`;
    if (excerpt && excerpt !== a.title) msg += `\n\n${esc(excerpt)}…`;
    msg += `\n\n🔗 ${link}`;
    if (hashtags) msg += `\n${hashtags}`;
    if (msg.length > 3800) msg = msg.slice(0, 3800) + '…';
    return msg;
}

async function main() {
    const base = JSON.parse(fs.readFileSync(BASE_PATH, 'utf8'));
    const state = loadState();

    const news = base.articles
        .filter(a => a.category === 'Новости')
        .sort((x, y) => String(y.date).localeCompare(String(x.date)));

    const fresh = news.filter(a => !state.posted[a.id]).slice(0, MAX_PER_RUN);
    if (fresh.length === 0) {
        console.log('tg: ничего нового — пропуск');
        return;
    }
    console.log(`tg: к отправке ${fresh.length} из ${news.filter(a => !state.posted[a.id]).length} неопубликованных`);

    let sent = 0;
    for (const a of fresh) {
        try {
            await sendMessage(formatMessage(a));
            state.posted[a.id] = new Date().toISOString();
            sent++;
            console.log(`tg: ✅ ${a.id}`);
        } catch (e) {
            console.warn(`tg: ❌ ${a.id}: ${e.message}`);
            break; // например, бот не админ / сеть — не спамим ошибками дальше
        }
        await new Promise(r => setTimeout(r, 1500));
    }
    if (sent > 0) saveState(state);
    console.log(`tg: отправлено ${sent}`);
}

main().catch(e => { console.error('tg: ошибка:', e.message); process.exit(1); });
