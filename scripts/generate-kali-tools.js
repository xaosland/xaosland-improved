#!/usr/bin/env node
// scripts/generate-kali-tools.js — база знаний «Kali Linux: все инструменты».
// Источник: kali.org/tools (официальная документация инструментов).
// Для каждого инструмента: описание (RU+оригинал EN), пример использования,
// пакеты и команды установки. Категория — по ключевым словам.
// Режим: resumable (data/kali-state.json), батчами: node generate-kali-tools.js [N]
// N = сколько НОВЫХ инструментов обработать за прогон (по умолчанию 50).

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'data', 'content', 'learning');
const BASE_PATH = path.join(ROOT, 'data', 'base.json');
const STATE_PATH = path.join(ROOT, 'data', 'kali-state.json');
const BATCH = parseInt(process.argv[2] || '50', 10);
const DELAY = 350; // мс между запросами к kali.org
const TR_DELAY = 350; // мс между запросами к переводчику
const SITE = 'https://www.kali.org/tools';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36';

// ---------------- Категории (по ключевым словам slug/описания) ----------------
const CATEGORIES = [
    { tag: 'сканирование и разведка', kw: ['nmap', 'scan', 'recon', 'enumerat', 'fingerprint', 'discover', 'snmp', 'dns', 'whois', 'theharvester', 'maltego', 'spiderfoot', 'sublist3r', 'masscan', 'zenmap', 'amap', 'hping', 'netdiscover', 'fping', 'arping', 'unicornscan', 'dmitry', 'dnswalk', 'fierce', 'dnsrecon', 'dnsenum', 'ident-user-enum', 'onesixtyone', 'osrintr', 'proteus', 'tls' ] },
    { tag: 'веб-уязвимости', kw: ['sqlmap', 'nikto', 'dirb', 'dirbuster', 'gobuster', 'wfuzz', 'ffuf', 'wpscan', 'joomscan', 'whatweb', 'wapiti', 'burpsuite', 'commix', 'arjun', 'wafw00f', 'padbuster', 'paros', 'skipfish', 'uniscan', 'vega', 'webscarab', 'xsser', 'davtest', 'fuzz', 'cms-explorer', 'plecost', 'sslscan', 'sslyze', 'tlssled', 'halberd', 'idswakeup' ] },
    { tag: 'подбор паролей', kw: ['hydra', 'john', 'hashcat', 'medusa', 'cewl', 'crunch', 'patator', 'ophcrack', 'hashid', 'hash-identifier', 'wordlists', 'maskprocessor', 'pack', 'rainbowcrack', 'sqldict', 'thc-pptp', 'brute', 'chntpw', 'crack', 'dictstat', 'findmyhash', 'gpp-decrypt', 'hashcat', 'keimpx', 'multiforcer', 'password', 'princeprocessor', 'statsprocessor', 'truecrack', 'wce', 'chntpw' ] },
    { tag: 'wi-fi и ради', kw: ['aircrack', 'airgeddon', 'wifite', 'fern', 'bully', 'reaver', 'pixiewps', 'kismet', 'mdk3', 'mdk4', 'asleap', 'bluelog', 'bluemaho', 'btscanner', 'coWPAtty', 'crackle', 'eapmd5pass', 'fernet', 'ghost', 'gnuradio', 'hackrf', 'hostapd', 'irda', 'killerbee', 'mfcuk', 'mfoc', 'mifare', 'nfc', 'rfid', 'radiotap', 'spooftooph', 'wiffy', 'wireshark-' ] },
    { tag: 'эксплойты', kw: ['metasploit', 'exploitdb', 'searchsploit', 'armitage', 'beef', 'beesu', 'cisco', 'exploit', 'msf', 'shellter', 'termineter', 'unix-privesc' ] },
    { tag: 'сниффинг и спуфинг', kw: ['wireshark', 'tcpdump', 'ettercap', 'bettercap', 'dsniff', 'responder', 'arpspoof', 'macchanger', 'netsniff', 'darkstat', 'driftnet', 'hexinject', 'isc-dhcp', 'mitm', 'netsed', 'ptunnel', 'sniff', 'ssldump', 'sslh', 'sslstrip', 'sslstrip2', 'tcpreplay', 'urlsnarf', 'webmitm', 'webspy', 'wifi-honey', 'dns2tcp', 'evilgrade' ] },
    { tag: 'форензика', kw: ['autopsy', 'sleuth', 'foremost', 'binwalk', 'volatility', 'testdisk', 'chkrootkit', 'dc3dd', 'dcfldd', 'ddrescue', 'extundelete', 'forensic', 'galleta', 'guymager', 'hashdeep', 'initial-access', 'mac-robber', 'magicrescue', 'memfetch', 'pasco', 'p0f', 'rifiuti', 'safe-copy', 'scalpel', 'scrounge', 'srch_strings', 'volafox', 'windows-privesc' ] },
    { tag: 'реверс и анализ', kw: ['apktool', 'jadx', 'gdb', 'ghidra', 'radare', 'ollydbg', 'ida', 'strace', 'ltrace', 'exeinfo', 'pyew', 'bdasm', 'bokken', 'clasm', 'elf', 'javasnoop', 'jd-gui', 'oletools', 'peda', 'peek', 'rex', 'viddy', 'yara' ] },
    { tag: 'нагрузка и стресс', kw: ['slowhttptest', 'thc-ssl-dos', 'hping3-', 'doomsday', 'goldeneye', 'torshammer' ] },
    { tag: 'соц-инженерия', kw: ['social-engineering', 'king-phisher', 'phish', 'setoolkit' ] },
    { tag: 'утилиты', kw: [] }, // fallback
];

