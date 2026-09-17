---
id: kali-dnsenum
category: Обучение
title: Dnsenum — Инструмент для перечисления информации DNS домена
excerpt: Dnsenum — это многопоточный Perl-скрипт для перечисления информации DNS домена и обнаружения несмежных IP-блоков. Основная цель Dnsenum — собрать как можно больше информации о домене. На данный момент программа выполняет следующие операции:
date: 2026-09-17
readTime: 2
tags: [kali, сканирование и разведка]
featured: false
popular: false
image: ""
metaTitle: Dnsenum — Инструмент для перечисления информации DNS домена
metaDescription: Dnsenum — это многопоточный Perl-скрипт для перечисления информации DNS домена и обнаружения несмежных IP-блоков. Основная цель Dnsenum — собрать как 
source: kali.org
sourceUrl: https://www.kali.org/tools/dnsenum/
---

<h2>Что это</h2>
<p>Dnsenum — это многопоточный Perl-скрипт для перечисления информации DNS домена и обнаружения несмежных IP-блоков. Основная цель Dnsenum — собрать как можно больше информации о домене. На данный момент программа выполняет следующие операции:</p>
<details><summary>Оригинал описания (EN)</summary>
<p>Dnsenum is a multithreaded perl script to enumerate DNS information of a domain and to discover non-contiguous ip blocks. The main purpose of Dnsenum is to gather as much information as possible about a domain. The program currently performs the following operations:</p>
</details>
<h2>Пример использования</h2>
<pre><code class="language-bash">root@kali:~# dnsenum -h
dnsenum VERSION:1.3.1
Usage: dnsenum [Options] &lt;domain>
[Options]:
Note: If no -f tag supplied will default to /usr/share/dnsenum/dns.txt or
the dns.txt file in the same directory as dnsenum
GENERAL OPTIONS:
  --dnsserver 	&lt;server>
			Use this DNS server for A, NS and MX queries.
  --enum		Shortcut option equivalent to --threads 5 -s 15 -w.
  -h, --help		Print this help message.
  --noreverse		Skip the reverse lookup operations.
  --nocolor		Disable ANSIColor output.
  --private		Show and save private ips at the end of the file domain_ips.txt.
  --subfile &lt;file>	Write all valid subdomains to this file.
  -t, --timeout &lt;value>	The tcp and udp timeout values in seconds (default: 10s).
  --threads &lt;value>	The number of threads that will perform different queries.
  -v, --verbose		Be verbose: show all the progress and all the error messages.
GOOGLE SCRAPING OPTIONS:
  -p, --pages &lt;value>	The number of google search pages to process when scraping names,
			the default is 5 pages, the -s switch must be specified.
  -s, --scrap &lt;value>	The maximum number of subdomains that will be scraped from Google (default 15).
BRUTE FORCE OPTIONS:
  -f, --file &lt;file>	Read subdomains from this file to perform brute force. (Takes priority over default dns.txt)
  -u, --update	&lt;a|g|r|z>
			Update the file specified with the -f switch with valid subdomains.
	a (all)		Update using all results.
	g		Update using only google scraping results.
	r		Update using only reverse lookup results.
	z		Update using only zonetransfer results.
  -r, --recursion	Recursion on subdomains, brute force all discovered subdomains that have an NS record.
WHOIS NETRANGE OPTIONS:
  -d, --delay &lt;value>	The maximum value of seconds to wait between whois queries, the value is defined randomly, defaul</code></pre>
<h2>Пакеты и установка</h2>
<h3>dnsenum</h3>
<p><strong>Инструмент для перечисления информации DNS домена</strong><br>Установка: <code>sudo apt install dnsenum</code></p>
<h2>Официальная документация</h2>
<p><a href="https://www.kali.org/tools/dnsenum/" target="_blank" rel="noopener">https://www.kali.org/tools/dnsenum/</a></p>
