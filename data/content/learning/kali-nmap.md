---
id: kali-nmap
category: Обучение
title: Nmap — Сетевой картограф
excerpt: Nmap — утилита для исследования сети или аудита безопасности. Он поддерживает пинг-сканирование (определение работоспособности хостов), множество методов сканирования портов, определение версий (определение сервисных протоколов и версий при
date: 2026-09-17
readTime: 2
tags: [kali, сканирование и разведка]
featured: false
popular: false
image: ""
metaTitle: Nmap — Сетевой картограф
metaDescription: Nmap — утилита для исследования сети или аудита безопасности. Он поддерживает пинг-сканирование (определение работоспособности хостов), множество мето
source: kali.org
sourceUrl: https://www.kali.org/tools/nmap/
---

<h2>Что это</h2>
<p>Nmap — утилита для исследования сети или аудита безопасности. Он поддерживает пинг-сканирование (определение работоспособности хостов), множество методов сканирования портов, определение версий (определение сервисных протоколов и версий приложений, прослушивающих порты), а также снятие отпечатков пальцев TCP/IP (операция удаленного хоста или идентификация устройства). Nmap также предлагает гибкую спецификацию цели и порта, ложное/скрытое сканирование, сканирование sunRPC и многое другое. Большинство платформ Unix и Windows поддерживаются как в режиме графического интерфейса, так и в режиме командной строки. Также поддерживаются несколько популярных портативных устройств, включая Sharp Zaurus и iPAQ.</p>
<details><summary>Оригинал описания (EN)</summary>
<p>Nmap is a utility for network exploration or security auditing. It supports ping scanning (determine which hosts are up), many port scanning techniques, version detection (determine service protocols and application versions listening behind ports), and TCP/IP fingerprinting (remote host OS or device identification). Nmap also offers flexible target and port specification, decoy/stealth scanning, sunRPC scanning, and more. Most Unix and Windows platforms are supported in both GUI and commandline modes. Several popular handheld devices are also supported, including the Sharp Zaurus and the iPAQ.</p>
</details>
<h2>Пример использования</h2>
<pre><code class="language-bash">root@kali:~# ncat -h
Ncat 7.99 ( https://nmap.org/ncat )
Usage: ncat [options] [hostname] [port]

Options taking a time assume seconds. Append 'ms' for milliseconds,
's' for seconds, 'm' for minutes, or 'h' for hours (e.g. 500ms).
  -4                         Use IPv4 only
  -6                         Use IPv6 only
  -U, --unixsock             Use Unix domain sockets only
      --vsock                Use vsock sockets only
  -C, --crlf                 Use CRLF for EOL sequence
  -c, --sh-exec &lt;command>    Executes the given command via /bin/sh
  -e, --exec &lt;command>       Executes the given command
      --lua-exec &lt;filename>  Executes the given Lua script
  -g hop1[,hop2,...]         Loose source routing hop points (8 max)
  -G &lt;n>                     Loose source routing hop pointer (4, 8, 12, ...)
  -m, --max-conns &lt;n>        Maximum &lt;n> simultaneous connections
  -h, --help                 Display this help screen
  -d, --delay &lt;time>         Wait between read/writes
  -o, --output &lt;filename>    Dump session data to a file
  -x, --hex-dump &lt;filename>  Dump session data as hex to a file
  -i, --idle-timeout &lt;time>  Idle read/write timeout
  -p, --source-port port     Specify source port to use
  -s, --source addr          Specify source address to use (doesn't affect -l)
  -l, --listen               Bind and listen for incoming connections
  -k, --keep-open            Accept multiple connections in listen mode
  -n, --nodns                Do not resolve hostnames via DNS
  -t, --telnet               Answer Telnet negotiations
  -u, --udp                  Use UDP instead of default TCP
      --sctp                 Use SCTP instead of default TCP
  -v, --verbose              Set verbosity level (can be used several times)
  -w, --wait &lt;time>          Connect timeout
  </code></pre>
<h2>Пакеты и установка</h2>
<h3>ncat</h3>
<p><strong>Повторная реализация NMAP netcat</strong><br>Установка: <code>sudo apt install ncat</code></p>
<h3>ndiff</h3>
<p><strong>Network Mapper — утилита сравнения результатов</strong><br>Установка: <code>sudo apt install ndiff</code></p>
<h3>nmap</h3>
<p><strong>Сетевой картограф</strong><br>Установка: <code>sudo apt install nmap</code></p>
<h3>nmap-common</h3>
<p><strong>Независимые от архитектуры файлы для nmap</strong><br>Установка: <code>sudo apt install nmap-common</code></p>
<h3>zenmap</h3>
<p><strong>Внешний интерфейс Network Mapper</strong><br>Установка: <code>sudo apt install zenmap</code></p>
<h2>Официальная документация</h2>
<p><a href="https://www.kali.org/tools/nmap/" target="_blank" rel="noopener">https://www.kali.org/tools/nmap/</a></p>
