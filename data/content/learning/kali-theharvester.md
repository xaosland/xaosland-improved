---
id: kali-theharvester
category: Обучение
title: Theharvester — Инструмент для сбора учетных записей электронной почты и имен поддоменов из общедоступных источников.
excerpt: Пакет содержит инструмент для сбора имен поддоменов, адресов электронной почты, виртуальных хостов, открытых портов/баннеров и имен сотрудников из различных общедоступных источников (поисковые системы, серверы ключей pgp).
date: 2026-09-17
readTime: 2
tags: [kali, сканирование и разведка]
featured: false
popular: false
image: ""
metaTitle: Theharvester — Инструмент для сбора учетных записей электрон
metaDescription: Пакет содержит инструмент для сбора имен поддоменов, адресов электронной почты, виртуальных хостов, открытых портов/баннеров и имен сотрудников из раз
source: kali.org
sourceUrl: https://www.kali.org/tools/theharvester/
---

<h2>Что это</h2>
<p>Пакет содержит инструмент для сбора имен поддоменов, адресов электронной почты, виртуальных хостов, открытых портов/баннеров и имен сотрудников из различных общедоступных источников (поисковые системы, серверы ключей pgp).</p>
<details><summary>Оригинал описания (EN)</summary>
<p>The package contains a tool for gathering subdomain names, e-mail addresses, virtual hosts, open ports/ banners, and employee names from different public sources (search engines, pgp key servers).</p>
</details>
<h2>Пример использования</h2>
<pre><code class="language-bash">root@kali:~# restfulHarvest -h
usage: restfulHarvest [-h] [-H HOST] [-p PORT] [-l LOG_LEVEL] [-r]
                      [--rate-limit RATE_LIMIT]

options:
  -h, --help            show this help message and exit
  -H, --host HOST       IP address to listen on default is 127.0.0.1
  -p, --port PORT       Port to bind the web server to, default is 5000
  -l, --log-level LOG_LEVEL
                        Set logging level, default is info but
                        [critical|error|warning|info|debug|trace] can be set
  -r, --reload          Enable automatic reload used during development of the
                        api
  --rate-limit RATE_LIMIT
                        Set API rate limit (e.g., "10/minute", "100/hour"),
                        default is 5/minute</code></pre>
<h2>Пакеты и установка</h2>
<h3>theharvester</h3>
<p><strong>Tool for gathering e-mail accounts and subdomain names from public sources</strong><br>Установка: <code>sudo apt install theharvester</code></p>
<h2>Официальная документация</h2>
<p><a href="https://www.kali.org/tools/theharvester/" target="_blank" rel="noopener">https://www.kali.org/tools/theharvester/</a></p>
