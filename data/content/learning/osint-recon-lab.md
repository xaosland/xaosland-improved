---
id: osint-recon-lab
category: Обучение
title: OSINT: лаборатория проверки публичных данных о своей организации
excerpt: Строим воспроизводимый OSINT‑отчёт по собственному домену и публичным источникам: DNS, сертификаты, robots.txt и архивные упоминания.
date: 2026-09-17
readTime: 12
featured: false
popular: false
tags: [osint, разведка, приватность, лаборатория]
lab: true
labTools: [whois, dig, crt.sh, Amass]
labLevel: Начальный
image: ""
metaTitle: OSINT: лаборатория проверки публичных данных о своей организации
metaDescription: Строим воспроизводимый OSINT‑отчёт по собственному домену и публичным источникам: DNS, сертификаты, robots.txt и архивные упоминания.
source: xaosland
sourceUrl: https://xaosland.ru/learning/osint-recon-lab/
---

<div class="lab-notice"><strong>⚖️ Безопасность и законность.</strong> Выполняйте лабораторию только на своих устройствах, в изолированной виртуальной сети или при наличии письменного разрешения владельца. Не сканируйте, не перехватывайте и не атакуйте чужие системы, Wi‑Fi и домены. Примеры ниже намеренно используют localhost, тестовые стенды, собственные файлы и RFC 5737/документационные домены.</div>

<h2>Цель</h2><p>OSINT — это работа с открытыми данными, а не обход авторизации. В лаборатории собираем минимум сведений о собственном домене и учимся отделять факт от предположения. Не ищите людей, адреса и аккаунты без законной цели.</p><h2>1. Базовый профиль</h2><pre><code class="language-bash">sudo apt install -y whois dnsutils
export DOMAIN=example.com
whois "$DOMAIN" | tee whois.txt
dig A "$DOMAIN" +noall +answer
dig MX "$DOMAIN" +noall +answer
dig TXT "$DOMAIN" +noall +answer
curl -fsSL --max-time 10 "https://$DOMAIN/robots.txt" -o robots.txt || true</code></pre><p>Замените example.com на собственный домен. Если WHOIS скрывает данные — это результат, а не повод искать утечки.</p><h2>2. Сертификаты и связи</h2><p>Откройте <a href="https://crt.sh/">crt.sh</a>, введите <code>%.ваш-домен</code>, экспортируйте только относящиеся к вам имена и сопоставьте их с DNS. Проверку можно повторить через Amass в пассивном режиме.</p><pre><code class="language-bash">curl -sS "https://crt.sh/?q=%25.$DOMAIN&amp;output=json" | python3 -m json.tool &gt; certs.json || true
sha256sum whois.txt robots.txt certs.json</code></pre><h2>3. Отчёт и этика</h2><p>Для каждой находки укажите источник, время, URL, степень уверенности и действие владельца. Не делайте запросы к закрытым панелям, не регистрируйтесь под чужим именем и не публикуйте персональные данные. Очистите локальные файлы перед передачей отчёта.</p><p><a href="https://owasp.org/www-community/attacks/Information_Gathering">OWASP: Information Gathering</a> · <a href="https://crt.sh/">Certificate Transparency search</a></p>
