---
id: kali-nikto
category: Обучение
title: Nikto — Сканер безопасности веб-сервера
excerpt: Nikto — это подключаемый веб-сервер и CGI-сканер, написанный на Perl и использующий LibWhisker от RFP для выполнения быстрых проверок безопасности или информации.
date: 2026-09-17
readTime: 2
tags: [kali, сканирование и разведка]
featured: false
popular: false
image: ""
metaTitle: Nikto — Сканер безопасности веб-сервера
metaDescription: Nikto — это подключаемый веб-сервер и CGI-сканер, написанный на Perl и использующий LibWhisker от RFP для выполнения быстрых проверок безопасности или
source: kali.org
sourceUrl: https://www.kali.org/tools/nikto/
---

<h2>Что это</h2>
<p>Nikto — это подключаемый веб-сервер и CGI-сканер, написанный на Perl и использующий LibWhisker от RFP для выполнения быстрых проверок безопасности или информации.</p>
<details><summary>Оригинал описания (EN)</summary>
<p>Nikto is a pluggable web server and CGI scanner written in Perl, using rfp&rsquo;s LibWhisker to perform fast security or informational checks.</p>
</details>
<h2>Пример использования</h2>
<pre><code class="language-bash">root@kali:~# nikto -h

   Options:
       -Add-header         Add HTTP headers (can be used multiple times, one per header pair)
       -ask+               Whether to ask about submitting updates
                               yes   Ask about each (default)
                               no    Don't ask, don't send
                               auto  Don't ask, just send
       -check6             Check if IPv6 is working (connects to ipv6.google.com or value set in nikto.conf)
       -Cgidirs+           Scan these CGI dirs: "none", "all", or values like "/cgi/ /cgi-a/"
       -config+            Use this config file
       -Display+           Turn on/off display outputs:
                               1     Show redirects
                               2     Show cookies received
                               3     Show all 200/OK responses
                               4     Show URLs which require authentication
                               D     Debug output
                               E     Display all HTTP errors
                               P     Print progress to STDOUT
                               S     Scrub output of IPs and hostnames
                               V     Verbose output
       -dbcheck           Check database and other key files for syntax errors
       -evasion+          Encoding technique:
                               1     Random URI encoding (non-UTF8)
                               2     Directory self-reference (/./)
                               3     Premature URL ending
                               4     Prepend long random string
                               5     Fake parameter
                               6     TAB as request spacer
                               7     Change the case of the URL
              </code></pre>
<h2>Пакеты и установка</h2>
<h3>nikto</h3>
<p><strong>Сканер безопасности веб-сервера</strong><br>Установка: <code>sudo apt install nikto</code></p>
<h2>Официальная документация</h2>
<p><a href="https://www.kali.org/tools/nikto/" target="_blank" rel="noopener">https://www.kali.org/tools/nikto/</a></p>
