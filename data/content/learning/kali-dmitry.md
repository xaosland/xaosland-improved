---
id: kali-dmitry
category: Обучение
title: Dmitry — Инструмент сбора информации Deepmagic
excerpt: Dmitry — это приложение командной строки UNIX/(GNU)Linux, написанное на C. Dmitry может находить возможные поддомены, адреса электронной почты, информацию о времени безотказной работы, выполнять сканирование TCP-портов, поиск Whois и многое
date: 2026-09-17
readTime: 2
tags: [kali, сканирование и разведка]
featured: false
popular: false
image: ""
metaTitle: Dmitry — Инструмент сбора информации Deepmagic
metaDescription: Dmitry — это приложение командной строки UNIX/(GNU)Linux, написанное на C. Dmitry может находить возможные поддомены, адреса электронной почты, информ
source: kali.org
sourceUrl: https://www.kali.org/tools/dmitry/
---

<h2>Что это</h2>
<p>Dmitry — это приложение командной строки UNIX/(GNU)Linux, написанное на C. Dmitry может находить возможные поддомены, адреса электронной почты, информацию о времени безотказной работы, выполнять сканирование TCP-портов, поиск Whois и многое другое.</p>
<details><summary>Оригинал описания (EN)</summary>
<p>DMitry is a UNIX/(GNU)Linux command line application written in C. DMitry can find possible subdomains, email addresses, uptime information, perform tcp port scan, whois lookups, and more.</p>
</details>
<h2>Пример использования</h2>
<pre><code class="language-bash">root@kali:~# dmitry -h
Deepmagic Information Gathering Tool
"There be some deep magic going on"

Usage: dmitry [-winsepfb] [-t 0-9] [-o %host.txt] host
  -o	 Save output to %host.txt or to file specified by -o file
  -i	 Perform a whois lookup on the IP address of a host
  -w	 Perform a whois lookup on the domain name of a host
  -n	 Retrieve Netcraft.com information on a host
  -s	 Perform a search for possible subdomains
  -e	 Perform a search for possible email addresses
  -p	 Perform a TCP port scan on a host
* -f	 Perform a TCP port scan on a host showing output reporting filtered ports
* -b	 Read in the banner received from the scanned port
* -t 0-9 Set the TTL in seconds when scanning a TCP port ( Default 2 )
*Requires the -p flagged to be passed</code></pre>
<h2>Пакеты и установка</h2>
<h3>dmitry</h3>
<p><strong>Инструмент сбора информации Deepmagic</strong><br>Установка: <code>sudo apt install dmitry</code></p>
<h2>Официальная документация</h2>
<p><a href="https://www.kali.org/tools/dmitry/" target="_blank" rel="noopener">https://www.kali.org/tools/dmitry/</a></p>
