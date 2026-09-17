---
id: kali-reaver
category: Обучение
title: Reaver — Инструмент грубой силы для атаки на PIN-код защищенной настройки Wi-Fi
excerpt: Reaver выполняет грубую атаку на пин-код точки доступа Wi-Fi Protected Setup. Как только контакт WPS будет найден, WPA PSK можно будет восстановить, а также перенастроить настройки беспроводной сети точки доступа. Этот пакет также содержит 
date: 2026-09-17
readTime: 2
tags: [kali, сканирование и разведка]
featured: false
popular: false
image: ""
metaTitle: Reaver — Инструмент грубой силы для атаки на PIN-код защищен
metaDescription: Reaver выполняет грубую атаку на пин-код точки доступа Wi-Fi Protected Setup. Как только контакт WPS будет найден, WPA PSK можно будет восстановить, а
source: kali.org
sourceUrl: https://www.kali.org/tools/reaver/
---

<h2>Что это</h2>
<p>Reaver выполняет грубую атаку на пин-код точки доступа Wi-Fi Protected Setup. Как только контакт WPS будет найден, WPA PSK можно будет восстановить, а также перенастроить настройки беспроводной сети точки доступа. Этот пакет также содержит исполняемый файл Wash — утилиту для определения точек доступа с поддержкой WPS. См. документацию в /usr/share/doc/reaver/README.WASH.</p>
<details><summary>Оригинал описания (EN)</summary>
<p>Reaver performs a brute force attack against an access point&rsquo;s Wi-Fi Protected Setup pin number. Once the WPS pin is found, the WPA PSK can be recovered and alternately the AP&rsquo;s wireless settings can be reconfigured. This package also provides the Wash executable, an utility for identifying WPS enabled access points. See documentation in /usr/share/doc/reaver/README.WASH.</p>
</details>
<h2>Пример использования</h2>
<pre><code class="language-bash">root@kali:~# reaver -h

Reaver v1.6.6 WiFi Protected Setup Attack Tool
Copyright (c) 2011, Tactical Network Solutions, Craig Heffner &lt;[email&#160;protected]>

Required Arguments:
	-i, --interface=&lt;wlan>          Name of the monitor-mode interface to use
	-b, --bssid=&lt;mac>               BSSID of the target AP

Optional Arguments:
	-m, --mac=&lt;mac>                 MAC of the host system
	-e, --essid=&lt;ssid>              ESSID of the target AP
	-c, --channel=&lt;channel>         Set the 802.11 channel for the interface (implies -f)
	-s, --session=&lt;file>            Restore a previous session file
	-C, --exec=&lt;command>            Execute the supplied command upon successful pin recovery
	-f, --fixed                     Disable channel hopping
	-5, --5ghz                      Use 5GHz 802.11 channels
	-v, --verbose                   Display non-critical warnings (-vv or -vvv for more)
	-q, --quiet                     Only display critical messages
	-h, --help                      Show help

Advanced Options:
	-p, --pin=&lt;wps pin>             Use the specified pin (may be arbitrary string or 4/8 digit WPS pin)
	-d, --delay=&lt;seconds>           Set the delay between pin attempts [1]
	-l, --lock-delay=&lt;seconds>      Set the time to wait if the AP locks WPS pin attempts [60]
	-g, --max-attempts=&lt;num>        Quit after num pin attempts
	-x, --fail-wait=&lt;seconds>       Set the time to sleep after 10 unexpected failures [0]
	-r, --recurring-delay=&lt;x:y>     Sleep for y seconds every x pin attempts
	-t, --timeout=&lt;seconds>         Set the receive timeout period [10]
	-T, --m57-timeout=&lt;seconds>     Set the M5/M7 timeout period [0.40]
	-A, --no-associate              Do not associate with the AP (association must be done by another application)
	-N, --no-nacks                  Do not send NAC</code></pre>
<h2>Пакеты и установка</h2>
<h3>reaver</h3>
<p><strong>Инструмент грубой силы для атаки на PIN-код защищенной настройки Wi-Fi</strong><br>Установка: <code>sudo apt install reaver</code></p>
<h2>Официальная документация</h2>
<p><a href="https://www.kali.org/tools/reaver/" target="_blank" rel="noopener">https://www.kali.org/tools/reaver/</a></p>
