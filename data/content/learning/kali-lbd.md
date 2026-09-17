---
id: kali-lbd
category: Обучение
title: Lbd — Детектор балансировки нагрузки
excerpt: Проверяет, использует ли данный домен балансировку нагрузки.
date: 2026-09-17
readTime: 2
tags: [kali, утилиты]
featured: false
popular: false
image: ""
metaTitle: Lbd — Детектор балансировки нагрузки
metaDescription: Проверяет, использует ли данный домен балансировку нагрузки.
source: kali.org
sourceUrl: https://www.kali.org/tools/lbd/
---

<h2>Что это</h2>
<p>Проверяет, использует ли данный домен балансировку нагрузки.</p>
<details><summary>Оригинал описания (EN)</summary>
<p>Checks if a given domain uses load-balancing.</p>
</details>
<h2>Пример использования</h2>
<pre><code class="language-bash">root@kali:~# lbd -h
host: illegal option -- h
Usage: host [-aCdilrTvVw] [-c class] [-N ndots] [-t type] [-W time]
            [-R number] [-m flag] [-p port] hostname [server]
       -a is equivalent to -v -t ANY
       -A is like -a but omits RRSIG, NSEC, NSEC3
       -c specifies query class for non-IN data
       -C compares SOA records on authoritative nameservers
       -d is equivalent to -v
       -l lists all hosts in a domain, using AXFR
       -m set memory debugging flag (trace|record|usage)
       -N changes the number of dots allowed before root lookup is done
       -p specifies the port on the server to query
       -r disables recursive processing
       -R specifies number of retries for UDP packets
       -s a SERVFAIL response should stop query
       -t specifies the query type
       -T enables TCP/IP mode
       -U enables UDP mode
       -v enables verbose output
       -V print version number and exit
       -w specifies to wait forever for a reply
       -W specifies how long to wait for a reply
       -4 use IPv4 query transport only
       -6 use IPv6 query transport only</code></pre>
<h2>Пакеты и установка</h2>
<h3>lbd</h3>
<p><strong>Детектор балансировки нагрузки</strong><br>Установка: <code>sudo apt install lbd</code></p>
<h2>Официальная документация</h2>
<p><a href="https://www.kali.org/tools/lbd/" target="_blank" rel="noopener">https://www.kali.org/tools/lbd/</a></p>