function categoryFor(slug, desc) {
    const hay = (slug + ' ' + desc).toLowerCase();
    for (const c of CATEGORIES) {
        if (c.kw.some(k => hay.includes(k))) return c.tag;
    }
    return 'утилиты';
}

// ---------------- Утилиты ----------------
function loadJson(f, fb) { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return fb; } }
function saveJson(f, o) { fs.writeFileSync(f, JSON.stringify(o, null, 2)); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function stripTags(s) {
    return String(s || '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ').trim();
}
async function fetchText(url) {
    const res = await fetch(url, { signal: AbortSignal.timeout(25000), headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.text();
}

// ---------------- Перевод en→ru (тот же эндпоинт, что в новостях) ----------------
let lastTr = 0;
async function tr(text) {
    if (!text) return '';
    const clean = String(text).slice(0, 1200);
    const wait = lastTr + TR_DELAY - Date.now();
    if (wait > 0) await sleep(wait);
    lastTr = Date.now();
    try {
        const url = 'https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=en&tl=ru&q=' + encodeURIComponent(clean);
        const res = await fetch(url, { signal: AbortSignal.timeout(15000), headers: { 'User-Agent': UA } });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        if (Array.isArray(data)) {
            if (typeof data[0] === 'string') return data.join('');
            if (Array.isArray(data[0])) return data.map(x => (Array.isArray(x) ? x[0] : x)).join('');
        }
        return '';
    } catch (e) {
        console.warn(`   ⚠️ перевод не удался: ${e.message}`);
        return '';
    }
}

// ---------------- Парсинг страницы инструмента ----------------
function parseToolPage(html, slug) {
    const out = { slug, short: '', long: '', usage: '', packages: [] };

    // Главный блок: <h3 id=SLUG>SLUG</h3><p><strong>SHORT</strong><br>LONG</p>
    const mainRe = new RegExp(`<h3 id=${slug}>[^<]*</h3>\\s*<p><strong>(.*?)</strong>\\s*<br\\s*/?>(.*?)</p>`, 's');
    const main = mainRe.exec(html);
    if (main) {
        out.short = stripTags(main[1]);
        out.long = stripTags(main[2]);
    }

    // Пример использования: <h2 id=SLUG-usage-example>…</h2> … <pre…><code>…</code></pre>
    const usageRe = new RegExp(`<h2 id=${slug}-usage-example>[\\s\\S]*?<pre[^>]*><code>([\\s\\S]*?)</code></pre>`, 'i');
    const usage = usageRe.exec(html);
    if (usage) {
        out.usage = usage[1]
            .replace(/<[^>]+>/g, '')
            .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'")
            .trim().slice(0, 1800);
    }

    // Пакеты: секция после <h1 id=packages-and-binaries>
    const pkgStart = html.indexOf('id=packages-and-binaries');
    if (pkgStart > 0) {
        const pkgHtml = html.slice(pkgStart);
        const pkgRe = /<h3 id=([a-z0-9-]+)>[^<]*<\/h3>\s*<p><strong>([\s\S]*?)<\/strong>\s*<br\s*\/?>([\s\S]*?)<\/p>/g;
        let m;
        while ((m = pkgRe.exec(pkgHtml)) !== null) {
            const longRaw = m[3];
            const size = /Installed size:<\/strong> <code>(.*?)<\/code>/.exec(longRaw);
            const install = /How to install:<\/strong> <code>(.*?)<\/code>/.exec(longRaw);
            out.packages.push({
                name: m[1],
                short: stripTags(m[2]),
                size: size ? size[1] : '',
                install: install ? install[1] : `sudo apt install ${m[1]}`,
            });
        }
    }
    return out;
}

// ---------------- Главная ----------------
async function main() {
    const state = loadJson(STATE_PATH, { done: {} });
    const base = JSON.parse(fs.readFileSync(BASE_PATH, 'utf8'));
    if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

    // Список слагов: top-100 приоритетно, затем весь каталог.
    // На kali.org href без кавычек: href=https://www.kali.org/tools/NAME/
    let slugs = [];
    try {
        const topHtml = await fetchText(`${SITE}/top-100/`);
        slugs = [...new Set([...topHtml.matchAll(/kali\.org\/tools\/([a-z0-9-]+)\//g)].map(m => m[1]))]
            .filter(s => s !== 'all-tools' && s !== 'top-100');
        console.log(`📋 top-100: ${slugs.length} инструментов`);
    } catch (e) {
        console.error('❌ не получил top-100:', e.message);
    }
    if (slugs.length < 50) {
        const allHtml = await fetchText(`${SITE}/all-tools/`);
        const all = [...new Set([...allHtml.matchAll(/kali\.org\/tools\/([a-z0-9-]+)\//g)].map(m => m[1]))]
            .filter(s => s !== 'all-tools' && s !== 'top-100');
        slugs = [...new Set([...slugs, ...all])];
        console.log(`📋 весь каталог: ${slugs.length} инструментов`);
    }

    const existing = new Set(base.articles.map(a => a.id));
    const queue = slugs.filter(s => !state.done[s] && !existing.has('kali-' + s));
    console.log(`🆕 к обработке: ${queue.length} (лимит батча ${BATCH})`);
    const batch = queue.slice(0, BATCH);

    let added = 0, skipped = 0;
    for (const slug of batch) {
        try {
            const html = await fetchText(`${SITE}/${slug}/`);
            const t = parseToolPage(html, slug);
            if (!t.long || t.long.length < 40) {
                console.warn(`   ⛔ нет описания: ${slug}`);
                state.done[slug] = 'empty';
                saveJson(STATE_PATH, state);
                skipped++;
                await sleep(DELAY);
                continue;
            }

            const id = 'kali-' + slug;
            const catTag = categoryFor(slug, t.short + ' ' + t.long);
            const namePretty = slug.charAt(0).toUpperCase() + slug.slice(1);

            // Переводы
            const shortRu = await tr(t.short);
            const longRu = await tr(t.long);

            const title = `${namePretty} — ${shortRu || t.short}`;
            const excerpt = (longRu || t.long).slice(0, 240);

            // Тело статьи
            let body = `<h2>Что это</h2>\n<p>${longRu || t.long}</p>`;
            if (t.long && longRu) {
                body += `\n<details><summary>Оригинал описания (EN)</summary>\n<p>${t.long}</p>\n</details>`;
            }
            if (t.usage) {
                body += `\n<h2>Пример использования</h2>\n<pre><code class="language-bash">${t.usage.replace(/</g, '&lt;')}</code></pre>`;
            }
            if (t.packages.length) {
                body += '\n<h2>Пакеты и установка</h2>';
                for (const p of t.packages) {
                    const pShortRu = await tr(p.short);
                    body += `\n<h3>${p.name}</h3>\n<p><strong>${pShortRu || p.short}</strong><br>${p.install ? `Установка: <code>${p.install}</code>` : ''}${p.size ? ` (размер: ${p.size})` : ''}</p>`;
                }
            }
            body += `\n<h2>Официальная документация</h2>\n<p><a href="${SITE}/${slug}/" target="_blank" rel="noopener">${SITE}/${slug}/</a></p>`;

            const fm = [
                '---',
                `id: ${id}`,
                'category: Обучение',
                `title: ${title.replace(/"/g, "'").slice(0, 150)}`,
                `excerpt: ${excerpt.replace(/"/g, "'")}`,
                `date: ${new Date().toISOString().slice(0, 10)}`,
                `readTime: ${Math.max(2, Math.round((t.long.length + t.usage.length) / 1200))}`,
                `tags: [kali, ${catTag}]`,
                'featured: false',
                'popular: false',
                'image: ""',
                `metaTitle: ${title.replace(/"/g, "'").slice(0, 60)}`,
                `metaDescription: ${excerpt.replace(/"/g, "'").slice(0, 150)}`,
                `source: kali.org`,
                `sourceUrl: ${SITE}/${slug}/`,
                '---',
                '',
            ];
            fs.writeFileSync(path.join(OUT_DIR, `${id}.md`), fm.join('\n') + '\n' + body + '\n', 'utf8');

            base.articles.unshift({
                id,
                category: 'Обучение',
                title,
                excerpt,
                date: new Date().toISOString().slice(0, 10),
                readTime: Math.max(2, Math.round((t.long.length + t.usage.length) / 1200)),
                featured: false,
                popular: false,
                tags: ['kali', catTag],
                image: '',
                metaTitle: title.slice(0, 60),
                metaDescription: excerpt.slice(0, 150),
                source: 'kali.org',
                sourceUrl: `${SITE}/${slug}/`,
            });
            state.done[slug] = 'ok';
            added++;
            console.log(`   ✅ ${slug} [${catTag}]${t.usage ? ' +usage' : ''} +${t.packages.length} пакетов`);
            saveJson(STATE_PATH, state);
            saveJson(BASE_PATH, base);
            await sleep(DELAY);
        } catch (e) {
            console.warn(`   ⚠️ ${slug}: ${e.message}`);
            await sleep(DELAY);
        }
    }

    saveJson(BASE_PATH, base);
    saveJson(STATE_PATH, state);
    console.log(`✅ Батч завершён: добавлено ${added}, пропущено ${skipped}, всего статей: ${base.articles.length}`);
}

main().catch(e => { console.error('❌', e); process.exit(1); });
