---
id: kali-sqlmap
category: Обучение
title: Sqlmap — Инструмент автоматического внедрения SQL
excerpt: Целью sqlmap является обнаружение и использование уязвимостей SQL-инъекций в веб-приложениях. Как только он обнаружит одну или несколько SQL-инъекций на целевом хосте, пользователь может выбрать один из множества вариантов, чтобы выполнить 
date: 2026-09-17
readTime: 2
tags: [kali, сканирование и разведка]
featured: false
popular: false
image: ""
metaTitle: Sqlmap — Инструмент автоматического внедрения SQL
metaDescription: Целью sqlmap является обнаружение и использование уязвимостей SQL-инъекций в веб-приложениях. Как только он обнаружит одну или несколько SQL-инъекций 
source: kali.org
sourceUrl: https://www.kali.org/tools/sqlmap/
---

<h2>Что это</h2>
<p>Целью sqlmap является обнаружение и использование уязвимостей SQL-инъекций в веб-приложениях. Как только он обнаружит одну или несколько SQL-инъекций на целевом хосте, пользователь может выбрать один из множества вариантов, чтобы выполнить обширную внутреннюю проверку отпечатков пальцев системы управления базами данных, получить пользователя и базу данных сеанса СУБД, перечислить пользователей, хэши паролей, привилегии, базы данных, выгрузить целиком или определенные пользователем таблицы/столбцы СУБД, запустить свой собственный оператор SQL, прочитать определенные файлы в файловой системе и многое другое.</p>
<details><summary>Оригинал описания (EN)</summary>
<p>sqlmap goal is to detect and take advantage of SQL injection vulnerabilities in web applications. Once it detects one or more SQL injections on the target host, the user can choose among a variety of options to perform an extensive back-end database management system fingerprint, retrieve DBMS session user and database, enumerate users, password hashes, privileges, databases, dump entire or user&rsquo;s specific DBMS tables/columns, run his own SQL statement, read specific files on the file system and more.</p>
</details>
<h2>Пример использования</h2>
<pre><code class="language-bash">root@kali:~# sqlmap -h
        ___
       __H__
 ___ ___[,]_____ ___ ___  {1.10.8#stable}
|_ -| . ["]     | .'| . |
|___|_  [.]_|_|_|__,|  _|
      |_|V...       |_|   https://sqlmap.org

Usage: python3 sqlmap [options]

Options:
  -h, --help            Show basic help message and exit
  -hh                   Show advanced help message and exit
  --version             Show program's version number and exit
  -v VERBOSE            Verbosity level: 0-6 (default 1)

  Target:
    At least one of these options has to be provided to define the
    target(s)

    -u URL, --url=URL   Target URL (e.g. "http://www.site.com/vuln.php?id=1")
    -g GOOGLEDORK       Process Google dork results as target URLs

  Request:
    These options can be used to specify how to connect to the target URL

    --data=DATA         Data string to be sent through POST (e.g. "id=1")
    --cookie=COOKIE     HTTP Cookie header value (e.g. "PHPSESSID=a8d127e..")
    --random-agent      Use randomly selected HTTP User-Agent header value
    --proxy=PROXY       Use a proxy to connect to the target URL
    --tor               Use Tor anonymity network
    --check-tor         Check to see if Tor is used properly

  Injection:
    These options can be used to specify which parameters to test for,
    provide custom injection payloads and optional tampering scripts

    -p TESTPARAMETER    Testable parameter(s)
    --dbms=DBMS         Force back-end DBMS to provided value

  Detection:
    These options can be used to customize the detection phase

    --level=LEVEL       Level of tests to perform (1-5, default 1)
    --risk=RISK         Risk of tests to perform (1-3, default 1)

  Techniques:
    These options can be used to tweak testing of specific SQL injection
    techniques

    --technique=TECH..  SQL</code></pre>
<h2>Пакеты и установка</h2>
<h3>sqlmap</h3>
<p><strong>Инструмент автоматического внедрения SQL</strong><br>Установка: <code>sudo apt install sqlmap</code></p>
<h2>Официальная документация</h2>
<p><a href="https://www.kali.org/tools/sqlmap/" target="_blank" rel="noopener">https://www.kali.org/tools/sqlmap/</a></p>
