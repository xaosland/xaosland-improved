---
id: nmap-full-guide
category: Обучение
title: Nmap: полный разбор команд — от первого скана до продвинутых техник
excerpt: Все ключевые опции Nmap на практике: типы сканирования, обнаружение сервисов и ОС, скрипты NSE, скорость, обход файрволов и готовые рецепты.
date: 2026-09-17
readTime: 14
featured: true
popular: true
tags: [kali, nmap, сканирование и разведка]
image: ""
metaTitle: "Nmap: полный разбор команд"
metaDescription: "Полный практический разбор Nmap: -sS, -sV, -O, -A, NSE-скрипты, тайминги, обход файрволов и готовые рецепты команд."
source: xaosland
sourceUrl: https://xaosland.ru/learning/nmap-full-guide/
---

<h2>Что такое Nmap</h2>
<p>Nmap (Network Mapper) — стандарт де-факто для сканирования сетей: определяет живые хосты, открытые порты, версии сервисов, операционные системы и даже уязвимости (через скрипты NSE). Установлен в Kali по умолчанию, есть на любой платформе.</p>
<p>Базовый синтаксис: <code>nmap [типы сканирования] [опции] цель</code>. Цель — IP, диапазон (<code>192.168.1.0/24</code>), список через запятую или файл (<code>-iL targets.txt</code>).</p>

<h2>1. Обнаружение хостов (кто живой)</h2>
<pre><code class="language-bash">nmap -sn 192.168.1.0/24          # только пинг-свип, без скана портов (быстро)
nmap -sL 192.168.1.0/24          # только перечислить цели (без пакетов)
nmap -Pn 192.168.1.10            # считать хост живым, не пинговать (для хостов за файрволом)
nmap -PE -PP -PM 192.168.1.10    # ICMP echo + timestamp + netmask пинги
nmap -PS22,80,443 192.168.1.10   # TCP SYN пинг на указанные порты
nmap -PA80,443 192.168.1.10      # TCP ACK пинг (обходит некоторые ACL)
nmap -PU53 192.168.1.10          # UDP пинг
nmap -PR 192.168.1.0/24          # ARP-скан для локальной сети (самый точный)</code></pre>

<h2>2. Типы сканирования портов (что открыто)</h2>
<pre><code class="language-bash">nmap -sS 192.168.1.10            # SYN-скан («полуоткрытый»), по умолчанию от root: быстрый и незаметный
nmap -sT 192.168.1.10            # полное TCP-соединение (работает без root)
nmap -sU 192.168.1.10            # UDP-скан (DNS 53, SNMP 161...); медленный — смотрите --host-timeout
nmap -sU -sS 192.168.1.10        # комбинированный TCP+UDP
nmap -sA 192.168.1.10            # ACK-скан: выявляет правила файрвола (filtered/unfiltered)
nmap -sW 192.168.1.10            # Window-скан (анализ TCP window RST)
nmap -sM 192.168.1.10            # Maimon-скан (FIN/ACK)
nmap -sN -sF -sX 192.168.1.10    # Null/FIN/Xmas — «странные» флаги для обхода старых файрволов
nmap -sO 192.168.1.10            # скан IP-протоколов (TCP, ICMP, GRE...)
nmap -sV 192.168.1.10            # определить версии сервисов на открытых портах
nmap -b ftp.example.com 192.168.1.10  # bounce-скан через FTP-релей</code></pre>

<h2>3. Выбор портов и целей</h2>
<pre><code class="language-bash">nmap -p 80,443 192.168.1.10      # конкретные порты
nmap -p 1-1000 192.168.1.10      # диапазон
nmap -p- 192.168.1.10            # ВСЕ 65535 портов (медленно, но полно)
nmap -p U:53,T:80,443 192.168.1.10   # UDP и TCP порты раздельно
nmap --top-ports 100 192.168.1.10    # топ-100 самых частых портов
nmap -F 192.168.1.10             # быстрый режим (топ-100 портов)
nmap -r 192.168.1.10             # не рандомизировать порядок портов
nmap --exclude 192.168.1.1 192.168.1.0/24   # скан подсети, кроме роутера
nmap --excludefile skip.txt -iL targets.txt  # исключения из файла</code></pre>

<h2>4. Определение сервисов и ОС</h2>
<pre><code class="language-bash">nmap -sV 192.168.1.10            # версии сервисов (banner + probing)
nmap -sV --version-intensity 5 192.168.1.10   # интенсивность probing 0-9 (по умолчанию 7)
nmap -sV --version-light 192.168.1.10        # intensity 2 (быстрее)
nmap -sV --version-all 192.168.1.10          # intensity 9 (дольше, точнее)
nmap -O 192.168.1.10             # определение ОС по TCP/IP-отпечатку
nmap -O --osscan-limit 192.168.1.10          # не пытаться, если нет открытых портов
nmap -A 192.168.1.10             # агрессивный: -sV + -O + скрипты + traceroute
nmap --osscan-guess 192.168.1.10             # агрессивно угадывать ОС</code></pre>

<h2>5. Скорость и тайминги</h2>
<p>Шаблоны <code>-T0…-T5</code>: paranoid, sneaky, polite, normal (по умолчанию), aggressive, insane.</p>
<pre><code class="language-bash">nmap -T4 192.168.1.0/24          # быстрый и надёжный — для своих сетей
nmap -T5 192.168.1.0/24          # очень быстро, больше шума и пропусков
nmap --min-rate 1000 192.168.1.0/24   # минимум 1000 пакетов/сек
nmap --max-rate 100 192.168.1.0/24    # ограничить скорость сверху
nmap --host-timeout 30s 192.168.1.10  # бросить хост после 30 секунд
nmap --min-parallelism 10 192.168.1.0/24  # параллельные пробы на хост</code></pre>

