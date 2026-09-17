---
id: kali-p0f
category: Обучение
title: P0f — Пассивный инструмент для снятия отпечатков пальцев ОС
excerpt: p0f выполняет пассивное обнаружение ОС на основе пакетов SYN. В отличие от nmap и queso, p0f распознает без отправки каких-либо данных. Кроме того, он способен определять расстояние до удаленного хоста и может использоваться для определения
date: 2026-09-17
readTime: 2
tags: [kali, сканирование и разведка]
featured: false
popular: false
image: ""
metaTitle: P0f — Пассивный инструмент для снятия отпечатков пальцев ОС
metaDescription: p0f выполняет пассивное обнаружение ОС на основе пакетов SYN. В отличие от nmap и queso, p0f распознает без отправки каких-либо данных. Кроме того, он
source: kali.org
sourceUrl: https://www.kali.org/tools/p0f/
---

<h2>Что это</h2>
<p>p0f выполняет пассивное обнаружение ОС на основе пакетов SYN. В отличие от nmap и queso, p0f распознает без отправки каких-либо данных. Кроме того, он способен определять расстояние до удаленного хоста и может использоваться для определения структуры чужой или локальной сети. При работе на шлюзе сети он способен собирать огромные объемы данных и предоставлять полезную статистику. На пользовательском компьютере его можно использовать как мощное дополнение IDS. p0f поддерживает все выражения фильтрации в стиле tcpdump и имеет расширяемую и подробную базу данных для снятия отпечатков пальцев.</p>
<details><summary>Оригинал описания (EN)</summary>
<p>p0f performs passive OS detection based on SYN packets. Unlike nmap and queso, p0f does recognition without sending any data. Additionally, it is able to determine the distance to the remote host, and can be used to determine the structure of a foreign or local network. When running on the gateway of a network it is able to gather huge amounts of data and provide useful statistics. On a user-end computer it could be used as powerful IDS add-on. p0f supports full tcpdump-style filtering expressions, and has an extensible and detailed fingerprinting database.</p>
</details>
<h2>Пример использования</h2>
<pre><code class="language-bash">root@kali:~# p0f -h
p0f: invalid option -- 'h'
Usage: p0f [ ...options... ] [ 'filter rule' ]

Network interface options:

  -i iface  - listen on the specified network interface
  -r file   - read offline pcap data from a given file
  -p        - put the listening interface in promiscuous mode
  -L        - list all available interfaces

Operating mode and output settings:

  -f file   - read fingerprint database from 'file' (/etc/p0f/p0f.fp)
  -o file   - write information to the specified log file
  -s name   - answer to API queries at a named unix socket
  -u user   - switch to the specified unprivileged account and chroot
  -d        - fork into background (requires -o or -s)

Performance-related options:

  -S limit  - limit number of parallel API connections (20)
  -t c,h    - set connection / host cache age limits (30s,120m)
  -m c,h    - cap the number of active connections / hosts (1000,10000)

Optional filter expressions (man tcpdump) can be specified in the command
line to prevent p0f from looking at incidental network traffic.

Problems? You can reach the author at &lt;[email&#160;protected]>.</code></pre>
<h2>Пакеты и установка</h2>
<h3>p0f</h3>
<p><strong>Пассивный инструмент для снятия отпечатков пальцев ОС</strong><br>Установка: <code>sudo apt install p0f</code></p>
<h2>Официальная документация</h2>
<p><a href="https://www.kali.org/tools/p0f/" target="_blank" rel="noopener">https://www.kali.org/tools/p0f/</a></p>
