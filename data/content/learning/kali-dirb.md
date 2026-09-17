---
id: kali-dirb
category: Обучение
title: Dirb — Инструмент для подбора URL-адресов
excerpt: DIRB — сканер веб-контента. Он ищет существующие (и/или скрытые) веб-объекты. По сути, он работает путем запуска атаки на веб-сервер на основе словаря и анализа ответов.
date: 2026-09-17
readTime: 2
tags: [kali, сканирование и разведка]
featured: false
popular: false
image: ""
metaTitle: Dirb — Инструмент для подбора URL-адресов
metaDescription: DIRB — сканер веб-контента. Он ищет существующие (и/или скрытые) веб-объекты. По сути, он работает путем запуска атаки на веб-сервер на основе словаря
source: kali.org
sourceUrl: https://www.kali.org/tools/dirb/
---

<h2>Что это</h2>
<p>DIRB — сканер веб-контента. Он ищет существующие (и/или скрытые) веб-объекты. По сути, он работает путем запуска атаки на веб-сервер на основе словаря и анализа ответов.</p>
<details><summary>Оригинал описания (EN)</summary>
<p>DIRB is a Web Content Scanner. It looks for existing (and/or hidden) Web Objects. It basically works by launching a dictionary based attack against a web server and analyzing the responses.</p>
</details>
<h2>Пример использования</h2>
<pre><code class="language-bash">root@kali:~# man dirb
DIRB(1)                     General Commands Manual                     DIRB(1)

NAME
     dirb - Web Content Scanner

SYNOPSIS
     dirb &lt;url_base> &lt;url_base> [&lt;wordlist_file(s)>] [options]

DESCRIPTION
     DIRB  IS  a Web Content Scanner. It looks for existing (and/or hidden) Web
     Objects. It basically  works  by  launching  a  dictionary  basesd  attack
     against a web server and analizing the response.

OPTIONS
     -a &lt;agent_string>
            Specify your custom USER_AGENT.  (Default is: "Mozilla/4.0 (compat-
            ible; MSIE 6.0; Windows NT 5.1)")

     -b     Don't squash or merge sequences of /../ or /./ in the given URL.

     -c &lt;cookie_string>
            Set a cookie for the HTTP request.

     -E &lt;certificate>
            Use the specified client certificate file.

     -f     Fine tunning of NOT_FOUND (404) detection.

     -H &lt;header_string>
            Add a custom header to the HTTP request.

     -i     Use case-insensitive Search.

     -l     Print "Location" header when found.

     -N &lt;nf_code>
            Ignore responses with this HTTP code.

     -o &lt;output_file>
            Save output to disk.

     -p &lt;proxy[:port]>
            Use this proxy. (Default port is 1080)

     -P &lt;proxy_username:proxy_password>
            Proxy Authentication.

     -r     Don't Search Recursively.

     -R     Interactive Recursion.  (Ask in which directories you want to scan)

     -S     Silent Mode. Don't show tested words. (For dumb terminals)

     -t     Don't force an ending '/' on URLs.

     -u &lt;username:password>
            Username and password to use.

     -v     Show Also Not Existent Pages.

     -w     Don't Stop on WARNING messages.

     -x &lt;extensions_file>
            Amplify search with the extensions o</code></pre>
<h2>Пакеты и установка</h2>
<h3>dirb</h3>
<p><strong>Инструмент для подбора URL-адресов</strong><br>Установка: <code>sudo apt install dirb</code></p>
<h2>Официальная документация</h2>
<p><a href="https://www.kali.org/tools/dirb/" target="_blank" rel="noopener">https://www.kali.org/tools/dirb/</a></p>
