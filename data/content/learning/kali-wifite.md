---
id: kali-wifite
category: Обучение
title: Wifite — Скрипт Python для автоматизации аудита беспроводной сети с помощью инструментов aircrack-ng
excerpt: Wifite — это инструмент для аудита беспроводных сетей с шифрованием WEP или WPA. Для проведения аудита он использует инструменты aircrack-ng, Pyrit, Reaver, Tshark.
date: 2026-09-17
readTime: 2
tags: [kali, подбор паролей]
featured: false
popular: false
image: ""
metaTitle: Wifite — Скрипт Python для автоматизации аудита беспроводной
metaDescription: Wifite — это инструмент для аудита беспроводных сетей с шифрованием WEP или WPA. Для проведения аудита он использует инструменты aircrack-ng, Pyrit, R
source: kali.org
sourceUrl: https://www.kali.org/tools/wifite/
---

<h2>Что это</h2>
<p>Wifite — это инструмент для аудита беспроводных сетей с шифрованием WEP или WPA. Для проведения аудита он использует инструменты aircrack-ng, Pyrit, Reaver, Tshark.</p>
<details><summary>Оригинал описания (EN)</summary>
<p>Wifite is a tool to audit WEP or WPA encrypted wireless networks. It uses aircrack-ng, pyrit, reaver, tshark tools to perform the audit.</p>
</details>
<h2>Пример использования</h2>
<pre><code class="language-bash">root@kali:~# wifite -h
   .               .    
 .´  ·  .     .  ·  `.  wifite2 2.8.1
 :  :  :  (¯)  :  :  :  a wireless auditor by derv82
 `.  ·  ` /¯\ ´  ·  .´  maintained by kimocoder
   `     /¯¯¯\     ´    https://github.com/kimocoder/wifite2

options:
  -h, --help                    show this help message and exit

SETTINGS:
  -v, --verbose                 Shows more options (-h -v). Prints commands and outputs. (default: quiet)
  -i [interface]                Wireless interface to use, e.g. wlan0mon (default: ask)
  -c [channel]                  Wireless channel to scan e.g. 1,3-6 (default: all 2Ghz channels)
  -inf, --infinite              Enable infinite attack mode. Modify scanning time with -p (default: off)
  -mac, --random-mac            Randomize wireless card MAC address (default: off)
  -p [scan_time]                Pillage: Attack all targets after scan_time (seconds)
  --kill                        Kill processes that conflict with Airmon/Airodump (default: off)
  -pow, --power [min_power]     Attacks any targets with at least min_power signal strength
  --skip-crack                  Skip cracking captured handshakes/pmkid (default: off)
  -first, --first [attack_max]  Attacks the first attack_max targets
  -ic, --ignore-cracked         Hides previously-cracked targets. (default: off)
  --clients-only                Only show targets that have associated clients (default: off)
  --nodeauths                   Passive mode: Never deauthenticates clients (default: deauth targets)
  --daemon                      Puts device back in managed mode after quitting (default: off)

WEP:
  --wep                         Show only WEP-encrypted networks
  --require-fakeauth            Fails attacks if fake-auth fails (default: off)
  --keep-ivs                    Re</code></pre>
<h2>Пакеты и установка</h2>
<h3>wifite</h3>
<p><strong>Скрипт Python для автоматизации аудита беспроводной сети с помощью инструментов aircrack-ng</strong><br>Установка: <code>sudo apt install wifite</code></p>
<h2>Официальная документация</h2>
<p><a href="https://www.kali.org/tools/wifite/" target="_blank" rel="noopener">https://www.kali.org/tools/wifite/</a></p>
