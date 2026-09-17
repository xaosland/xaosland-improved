---
id: amass-dns-lab
category: Обучение
title: Amass и DNS: лаборатория пассивной разведки своего домена
excerpt: Разбираем DNS-записи и запускаем Amass в пассивном режиме на домене, которым вы владеете или который выдал преподаватель.
date: 2026-09-17
readTime: 12
featured: false
popular: false
tags: [amass, dns, osint, лаборатория]
lab: true
labTools: [Amass, dig, DNSViz]
labLevel: Начальный
image: ""
metaTitle: Amass и DNS: лаборатория пассивной разведки своего домена
metaDescription: Разбираем DNS-записи и запускаем Amass в пассивном режиме на домене, которым вы владеете или который выдал преподаватель.
source: xaosland
sourceUrl: https://xaosland.ru/learning/amass-dns-lab/
---

<div class="lab-notice"><strong>⚖️ Безопасность и законность.</strong> Выполняйте лабораторию только на своих устройствах, в изолированной виртуальной сети или при наличии письменного разрешения владельца. Не сканируйте, не перехватывайте и не атакуйте чужие системы, Wi‑Fi и домены. Примеры ниже намеренно используют localhost, тестовые стенды, собственные файлы и RFC 5737/документационные домены.</div>

<h2>Правила эксперимента</h2><p>Выберите свой домен или домен, явно выданный для обучения. Начинаем с пассивных источников: Amass не должен выполнять активное перечисление без отдельного разрешения.</p><h2>1. Инструменты</h2><pre><code class="language-bash">sudo apt install -y amass dnsutils
export DOMAIN=example.com
printf 'Проверяем только: %s\n' "$DOMAIN"
dig A "$DOMAIN" +short
dig MX "$DOMAIN" +short
dig TXT "$DOMAIN" +short</code></pre><h2>2. Пассивный сбор</h2><pre><code class="language-bash">mkdir -p lab-amass
amass enum -passive -d "$DOMAIN" -o lab-amass/subdomains.txt
sort -u lab-amass/subdomains.txt | tee lab-amass/subdomains-sorted.txt
while read -r host; do dig +short A "$host"; done &lt; lab-amass/subdomains-sorted.txt</code></pre><p>Пустой результат нормален: источники могут требовать API-ключи и иметь ограничения. Не перебирайте поддомены словарём и не запускайте <code>-active</code> в этой базовой лаборатории.</p><h2>3. Контроль качества</h2><p>Удалите домены третьих лиц, которые случайно попали в данные, проверьте каждую запись вручную и отметьте устаревшие A/CNAME. Для своего домена сопоставьте находки с DNS‑панелью и закройте забытые тестовые записи.</p><pre><code class="language-bash">sha256sum lab-amass/*
# пример проверки одного разрешённого узла
host -t A "$DOMAIN"</code></pre><p><a href="https://github.com/owasp-amass/amass">OWASP Amass</a> · <a href="https://www.isc.org/bind/">BIND utilities</a> · <a href="https://dnsviz.net/">DNSViz</a></p>
