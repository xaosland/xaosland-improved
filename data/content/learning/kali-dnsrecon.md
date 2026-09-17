---
id: kali-dnsrecon
category: Обучение
title: Dnsrecon — Мощный скрипт перечисления DNS
excerpt: DNSRecon — это скрипт Python, который предоставляет возможность выполнять:
date: 2026-09-17
readTime: 2
tags: [kali, сканирование и разведка]
featured: false
popular: false
image: ""
metaTitle: Dnsrecon — Мощный скрипт перечисления DNS
metaDescription: DNSRecon — это скрипт Python, который предоставляет возможность выполнять:
source: kali.org
sourceUrl: https://www.kali.org/tools/dnsrecon/
---

<h2>Что это</h2>
<p>DNSRecon — это скрипт Python, который предоставляет возможность выполнять:</p>
<details><summary>Оригинал описания (EN)</summary>
<p>DNSRecon is a Python script that provides the ability to perform:</p>
</details>
<h2>Пример использования</h2>
<pre><code class="language-bash">root@kali:~# dnsrecon -h
usage: dnsrecon [-h] [-d DOMAIN] [-iL INPUT_LIST] [-n NS_SERVER] [-r RANGE]
                [-D DICTIONARY] [-f] [-a] [-s] [-b] [-y] [-k] [-w] [--shodan]
                [--shodan-active] [--shodan-key SHODAN_KEY] [-z]
                [--threads THREADS] [--lifetime LIFETIME]
                [--loglevel {DEBUG,INFO,WARNING,ERROR,CRITICAL}] [--tcp]
                [--db DB] [-x XML] [-c CSV] [-j JSON] [--iw]
                [--disable_check_nxdomain] [--disable_check_recursion]
                [--disable_recurs] [--disable_check_bindversion] [-V] [-v]
                [-t TYPE]

options:
  -h, --help            show this help message and exit
  -d, --domain DOMAIN   Target domain.
  -iL, --input-list INPUT_LIST
                        File containing a list of domains to perform DNS enumeration on, one per line.
  -n, --name_server NS_SERVER
                        Domain server to use. If none is given, the SOA of the target will be used. Multiple servers can be specified using a comma separated list.
  -r, --range RANGE     IP range for reverse lookup brute force in formats (first-last) or in (range/bitmask).
  -D, --dictionary DICTIONARY
                        Dictionary file of subdomain and hostnames to use for brute force.
  -f                    Filter out of brute force domain lookup, records that resolve to the wildcard defined IP address when saving records.
  -a                    Perform AXFR with standard enumeration.
  -s                    Perform a reverse lookup of IPv4 ranges in the SPF record with standard enumeration.
  -b                    Perform Bing enumeration with standard enumeration.
  -y                    Perform Yandex enumeration with standard enumeration.
  -k                    Perform crt.sh enumeration with st</code></pre>
<h2>Пакеты и установка</h2>
<h3>dnsrecon</h3>
<p><strong>Мощный скрипт перечисления DNS</strong><br>Установка: <code>sudo apt install dnsrecon</code></p>
<h2>Официальная документация</h2>
<p><a href="https://www.kali.org/tools/dnsrecon/" target="_blank" rel="noopener">https://www.kali.org/tools/dnsrecon/</a></p>