<h2>6. Скрипты NSE — самая мощная часть</h2>
<p>NSE — движок скриптов (Lua). Категории: auth, broadcast, brute, default, discovery, dos, exploit, external, fuzzer, intrusive, malware, safe, version, vuln.</p>
<pre><code class="language-bash">nmap -sC 192.168.1.10            # скрипты категории default (уже включены в -A)
nmap --script vuln 192.168.1.10  # все скрипты уязвимостей
nmap --script=http-vuln-cve2014-3704 192.168.1.10   # конкретный скрипт (Drupal SQLi)
nmap --script "http-*" -p80 192.168.1.10            # все http-скрипты
nmap --script banner 192.168.1.10                   # снять баннеры со всех портов
nmap --script brute -p22,3306,3389 192.168.1.10     # брутфорс SSH/MySQL/RDP
nmap --script vulscan/vulscan.nse -sV 192.168.1.10  # сверка с базой уязвимостей
nmap --script-updatedb               # обновить базу скриптов
ls /usr/share/nmap/scripts/          # посмотреть все скрипты локально</code></pre>
<p>Полезные конкретные скрипты:</p>
<pre><code class="language-bash">nmap --script smb-vuln-ms17-010 -p445 192.168.1.10   # вечный EternalBlue (MS17-010)
nmap --script smb-enum-shares -p445 192.168.1.10     # перечислить SMB-шары
nmap --script ftp-anon -p21 192.168.1.10             # анонимный вход на FTP
nmap --script mysql-info --script-args mysqluser=root -p3306 192.168.1.10
nmap --script ssl-enum-ciphers -p443 example.com     # какие шифры поддерживает TLS</code></pre>

<h2>7. Вывод результатов</h2>
<pre><code class="language-bash">nmap -oN scan.txt 192.168.1.10    # обычный текст
nmap -oX scan.xml 192.168.1.10    # XML (для парсеров, импорт в Metasploit)
nmap -oG scan.gnmap 192.168.1.10  # greppable: один хост на строку
nmap -oA scan 192.168.1.10        # все форматы сразу (scan.nmap/scan.xml/scan.gnmap)
nmap -v 192.168.1.10              # подробный вывод; -vv ещё подробнее
nmap -d 192.168.1.10              # debug-вывод; -dd максимум
nmap --reason 192.168.1.10        # показывать, почему порт считается open/closed
nmap --open 192.168.1.10          # показывать только открытые порты</code></pre>

<h2>8. Обход файрволов и IDS</h2>
<pre><code class="language-bash">nmap -f 192.168.1.10              # фрагментация пакетов
nmap --mtu 24 192.168.1.10        # свой размер MTU (кратно 8)
nmap -D 10.0.0.1,10.0.0.2 192.168.1.10   # decoy: ложные источники рядом с вашим
nmap -S 10.0.0.5 -e eth0 192.168.1.10    # подменить источник (нужен raw socket)
nmap --source-port 53 192.168.1.10       # отправлять с «доверенного» порта DNS
nmap --data-length 25 192.168.1.10       # добавить мусорные байты к пакетам
nmap --randomize-hosts 192.168.1.0/24    # перемешать порядок хостов
nmap --spoof-mac Apple 192.168.1.10      # подменить MAC (vendor или полный адрес)
nmap --badsum 192.168.1.10               # неверные чек-суммы (проверка на IDS)</code></pre>

<h2>9. Готовые рецепты на каждый день</h2>
<pre><code class="language-bash"># Быстрая инвентаризация своей сети
nmap -sn 192.168.1.0/24 && nmap -T4 --top-ports 100 192.168.1.0/24 -oA homenet

# Полный аудит одного хоста (всё сразу)
sudo nmap -A -p- -T4 --script vuln 192.168.1.10 -oA full-audit

# Найти веб-серверы в подсети
nmap -p80,443,8080,8443 --open 192.168.1.0/24

# Проверить Windows-машину (SMB/RDP)
sudo nmap -sS -sU -p T:445,3389,U:137 --script smb-vuln-* 192.168.1.10

# Версии сервисов без шума по конкретным портам
sudo nmap -sV --version-light -Pn -p 22,80,443 192.168.1.10</code></pre>

<h2>10. Шпаргалка по флагам</h2>
<table>
<tr><th>Флаг</th><th>Что делает</th></tr>
<tr><td><code>-sS</code></td><td>SYN-скан (быстрый, скрытый, нужен root)</td></tr>
<tr><td><code>-sU</code></td><td>UDP-скан</td></tr>
<tr><td><code>-sV</code></td><td>Версии сервисов</td></tr>
<tr><td><code>-O</code></td><td>Определение ОС</td></tr>
<tr><td><code>-A</code></td><td>Агрессивный режим (sV+O+скрипты+traceroute)</td></tr>
<tr><td><code>-p-</code></td><td>Все 65535 портов</td></tr>
<tr><td><code>-Pn</code></td><td>Не пинговать, считать хост живым</td></tr>
<tr><td><code>-sn</code></td><td>Только discovery хостов, без портов</td></tr>
<tr><td><code>-sC</code></td><td>Скрипты default-категории</td></tr>
<tr><td><code>-T4</code></td><td>Быстрый шаблон таймингов</td></tr>
<tr><td><code>-oA name</code></td><td>Вывод во все форматы сразу</td></tr>
<tr><td><code>-v</code></td><td>Подробный вывод</td></tr>
</table>

<h2>Легальный дисклеймер</h2>
<p>Сканируйте только свои сети или системы, на которые у вас есть письменное разрешение. Скан чужих хостов в большинстве юрисдикций — уголовное преступление. Используйте Nmap для защиты: аудит своих серверов, лаборатории, учебные стенды (TryHackMe, HackTheBox).</p>
