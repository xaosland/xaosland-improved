#!/usr/bin/env node
// Публикует один практический материал/команду дня в Telegram.
// Идемпотентен: состояние хранится в data/tg-command-state.json (gitignored).
const fs = require('fs');
const path = require('path');
const https = require('https');
const ROOT = path.join(__dirname, '..');
const CHAT = process.env.NEWS_TG_CHAT || '-1003570459658';
const SITE = 'https://xaosland.ru';
const BASE = path.join(ROOT, 'data/base.json');
const STATE = path.join(ROOT, 'data/tg-command-state.json');
function token() { if (process.env.TELEGRAM_BOT_TOKEN) return process.env.TELEGRAM_BOT_TOKEN.trim(); try { return fs.readFileSync('/etc/xaosland/tg-token','utf8').trim(); } catch { return ''; } }
function esc(s) { return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function send(text) { return new Promise((resolve,reject) => { const body=JSON.stringify({chat_id:CHAT,text,parse_mode:'HTML'}); const req=https.request({hostname:'api.telegram.org',path:`/bot${token()}/sendMessage`,method:'POST',headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(body)},timeout:20000},res=>{let b='';res.on('data',d=>b+=d);res.on('end',()=>{try{const j=JSON.parse(b);j.ok?resolve(j):reject(new Error(b.slice(0,300)));}catch(e){reject(e);}})});req.on('error',reject);req.write(body);req.end(); }); }
function main() {
  if (!token()) { console.log('tg-command: токен не задан — пропуск'); return; }
  const base=JSON.parse(fs.readFileSync(BASE,'utf8')); let state={posted:{}}; try{state=JSON.parse(fs.readFileSync(STATE,'utf8'));}catch{}
  const candidates=base.articles.filter(a=>a.category==='Обучение' && (a.lab || a.id.startsWith('kali-') || a.id==='nmap-full-guide')).sort((a,b)=>String(a.date).localeCompare(String(b.date)) || a.id.localeCompare(b.id));
  const a=candidates.find(x=>!state.posted[x.id]); if(!a){console.log('tg-command: новых материалов нет');return;}
  const tag=(a.tags||[]).slice(0,2).map(x=>'#'+String(x).replace(/\s+/g,'_')).join(' ');
  const msg=`🧪 <b>Инструмент дня: ${esc(a.title)}</b>\n\n${esc((a.excerpt||'').slice(0,300))}\n\n🔗 ${SITE}/learning/${a.id}/\n${tag ? tag+' #команда_дня' : '#команда_дня'}\n\n⚖️ Только свои системы и разрешённые лаборатории.`;
  return send(msg).then(()=>{state.posted[a.id]=new Date().toISOString();fs.writeFileSync(STATE,JSON.stringify(state,null,2));console.log(`tg-command: ✅ ${a.id}`);});
}
Promise.resolve(main()).catch(e=>{console.error('tg-command: ❌',e.message);process.exit(1);});
